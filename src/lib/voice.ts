import { personName, todayLabel } from "../data";

export type VoiceProfile = {
  id: string; // ElevenLabs voiceId
  name: string;
  relationship: string;
  // Family voices start un-cloned (placeholder id) until a real recording is processed.
  cloned: boolean;
};

// The default narrator voice.
export const ANCHOR_COMPANION: VoiceProfile = {
  id: "uIZsnBL0YK1S5j69bAih",
  name: "Samantha",
  relationship: "Anchor companion",
  cloned: true,
};

export const defaultVoices: VoiceProfile[] = [
  ANCHOR_COMPANION,
  // Mapped to warm, reassuring ElevenLabs voices on the account.
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", relationship: "Daughter", cloned: true },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "John", relationship: "Son", cloned: true },
];

// A warm, plain-language grounding message assembled from the current context.
export function buildGroundingMessage(): string {
  return `Hi ${personName}. You are safe at home right now. It is ${todayLabel}. Sarah will be visiting later today. Everything is okay.`;
}

// One shared, reusable audio element. Reusing a single element (rather than
// `new Audio()` each time) lets us "unlock" it once on a user tap so Safari /
// Firefox allow later programmatic playback (their autoplay policies otherwise
// block audio that follows an async fetch).
let audioEl: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
let primed = false;
// Every play/stop bumps this. Any in-flight request whose token is stale is
// discarded, so only one voice is ever heard (no overlapping audio).
let playToken = 0;

const SILENT =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function getEl(): HTMLAudioElement {
  if (!audioEl) audioEl = new Audio();
  return audioEl;
}

// Call from a real user gesture (e.g. first tap) to satisfy autoplay policies.
export function primeAudio() {
  if (primed) return;
  const a = getEl();
  try {
    a.src = SILENT;
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        a.pause();
        a.currentTime = 0;
        primed = true;
      }).catch(() => {});
    } else {
      primed = true;
    }
  } catch {
    /* ignore */
  }
}

function teardown() {
  if (audioEl) audioEl.pause();
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
}

export function stopVoice() {
  playToken++;
  teardown();
}

export type PlayResult = { ok: boolean; reason?: string };

// Plays an already-recorded audio source (a data URL), using the same single
// audio controller so it never overlaps with spoken messages.
export async function playSrc(src: string, onEnded?: () => void): Promise<PlayResult> {
  const token = ++playToken;
  teardown();
  try {
    const a = getEl();
    a.src = src;
    a.onended = () => {
      if (token === playToken) onEnded?.();
    };
    await a.play();
    return { ok: true };
  } catch {
    return { ok: false, reason: "play" };
  }
}

// Requests speech from the secure endpoint and plays it. Returns ok:false on
// any failure so callers can fall back to showing the text on screen.
export async function playVoiceMessage(
  text: string,
  voiceId: string,
  onEnded?: () => void
): Promise<PlayResult> {
  const token = ++playToken; // claim the latest play
  teardown(); // stop whatever is playing now, without invalidating this token

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, voiceId }),
    });

    if (token !== playToken) return { ok: false, reason: "superseded" };

    if (!res.ok) {
      let reason = "tts_failed";
      try {
        reason = (await res.json()).error ?? reason;
      } catch {
        /* ignore */
      }
      return { ok: false, reason };
    }

    const blob = await res.blob();
    if (token !== playToken) return { ok: false, reason: "superseded" };
    if (!blob.type.startsWith("audio")) return { ok: false, reason: "not_audio" };

    const url = URL.createObjectURL(blob);
    currentUrl = url;
    const a = getEl();
    a.src = url;
    a.onended = () => {
      if (token === playToken) onEnded?.();
    };
    await a.play();
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}
