export type ChatMessage = { role: "user" | "assistant"; content: string };

// Sends the conversation to the secure /api/chat endpoint (Claude) and returns
// the spoken reply, or null on any failure so callers can fall back gracefully.
export async function askAnchor(messages: ChatMessage[]): Promise<string | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const reply = (data.reply ?? "").trim();
    return reply || null;
  } catch {
    return null;
  }
}
