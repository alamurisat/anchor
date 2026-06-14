// Vercel serverless function: POST /api/tts
// Generates speech with ElevenLabs and returns audio. The API key stays on
// the server (ELEVENLABS_API_KEY) and is never exposed to the frontend.

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "no_api_key" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { text, voiceId } = body;
  if (!text || !voiceId) {
    res.status(400).json({ error: "bad_request" });
    return;
  }

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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

    if (!r.ok) {
      res.status(r.status).json({ error: "tts_failed" });
      return;
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("content-type", "audio/mpeg");
    res.status(200).send(buf);
  } catch {
    res.status(500).json({ error: "server_error" });
  }
}
