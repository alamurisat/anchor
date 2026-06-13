import { useEffect, useRef, useState } from "react";
import { realityQuestions, realitySteps } from "../data";
import { Icon } from "./Icons";

type RealitySupportProps = {
  onReturn: () => void;
};

export default function RealitySupport({ onReturn }: RealitySupportProps) {
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const speakTimer = useRef<number | null>(null);

  const step = realitySteps[index];
  const isLast = index === realitySteps.length - 1;

  // The calming voice explanation plays automatically as each fact appears.
  useEffect(() => {
    setSpeaking(true);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
    speakTimer.current = window.setTimeout(() => setSpeaking(false), 3600);
    return () => {
      if (speakTimer.current) window.clearTimeout(speakTimer.current);
    };
  }, [index]);

  function goTo(id: string) {
    const i = realitySteps.findIndex((s) => s.id === id);
    if (i >= 0) setIndex(i);
  }

  function replay() {
    if (index === 0) {
      // Re-trigger the voice even if already on the first step.
      setSpeaking(true);
      if (speakTimer.current) window.clearTimeout(speakTimer.current);
      speakTimer.current = window.setTimeout(() => setSpeaking(false), 3600);
    } else {
      setIndex(0);
    }
  }

  return (
    <div className="rs">
      <div className="rs__glow" aria-hidden="true" />

      <div className="rs__inner">
        <p className="rs__intro">Here’s what’s happening, right now.</p>

        <div className={`rs__visual ${step.breath ? "rs__visual--breath" : ""}`}>
          {step.breath ? (
            <div className="breath" aria-hidden="true">
              <span className="breath__ring breath__ring--1" />
              <span className="breath__ring breath__ring--2" />
              <span className="breath__core" />
            </div>
          ) : (
            <div className="rs__photo" style={{ background: step.tint }} aria-hidden="true">
              <Icon name={step.icon} className="rs__icon" />
            </div>
          )}
        </div>

        <div className="rs__card" key={step.id}>
          <span className="rs__eyebrow">{step.eyebrow}</span>
          <h1 className="rs__headline">{step.headline}</h1>
          <p className="rs__detail">{step.detail}</p>

          <button
            type="button"
            className={`rs__speak ${speaking ? "is-on" : ""}`}
            onClick={replay}
          >
            <Icon name="volume" className="rs__speak-icon" />
            {speaking ? (
              <>
                <span>Speaking…</span>
                <span className="wave" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
              </>
            ) : (
              <span>Hear this again</span>
            )}
          </button>
        </div>

        <div className="rs__dots" aria-hidden="true">
          {realitySteps.map((s, i) => (
            <span key={s.id} className={`rs__dot ${i === index ? "is-on" : ""}`} />
          ))}
        </div>

        {!isLast ? (
          <button
            type="button"
            className="rs__continue"
            onClick={() => setIndex((i) => Math.min(i + 1, realitySteps.length - 1))}
          >
            Continue
          </button>
        ) : (
          <div className="rs__actions">
            <button type="button" className="rs__again" onClick={replay}>
              Tell me again
            </button>
            <button type="button" className="rs__done" onClick={onReturn}>
              I feel better
            </button>
          </div>
        )}

        <div className="rs__questions" role="list">
          <span className="rs__questions-label">Or ask me:</span>
          {realityQuestions.map((q) => (
            <button
              key={q.stepId}
              type="button"
              role="listitem"
              className={`rs__q ${realitySteps[index].id === q.stepId ? "is-on" : ""}`}
              onClick={() => goTo(q.stepId)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
