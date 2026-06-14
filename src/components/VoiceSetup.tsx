import { useEffect, useRef, useState } from "react";
import { personName } from "../data";
import { playVoiceMessage, stopVoice, type VoiceProfile } from "../lib/voice";
import { cloneVoice } from "../lib/clone";
import { Icon } from "./Icons";

type VoiceSetupProps = {
  voices: VoiceProfile[];
  onAdd: (voice: VoiceProfile) => void;
  onBack: () => void;
};

const TARGET = 60; // seconds of audio to capture

function clock(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function VoiceSetup({ voices, onAdd, onBack }: VoiceSetupProps) {
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const timer = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (capturedUrl) URL.revokeObjectURL(capturedUrl);
      stopVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function preview(voice: VoiceProfile) {
    if (previewId === voice.id) {
      stopVoice();
      setPreviewId(null);
      return;
    }
    const sample = `Hello ${personName}, it's ${voice.name}. It's so good to hear from you.`;
    setPreviewId(voice.id);
    const result = await playVoiceMessage(sample, voice.id, () =>
      setPreviewId((cur) => (cur === voice.id ? null : cur))
    );
    if (!result.ok) setPreviewId(null);
  }

  function stopRecording() {
    if (timer.current) window.clearInterval(timer.current);
    setRecording(false);
    recorderRef.current?.stop();
  }

  // Record straight from the microphone, then keep the audio for cloning.
  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        blobRef.current = blob;
        if (capturedUrl) URL.revokeObjectURL(capturedUrl);
        setCapturedUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCaptured(true);
      };
      recorder.start();
      setError(null);
      setStatus("idle");
      setCaptured(false);
      setElapsed(0);
      setRecording(true);
      timer.current = window.setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= TARGET) {
            window.clearInterval(timer.current!);
            window.setTimeout(() => stopRecording(), 0);
            return TARGET;
          }
          return next;
        });
      }, 1000);
    } catch {
      setError("We couldn't reach the microphone. Please allow mic access and try again.");
    }
  }

  const canSave =
    consent && name.trim() !== "" && captured && status !== "uploading";

  async function save() {
    if (!canSave || !blobRef.current) return;
    setStatus("uploading");
    setError(null);
    const voiceId = await cloneVoice(name.trim(), relationship.trim(), blobRef.current);
    if (voiceId) {
      onAdd({
        id: voiceId,
        name: name.trim(),
        relationship: relationship.trim() || "Family",
        cloned: true,
      });
      setName("");
      setRelationship("");
      setConsent(false);
      setCaptured(false);
      setElapsed(0);
      if (capturedUrl) URL.revokeObjectURL(capturedUrl);
      setCapturedUrl(null);
      blobRef.current = null;
      setStatus("idle");
    } else {
      setStatus("error");
      setError(
        "We couldn't create the voice. Cloning needs an ElevenLabs plan that allows it, and the recording must be clear. Please try again."
      );
    }
  }

  const progress = Math.round((elapsed / TARGET) * 100);
  const uploading = status === "uploading";

  return (
    <div className="vs">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Voice Companion Setup</h1>
          <p>Record a familiar voice for {personName} to hear</p>
        </div>
      </header>

      <label className="vs-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          I consent to recording my voice and letting Anchor use it to comfort{" "}
          {personName} during moments of confusion.
        </span>
      </label>

      <div className="vs-field">
        <span className="vs-label">Your name</span>
        <input
          className="vs-input"
          type="text"
          value={name}
          placeholder="e.g. Sarah"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="vs-field">
        <span className="vs-label">Your relationship</span>
        <input
          className="vs-input"
          type="text"
          value={relationship}
          placeholder="e.g. Daughter"
          onChange={(e) => setRelationship(e.target.value)}
        />
      </div>

      <section className="vs-recorder">
        <p className="vs-recorder__prompt">
          When you’re ready, read a few warm sentences aloud for about a minute.
          Something like: “Hi {personName || "Mum"}, it’s me. You’re safe, and I
          love you.”
        </p>

        <div className="vs-recorder__stage">
          {recording ? (
            <button type="button" className="vs-rec vs-rec--stop" onClick={stopRecording}>
              <span className="vs-rec__dot" aria-hidden="true" />
              Stop recording
            </button>
          ) : (
            <button
              type="button"
              className="vs-rec"
              onClick={startRecording}
              disabled={!consent || uploading}
            >
              <span className="vs-rec__mic">
                <Icon name="mic" className="icon" />
              </span>
              {captured ? "Record again" : "Start recording"}
            </button>
          )}

          <div className="vs-progress">
            <div className="vs-progress__bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="vs-time">
            {clock(elapsed)} / {clock(TARGET)}
            {captured && !recording ? " · captured" : ""}
          </span>
        </div>

        {captured && capturedUrl && !recording && (
          <audio className="vs-preview" src={capturedUrl} controls aria-label="Your recording" />
        )}

        {!consent && (
          <p className="vs-recorder__note">Please give consent above to record.</p>
        )}
        {error && (
          <p className="vs-recorder__note vs-recorder__note--error" role="status">
            {error}
          </p>
        )}
      </section>

      <button type="button" className="vs-save" onClick={save} disabled={!canSave}>
        {uploading ? "Creating voice…" : "Save voice profile"}
      </button>

      <section className="vs-saved" aria-label="Saved voices">
        <h2 className="calls__heading">Saved voices</h2>
        {voices.map((v) => (
          <div key={v.id} className="vs-voice">
            <span className="vs-voice__avatar" aria-hidden="true">
              <Icon name="volume" className="icon" />
            </span>
            <span className="vs-voice__text">
              <span className="vs-voice__name">{v.name}</span>
              <span className="vs-voice__rel">{v.relationship}</span>
            </span>
            {v.cloned ? (
              <button
                type="button"
                className={`vs-voice__play ${previewId === v.id ? "is-on" : ""}`}
                onClick={() => preview(v)}
                aria-label={`Hear ${v.name}'s voice`}
              >
                <Icon name={previewId === v.id ? "close" : "play"} className="icon" />
                {previewId === v.id ? "Playing" : "Hear"}
              </button>
            ) : (
              <span className="vs-voice__tag">Processing</span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
