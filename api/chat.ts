import Anthropic from "@anthropic-ai/sdk";

export const config = { runtime: "nodejs" };

const SYSTEM = `You are Anchor, a warm and calm companion for Angela, who has early-to-mid stage dementia.
Speak in one or two short, simple, reassuring sentences — your reply is read aloud, so keep it brief and gentle.
Use plain, everyday language. Never correct her harshly or argue; if she seems confused, gently reorient her with kindness.
Context you can use naturally: she is safe at home; today is Tuesday; her daughter Sarah visits often and loves her; her husband is Tom; her grandson is Jack.
If she asks who someone is or where she is, answer simply and warmly.
Never say you are an AI, an assistant, or a model. Reply only with the words to speak to Angela — no preamble, no labels.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "no_api_key" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    res.status(400).json({ error: "bad_request" });
    return;
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 200,
      system: SYSTEM,
      messages,
    });
    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b: any) => b.text)
      .join(" ")
      .trim();
    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "chat_failed" });
  }
}
