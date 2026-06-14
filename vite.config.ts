import { defineConfig, loadEnv, type Connect } from "vite";
import react from "@vitejs/plugin-react";

// Calls ElevenLabs text-to-speech and returns audio. Shared by the dev
// middleware below and the Vercel function in /api/tts.ts.
async function synthesize(apiKey: string, text: string, voiceId: string) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
}

const CHAT_SYSTEM = `You are Anchor, a warm and calm companion for Angela, who has early-to-mid stage dementia.
Speak in one or two short, simple, reassuring sentences — your reply is read aloud, so keep it brief and gentle.
Use plain, everyday language. Never correct her harshly or argue; if she seems confused, gently reorient her with kindness.
Context you can use naturally: she is safe at home; today is Tuesday; her daughter Sarah visits often and loves her; her husband is Tom; her grandson is Jack.
If she asks who someone is or where she is, answer simply and warmly.
Never say you are an AI, an assistant, or a model. Reply only with the words to speak to Angela — no preamble, no labels.`;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY || "";
  const anthropicKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || "";

  return {
    plugins: [
      react(),
      {
        // Local dev equivalent of /api/chat — Claude reply, key stays server-side.
        name: "anchor-chat-dev",
        configureServer(server) {
          server.middlewares.use("/api/chat", (req, res, next) => {
            if (req.method !== "POST") return next();
            (async () => {
              try {
                let raw = "";
                for await (const chunk of req) raw += chunk;
                const { messages } = JSON.parse(raw || "{}");
                if (!anthropicKey) {
                  res.statusCode = 503;
                  res.setHeader("content-type", "application/json");
                  return res.end(JSON.stringify({ error: "no_api_key" }));
                }
                if (!Array.isArray(messages) || messages.length === 0) {
                  res.statusCode = 400;
                  res.setHeader("content-type", "application/json");
                  return res.end(JSON.stringify({ error: "bad_request" }));
                }
                const { default: Anthropic } = await import("@anthropic-ai/sdk");
                const client = new Anthropic({ apiKey: anthropicKey });
                const response = await client.messages.create({
                  model: "claude-opus-4-8",
                  max_tokens: 200,
                  system: CHAT_SYSTEM,
                  messages,
                });
                const reply = response.content
                  .filter((b) => b.type === "text")
                  .map((b) => (b as { text: string }).text)
                  .join(" ")
                  .trim();
                res.statusCode = 200;
                res.setHeader("content-type", "application/json");
                res.end(JSON.stringify({ reply }));
              } catch {
                res.statusCode = 500;
                res.setHeader("content-type", "application/json");
                res.end(JSON.stringify({ error: "chat_failed" }));
              }
            })();
          });
        },
      },
      {
        // Local dev equivalent of /api/tts so the key never reaches the browser.
        name: "anchor-tts-dev",
        configureServer(server) {
          const handler: Connect.SimpleHandleFunction = async (req, res) => {
            try {
              let raw = "";
              for await (const chunk of req) raw += chunk;
              const { text, voiceId } = JSON.parse(raw || "{}");

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader("content-type", "application/json");
                return res.end(JSON.stringify({ error: "no_api_key" }));
              }
              if (!text || !voiceId) {
                res.statusCode = 400;
                res.setHeader("content-type", "application/json");
                return res.end(JSON.stringify({ error: "bad_request" }));
              }

              const r = await synthesize(apiKey, text, voiceId);
              if (!r.ok) {
                res.statusCode = r.status;
                res.setHeader("content-type", "application/json");
                return res.end(JSON.stringify({ error: "tts_failed" }));
              }
              const buf = Buffer.from(await r.arrayBuffer());
              res.statusCode = 200;
              res.setHeader("content-type", "audio/mpeg");
              res.end(buf);
            } catch {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ error: "server_error" }));
            }
          };
          server.middlewares.use("/api/tts", (req, res, next) => {
            if (req.method !== "POST") return next();
            handler(req, res);
          });
        },
      },
    ],
    server: {
      port: 3000,
      strictPort: true,
    },
  };
});
