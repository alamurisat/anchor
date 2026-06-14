import { useEffect, useRef, useState } from "react";
import { personName, type AddedMemory, type MediaType } from "../data";
import { Icon } from "./Icons";

type AddMemoryCardProps = {
  onAdd: (memory: AddedMemory) => void;
};

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1000;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const accept: Record<MediaType, string> = {
  photo: "image/*",
  video: "video/*",
  voice: "audio/*",
};

const label: Record<MediaType, string> = {
  photo: "Photo",
  video: "Video",
  voice: "Voice",
};

function clock(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function AddMemoryCard({ onAdd }: AddMemoryCardProps) {
  const [draft, setDraft] = useState<{ type: MediaType; src: string } | null>(null);
  const [caption, setCaption] = useState("");
  const [saved, setSaved] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const pickType = useRef<MediaType>("photo");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recTimer.current) window.clearInterval(recTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function choose(type: MediaType) {
    pickType.current = type;
    if (fileRef.current) {
      fileRef.current.accept = accept[type];
      fileRef.current.value = "";
      fileRef.current.click();
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = pickType.current;
    try {
      const src = type === "photo" ? await readImage(file) : await readAsDataUrl(file);
      setSaved(false);
      setCaption("");
      setDraft({ type, src });
    } catch {
      /* unreadable file — ignore */
    }
  }

  // Record a voice note straight from the microphone (iMessage-style).
  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      // No mic support — fall back to picking an audio file.
      choose("voice");
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
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const src = await readAsDataUrl(blob);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setSaved(false);
        setCaption("");
        setDraft({ type: "voice", src });
      };
      recorder.start();
      setElapsed(0);
      setRecording(true);
      recTimer.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      // Permission denied — fall back to file upload.
      choose("voice");
    }
  }

  function stopRecording() {
    if (recTimer.current) window.clearInterval(recTimer.current);
    setRecording(false);
    recorderRef.current?.stop();
  }

  function save() {
    if (!draft) return;
    onAdd({
      id: `am-${Date.now()}`,
      type: draft.type,
      caption: caption.trim() || `A ${draft.type} for ${personName}`,
      src: draft.src,
    });
    setDraft(null);
    setCaption("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2800);
  }

  return (
    <section className="add" aria-label="Add a memory">
      <div className="add__head">
        <h2>Add a memory</h2>
        <p>Photos, videos, and voice notes help {personName} feel grounded.</p>
      </div>

      <input ref={fileRef} type="file" className="add__file" onChange={onFile} hidden />

      {recording ? (
        <div className="recorder">
          <div className="recorder__top">
            <span className="recorder__orb" aria-hidden="true">
              <span className="recorder__ring" />
              <span className="recorder__dot" />
            </span>
            <span className="recorder__time">{clock(elapsed)}</span>
            <span className="recorder__wave" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${(i % 8) * 0.16}s` }} />
              ))}
            </span>
          </div>
          <button type="button" className="recorder__stop" onClick={stopRecording}>
            <span className="recorder__stopsq" aria-hidden="true" />
            Stop &amp; use
          </button>
        </div>
      ) : !draft ? (
        <div className="add__row">
          <button type="button" className="add__btn" onClick={() => choose("photo")}>
            <Icon name="photo" className="add__icon" />
            Photo
          </button>
          <button type="button" className="add__btn" onClick={() => choose("video")}>
            <Icon name="video" className="add__icon" />
            Video
          </button>
          <button type="button" className="add__btn" onClick={startRecording}>
            <Icon name="mic" className="add__icon" />
            Voice
          </button>
        </div>
      ) : (
        <div className="add__draft">
          <div className="add__preview">
            {draft.type === "photo" && <img src={draft.src} alt="" />}
            {draft.type === "video" && <video src={draft.src} controls />}
            {draft.type === "voice" && <audio src={draft.src} controls />}
          </div>
          <input
            className="add__caption"
            type="text"
            value={caption}
            placeholder={`Add a note about this ${label[draft.type].toLowerCase()}…`}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="add__draft-actions">
            <button type="button" className="add__save" onClick={save}>
              Save memory
            </button>
            <button type="button" className="add__cancel" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className={`add__note ${saved ? "add__note--show" : ""}`} role="status">
        Thank you. Your memory was added to {personName}’s collection.
      </p>
    </section>
  );
}
