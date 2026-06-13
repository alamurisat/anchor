import { useEffect, useRef, useState } from "react";
import { dailyAnchors } from "../data";
import { Icon } from "./Icons";

type DailyAnchorProps = {
  onBack: () => void;
};

export default function DailyAnchor({ onBack }: DailyAnchorProps) {
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const speakTimer = useRef<number | null>(null);

  const current = dailyAnchors[index];

  useEffect(() => {
    return () => {
      if (speakTimer.current) window.clearTimeout(speakTimer.current);
    };
  }, []);

  function speak() {
    setSpeaking(true);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
    speakTimer.current = window.setTimeout(() => setSpeaking(false), 3500);
  }

  function go(next: number) {
    setSpeaking(false);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
    setIndex((next + dailyAnchors.length) % dailyAnchors.length);
  }

  return (
    <div className="dailyanchor">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Daily Anchor</h1>
          <p>One calm step at a time</p>
        </div>
      </header>

      <section className={`da-card ${current.special ? "da-card--special" : ""}`}>
        <span className="da-card__icon">
          <Icon name={current.icon} className="icon" />
        </span>
        <span className="da-card__time">{current.time}</span>
        <p className="da-card__message">{current.message}</p>
        {current.special && <span className="da-card__badge">Something to look forward to</span>}

        <button
          type="button"
          className={`da-card__speak ${speaking ? "is-on" : ""}`}
          onClick={speak}
        >
          <Icon name="volume" className="da-card__speak-icon" />
          {speaking ? (
            <>
              <span>Reading aloud…</span>
              <span className="wave" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </>
          ) : (
            <span>Read this to me</span>
          )}
        </button>
      </section>

      <div className="da-nav">
        <button type="button" className="da-nav__btn" onClick={() => go(index - 1)}>
          <Icon name="back" className="da-nav__icon" />
          Before
        </button>
        <span className="da-nav__dots" aria-hidden="true">
          {dailyAnchors.map((a, i) => (
            <span key={a.id} className={`da-dot ${i === index ? "is-on" : ""}`} />
          ))}
        </span>
        <button type="button" className="da-nav__btn" onClick={() => go(index + 1)}>
          Next
          <Icon name="back" className="da-nav__icon da-nav__icon--next" />
        </button>
      </div>

      <section className="da-list" aria-label="Today at a glance">
        <h2 className="calls__heading">Today, gently</h2>
        {dailyAnchors.map((a, i) => (
          <button
            key={a.id}
            type="button"
            className={`da-row ${i === index ? "is-current" : ""}`}
            onClick={() => go(i)}
          >
            <span className="da-row__icon" aria-hidden="true">
              <Icon name={a.icon} className="icon" />
            </span>
            <span className="da-row__text">
              <span className="da-row__time">{a.time}</span>
              <span className="da-row__message">{a.message}</span>
            </span>
          </button>
        ))}
      </section>
    </div>
  );
}
