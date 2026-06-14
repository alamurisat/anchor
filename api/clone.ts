export const config = { runtime: "nodejs" };

function extFor(mimeType: string) {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "mp3";
  return "webm";
}

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
  const { name, description, audioBase64, mimeType } = body;
  if (!name || !audioBase64) {
    res.status(400).json({ error: "bad_request" });
    return;
  }

  try {
    const buffer = Buffer.from(audioBase64, "base64");
    const type = mimeType || "audio/webm";
    const form = new FormData();
    form.append("name", name);
    if (description) form.append("description", description);
    form.append("files", new Blob([buffer], { type }), `sample.${extFor(type)}`);

    const r = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: form,
    });

    if (!r.ok) {
      res.status(r.status).json({ error: "clone_failed" });
      return;
    }

    const data = await r.json();
    res.status(200).json({ voiceId: data.voice_id });
  } catch {
    res.status(500).json({ error: "server_error" });
  }
}
