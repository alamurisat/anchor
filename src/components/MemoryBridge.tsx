import { useEffect, useRef, useState } from "react";
import {
  bridgeMemories,
  personName,
  suggestedPrompts,
  voiceSamples,
  type BridgeMemory,
  type MediaType,
} from "../data";
import { Icon } from "./Icons";

type MemoryBridgeProps = {
  onBack: () => void;
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

// Simulated retrieval: score each memory by how many of its keywords
// appear in the caregiver's question.
function search(query: string): BridgeMemory[] {
  const q = query.toLowerCase();
  if (!q.trim()) return bridgeMemories;
  const scored = bridgeMemories
    .map((m) => ({
      m,
      score: m.keywords.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((s) => s.m);
}

// Simulated "AI" narrative that introduces the matched memories.
function narrate(query: string, results: BridgeMemory[]): string {
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
  return `I found ${count} ${noun}${subject}. ${results[0].prompt}`;
}

export default function MemoryBridge({ onBack }: MemoryBridgeProps) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<BridgeMemory[]>(bridgeMemories);
  const [listening, setListening] = useState(false);
  const [sharedCount, setSharedCount] = useState(bridgeMemories.length);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function runSearch(value: string) {
    setQuery(value);
    setResults(search(value));
    setSubmitted(true);
  }

  function clearSearch() {
    setQuery("");
    setResults(bridgeMemories);
    setSubmitted(false);
  }

  function startListening() {
    setListening(true);
    const phrase = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    timer.current = window.setTimeout(() => {
      setListening(false);
      runSearch(phrase);
    }, 2200);
  }

  function cancelListening() {
    if (timer.current) window.clearTimeout(timer.current);
    setListening(false);
  }

  function addMemory() {
    setSharedCount((c) => c + 1);
    setJustAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 2600);
  }

  const narrative = narrate(query, results);

  return (
    <div className="bridge">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Memory Lane</h1>
          <p>{sharedCount} memories shared by family</p>
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
            <div className="media__art" aria-hidden="true">
              <Icon name={typeIcon[m.type]} className="media__icon" />
              <span className="media__type">
                <Icon name={typeIcon[m.type]} className="icon" />
                {typeLabel[m.type]}
              </span>
            </div>
            <div className="media__body">
              <h3>{m.title}</h3>
              <p className="media__desc">{m.description}</p>
              {m.meta && <span className="media__meta">{m.meta}</span>}
              <p className="media__prompt">
                <Icon name="sparkle" className="media__prompt-icon" />
                {m.prompt}
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="add" aria-label="Add a memory">
        <div className="add__head">
          <h2>Add a memory</h2>
          <p>Photos, videos, and voice notes help {personName} feel grounded.</p>
        </div>
        <div className="add__row">
          <button type="button" className="add__btn" onClick={addMemory}>
            <Icon name="photo" className="add__icon" />
            Photo
          </button>
          <button type="button" className="add__btn" onClick={addMemory}>
            <Icon name="video" className="add__icon" />
            Video
          </button>
          <button type="button" className="add__btn" onClick={addMemory}>
            <Icon name="voice" className="add__icon" />
            Voice
          </button>
        </div>
        <p className={`add__note ${justAdded ? "add__note--show" : ""}`} role="status">
          Thank you. Your memory was added to {personName}’s collection.
        </p>
      </section>

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
            <p className="voice__status">Listening…</p>
            <p className="voice__hint">Try “show pictures of her wedding”</p>
            <button type="button" className="voice__cancel" onClick={cancelListening}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
