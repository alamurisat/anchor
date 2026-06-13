import { useEffect, useRef, useState } from "react";
import { journalEntries, moods, type JournalEntry } from "../data";
import { Icon } from "./Icons";

type JournalProps = {
  onBack: () => void;
};

type Composer = "write" | "voice";

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function nowTime(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export default function Journal({ onBack }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(journalEntries);
  const [composer, setComposer] = useState<Composer>("write");
  const [moodId, setMoodId] = useState<string>("calm");
  const [draft, setDraft] = useState("");

  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recTimer = useRef<number | null>(null);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const playTimer = useRef<number | null>(null);

  const moodById = (id: string) => moods.find((m) => m.id === id) ?? moods[0];

  useEffect(() => {
    return () => {
      if (recTimer.current) window.clearInterval(recTimer.current);
      if (playTimer.current) window.clearTimeout(playTimer.current);
    };
  }, []);

  function saveText() {
    const text = draft.trim();
    if (!text) return;
    setEntries((list) => [
      {
        id: `j-${Date.now()}`,
        date: "Today",
        time: nowTime(),
        moodId,
        kind: "text",
        text,
      },
      ...list,
    ]);
    setDraft("");
  }

  function startRecording() {
    setRecording(true);
    setElapsed(0);
    recTimer.current = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  }

  function stopRecording() {
    if (recTimer.current) window.clearInterval(recTimer.current);
    setRecording(false);
    setEntries((list) => [
      {
        id: `j-${Date.now()}`,
        date: "Today",
        time: nowTime(),
        moodId,
        kind: "voice",
        duration: formatClock(Math.max(elapsed, 1)),
      },
      ...list,
    ]);
    setElapsed(0);
  }

  function togglePlay(id: string) {
    if (playingId === id) {
      setPlayingId(null);
      if (playTimer.current) window.clearTimeout(playTimer.current);
      return;
    }
    setPlayingId(id);
    if (playTimer.current) window.clearTimeout(playTimer.current);
    playTimer.current = window.setTimeout(() => setPlayingId(null), 3500);
  }

  return (
    <div className="journal">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Journal</h1>
          <p>A gentle place for your feelings</p>
        </div>
      </header>

      <section className="composer" aria-label="New journal entry">
        <h2 className="composer__q">How are you feeling?</h2>
        <div className="moods" role="radiogroup" aria-label="Mood">
          {moods.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={moodId === m.id}
              className={`mood ${moodId === m.id ? "is-on" : ""}`}
              style={{ background: moodId === m.id ? m.tint : undefined }}
              onClick={() => setMoodId(m.id)}
            >
              <span className="mood__dot" style={{ background: m.tint }} />
              <span className="mood__label">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="composer__tabs">
          <button
            type="button"
            className={`composer__tab ${composer === "write" ? "is-active" : ""}`}
            onClick={() => setComposer("write")}
          >
            <Icon name="feather" className="composer__tab-icon" />
            Write
          </button>
          <button
            type="button"
            className={`composer__tab ${composer === "voice" ? "is-active" : ""}`}
            onClick={() => setComposer("voice")}
          >
            <Icon name="mic" className="composer__tab-icon" />
            Voice note
          </button>
        </div>

        {composer === "write" ? (
          <div className="write">
            <textarea
              className="write__area"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write whatever is on your mind…"
              rows={4}
            />
            <button
              type="button"
              className="write__save"
              onClick={saveText}
              disabled={!draft.trim()}
            >
              Save entry
            </button>
          </div>
        ) : (
          <div className="record">
            {recording ? (
              <>
                <div className="record__live">
                  <span className="record__dot" aria-hidden="true" />
                  Recording · {formatClock(elapsed)}
                  <span className="wave wave--clay" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <button type="button" className="record__stop" onClick={stopRecording}>
                  <Icon name="check" className="record__stop-icon" />
                  Stop & save
                </button>
              </>
            ) : (
              <button type="button" className="record__start" onClick={startRecording}>
                <span className="record__mic">
                  <Icon name="mic" className="icon" />
                </span>
                Tap to record a voice note
              </button>
            )}
            <p className="record__hint">
              Speak freely. Your note is saved so you can listen back later.
            </p>
          </div>
        )}
      </section>

      <section className="entries" aria-label="Past entries">
        <h2 className="entries__heading">Looking back</h2>
        {entries.map((entry) => {
          const mood = moodById(entry.moodId);
          const playing = playingId === entry.id;
          return (
            <article key={entry.id} className="entry">
              <span
                className="entry__mood"
                style={{ background: mood.tint }}
                title={mood.label}
                aria-hidden="true"
              />
              <div className="entry__body">
                <div className="entry__meta">
                  <span className="entry__when">
                    {entry.date} · {entry.time}
                  </span>
                  <span className="entry__moodlabel">{mood.label}</span>
                </div>
                {entry.kind === "text" ? (
                  <p className="entry__text">{entry.text}</p>
                ) : (
                  <button
                    type="button"
                    className={`listen ${playing ? "is-playing" : ""}`}
                    onClick={() => togglePlay(entry.id)}
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
                      <span>Listen · {entry.duration}</span>
                    )}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
