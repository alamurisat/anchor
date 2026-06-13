import { useEffect, useRef, useState } from "react";
import { stories, storyTopics, type Story } from "../data";
import { Icon } from "./Icons";

type StoryKeeperProps = {
  onBack: () => void;
};

export default function StoryKeeper({ onBack }: StoryKeeperProps) {
  const [archive, setArchive] = useState<Story[]>(stories);
  const [query, setQuery] = useState("");
  const [recording, setRecording] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const recTimer = useRef<number | null>(null);
  const playTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recTimer.current) window.clearTimeout(recTimer.current);
      if (playTimer.current) window.clearTimeout(playTimer.current);
    };
  }, []);

  function recordAnswer(topicId: string, question: string) {
    setRecording(question);
    if (recTimer.current) window.clearTimeout(recTimer.current);
    recTimer.current = window.setTimeout(() => {
      setRecording(null);
      setArchive((list) => [
        {
          id: `st-${Date.now()}`,
          topicId,
          question,
          kind: "voice",
          duration: "0:36",
          date: "Today",
        },
        ...list,
      ]);
    }, 2600);
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
