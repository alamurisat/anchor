import { useEffect, useRef, useState } from "react";
import { stories, storyTopics, type Story } from "../data";
import { usePersistentState } from "../lib/usePersistentState";
import { ANCHOR_COMPANION, playSrc, playVoiceMessage, stopVoice } from "../lib/voice";
import { Icon } from "./Icons";

type StoryKeeperProps = {
  onBack: () => void;
};

function clock(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function StoryKeeper({ onBack }: StoryKeeperProps) {
  const [archive, setArchive] = usePersistentState<Story[]>("storykeeper.archive", stories);
  const [query, setQuery] = useState("");
  const [recording, setRecording] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopVoice();
    };
  }, []);

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  async function recordAnswer(topicId: string, question: string) {
    // Tapping the same question again stops the recording.
    if (recording === question) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const src = await blobToDataUrl(blob);
        const secs = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecording(null);
        setArchive((list) => [
          { id: `st-${Date.now()}`, topicId, question, kind: "voice", duration: clock(secs), date: "Today", src },
          ...list,
        ]);
      };
      recorder.start();
      startRef.current = Date.now();
      setRecording(question);
    } catch {
      setRecording(null);
    }
  }

  async function togglePlay(id: string) {
    if (playingId === id) {
      stopVoice();
      setPlayingId(null);
      return;
    }
    const story = archive.find((s) => s.id === id);
    if (!story) return;
    setPlayingId(id);
    const done = () => setPlayingId((cur) => (cur === id ? null : cur));
    // Play the real recording, or read the question aloud for the sample stories.
    const result = story.src
      ? await playSrc(story.src, done)
      : await playVoiceMessage(story.question, ANCHOR_COMPANION.id, done);
    if (!result.ok && result.reason !== "superseded") setPlayingId(null);
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? archive.filter(
        (s) =>
          s.question.toLowerCase().includes(q) ||
          (s.text ?? "").toLowerCase().includes(q) ||
          (storyTopics.find((t) => t.id === s.topicId)?.label ?? "")
            .toLowerCase()
            .includes(q)
      )
    : archive;

  const topicLabel = (id: string) =>
    storyTopics.find((t) => t.id === id)?.label ?? "";

  return (
    <div className="storykeeper">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>StoryKeeper</h1>
          <p>Preserve the stories worth keeping</p>
        </div>
      </header>

      <section className="prompts" aria-label="Guided questions">
        <h2 className="calls__heading">Tell a story</h2>
        {storyTopics.map((t) => (
          <div key={t.id} className="topic">
            <div className="topic__head">
              <span className="topic__icon">
                <Icon name={t.icon} className="icon" />
              </span>
              {t.label}
            </div>
            <div className="topic__qs">
              {t.questions.map((question) => {
                const isRec = recording === question;
                return (
                  <button
                    key={question}
                    type="button"
                    className={`qbtn ${isRec ? "is-rec" : ""}`}
                    onClick={() => recordAnswer(t.id, question)}
                    disabled={recording !== null && !isRec}
                  >
                    {isRec ? (
                      <>
                        <span className="record__dot" aria-hidden="true" />
                        Recording…
                      </>
                    ) : (
                      <>
                        <Icon name="mic" className="qbtn__icon" />
                        {question}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="archive" aria-label="Story archive">
        <h2 className="calls__heading">Your archive</h2>
        <div className="ask">
          <span className="ask__icon" aria-hidden="true">
            <Icon name="search" className="icon" />
          </span>
          <input
            className="ask__input"
            type="text"
            value={query}
            placeholder="Search your stories…"
            aria-label="Search stories"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="calls__empty">No stories match that yet.</p>
        ) : (
          filtered.map((s) => {
            const playing = playingId === s.id;
            return (
              <article key={s.id} className="story">
                <div className="story__meta">
                  <span className="story__topic">{topicLabel(s.topicId)}</span>
                  <span className="story__date">{s.date}</span>
                </div>
                <p className="story__q">“{s.question}”</p>
                {s.kind === "text" ? (
                  <p className="story__text">{s.text}</p>
                ) : (
                  <button
                    type="button"
                    className={`listen ${playing ? "is-playing" : ""}`}
                    onClick={() => togglePlay(s.id)}
                  >
                    <Icon name={playing ? "close" : "play"} className="listen__icon" />
                    {playing ? (
                      <>
                        <span>Playing…</span>
                        <span className="wave" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                          <span />
                        </span>
                      </>
                    ) : (
                      <span>Listen · {s.duration}</span>
                    )}
                  </button>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
