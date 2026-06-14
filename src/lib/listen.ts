// Thin wrapper over the browser Speech Recognition API (Chrome/Edge).
// Returns a stop() function, or null if speech recognition isn't supported.
export function startRecognition(
  onResult: (text: string) => void,
  onFail: () => void
): (() => void) | null {
  const SR =
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

  if (!SR) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rec = new (SR as any)();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  let done = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rec.onresult = (e: any) => {
    done = true;
    const text = e.results?.[0]?.[0]?.transcript ?? "";
    if (text) onResult(text);
    else onFail();
  };
  rec.onerror = () => {
    if (!done) {
      done = true;
      onFail();
    }
  };
  rec.onend = () => {
    if (!done) {
      done = true;
      onFail();
    }
  };

  try {
    rec.start();
  } catch {
    return null;
  }

  return () => {
    try {
      rec.abort();
    } catch {
      /* ignore */
    }
  };
}
