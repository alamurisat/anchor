import { useEffect, useRef, useState } from "react";
import {
  bridgeMemories,
  personName,
  suggestedPrompts,
  voiceSamples,
  type AddedMemory,
  type MediaType,
} from "../data";
import { Icon } from "./Icons";
import { startRecognition } from "../lib/listen";

type MemoryBridgeProps = {
  onBack: () => void;
  added?: AddedMemory[];
  onRemove?: (id: string) => void;
};

type Display = {
  id: string;
  title: string;
  type: MediaType;
  description: string;
  prompt: string;
  keywords: string[];
  meta?: string;
  src?: string;
  removable?: boolean;
};

const typeIcon: Record<MediaType, "photo" | "video" | "voice"> = {
  photo: "photo",
  video: "video",
  voice: "voice",
};

const typeLabel: Record<MediaType, string> = {
  photo: "Photo",
  video: "Video",
  voice: "Voice",
};

function score(query: string, pool: Display[]): Display[] {
  const q = query.toLowerCase().trim();
  if (!q) return pool;
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  return pool
    .map((m) => {
      const hay = `${m.title} ${m.description} ${m.keywords.join(" ")}`.toLowerCase();
      // A memory matches if any meaningful word from the question appears in it.
      const score = words.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
      return { m, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.m);
}

function narrate(query: string, results: Display[]): string {
  if (!query.trim()) {
    return `Everything ${personName}’s family has shared, gathered in one calm place.`;
  }
  if (results.length === 0) {
    return `I couldn’t find that yet. Try asking about her wedding, her daughter Sarah, Tom, or the garden.`;
  }
  const q = query.toLowerCase();
  let subject = "";
  if (q.includes("wedding") || q.includes("married")) subject = " from her wedding day";
  else if (q.includes("daughter") || q.includes("sarah")) subject = " of her daughter, Sarah";
  else if (q.includes("tom") || q.includes("husband")) subject = " of Tom";
  else if (q.includes("garden") || q.includes("rose")) subject = " of the garden";
  else if (q.includes("dinner") || q.includes("family")) subject = " of family time";

  const count = results.length;
  const noun = count === 1 ? "memory" : "memories";
  return `I found ${count} ${noun}${subject}. ${results[0].prompt || ""}`.trim();
}

export default function MemoryBridge({ onBack, added = [], onRemove }: MemoryBridgeProps) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const stopRecRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      stopRecRef.current?.();
    };
  }, []);

  // Family uploads first, then the sample collection.
  const pool: Display[] = [
    ...added.map((a) => ({
      id: a.id,
      title: a.caption,
      type: a.type,
      description: "Shared by family",
      prompt: "",
      keywords: a.caption.toLowerCase().split(/\s+/),
      meta: `${typeLabel[a.type]} · just shared`,
      src: a.src,
      removable: true,
    })),
    ...bridgeMemories.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      description: m.description,
      prompt: m.prompt,
      keywords: m.keywords,
      meta: m.meta,
    })),
  ];

  const results = submitted ? score(query, pool) : pool;
  const narrative = narrate(submitted ? query : "", results);

  function runSearch(value: string) {
    setQuery(value);
    setSubmitted(true);
  }

  function clearSearch() {
    setQuery("");
    setSubmitted(false);
  }

  function resolveHeard(text: string) {
    setHeard(text);
    timer.current = window.setTimeout(() => {
      setListening(false);
      setHeard(null);
      runSearch(text);
    }, 900);
  }

  function simulate() {
    const phrase = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    timer.current = window.setTimeout(() => resolveHeard(phrase), 1400);
  }

  function startListening() {
    setListening(true);
    setHeard(null);
    if (timer.current) window.clearTimeout(timer.current);
    stopRecRef.current = startRecognition((text) => resolveHeard(text), () => simulate());
    if (!stopRecRef.current) simulate();
  }

  function cancelListening() {
    if (timer.current) window.clearTimeout(timer.current);
    stopRecRef.current?.();
    stopRecRef.current = null;
    setListening(false);
    setHeard(null);
  }

  return (
    <div className="bridge">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>MemoryBridge</h1>
          <p>{pool.length} memories shared by family</p>
        </div>
      </header>

      <form
        className="ask"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <span className="ask__icon" aria-hidden="true">
          <Icon name="search" className="icon" />
        </span>
        <input
          className="ask__input"
          type="text"
          value={query}
          placeholder="Ask for a memory…"
          aria-label="Ask for a memory"
          onChange={(e) => setQuery(e.target.value)}
        />
        {submitted && (
          <button type="button" className="ask__clear" onClick={clearSearch}>
            Clear
          </button>
        )}
        <button
          type="button"
          className="ask__mic"
          onClick={startListening}
          aria-label="Speak your question"
        >
          <Icon name="mic" className="icon" />
        </button>
      </form>

      <div className="chips" role="list">
        {suggestedPrompts.map((p) => (
          <button
            key={p.label}
            type="button"
            className="chip"
            role="listitem"
            onClick={() => runSearch(p.query)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="answer">
        <span className="answer__icon" aria-hidden="true">
          <Icon name="sparkle" className="icon" />
        </span>
        <p className="answer__text">{narrative}</p>
      </div>

      <div className="results">
        {results.map((m) => (
          <article key={m.id} className="media">
            {m.removable && onRemove && (
              <button
                type="button"
                className="media__remove"
                onClick={() => onRemove(m.id)}
                aria-label="Remove this memory"
              >
                <Icon name="close" className="icon" />
              </button>
            )}
            <div className="media__art">
              {m.src && m.type === "photo" ? (
                <img className="media__img" src={m.src} alt={m.title} />
              ) : m.src && m.type === "video" ? (
                <video className="media__img" src={m.src} controls />
              ) : (
                <Icon name={typeIcon[m.type]} className="media__icon" />
              )}
              <span className="media__type">
                <Icon name={typeIcon[m.type]} className="icon" />
                {typeLabel[m.type]}
              </span>
            </div>
            <div className="media__body">
              <h3>{m.title}</h3>
              {m.description && <p className="media__desc">{m.description}</p>}
              {m.src && m.type === "voice" && (
                <audio className="media__audio" src={m.src} controls />
              )}
              {m.meta && <span className="media__meta">{m.meta}</span>}
              {m.prompt && (
                <p className="media__prompt">
                  <Icon name="sparkle" className="media__prompt-icon" />
                  {m.prompt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {listening && (
        <div className="voice" role="dialog" aria-label="Listening">
          <button
            type="button"
            className="voice__scrim"
            onClick={cancelListening}
            aria-label="Stop listening"
          />
          <div className="voice__panel">
            <div className="voice__pulse" aria-hidden="true">
              <span className="voice__ring voice__ring--1" />
              <span className="voice__ring voice__ring--2" />
              <span className="voice__mic">
                <Icon name="mic" className="icon" />
              </span>
            </div>
            <p className="voice__status">{heard ? "You said" : "Listening…"}</p>
            {heard ? (
              <p className="voice__heard">“{heard}”</p>
            ) : (
              <p className="voice__hint">Try “show pictures of her wedding”</p>
            )}
            <button type="button" className="voice__cancel" onClick={cancelListening}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
