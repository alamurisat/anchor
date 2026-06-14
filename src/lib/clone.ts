// Sends a recorded sample to the secure clone endpoint and returns the new
// voice id (or null on failure). The API key never leaves the server.

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function cloneVoice(
  name: string,
  relationship: string,
  sample: Blob
): Promise<string | null> {
  try {
    const audioBase64 = await blobToBase64(sample);
    const res = await fetch("/api/clone", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        description: relationship ? `${name}, ${relationship}` : name,
        audioBase64,
        mimeType: sample.type || "audio/webm",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.voiceId ?? null;
  } catch {
    return null;
  }
}
