import { useEffect, useState } from "react";
import { realityQuestions, realitySteps } from "../data";
import { buildGroundingMessage, playVoiceMessage, stopVoice } from "../lib/voice";
import { Icon } from "./Icons";

type RealitySupportProps = {
  onReturn: () => void;
  voiceId: string;
  voiceName?: string;
};

export default function RealitySupport({
  onReturn,
  voiceId,
  voiceName = "Anchor Companion",
}: RealitySupportProps) {
  const [index, setIndex] = useState(0);
  // Which line is currently being spoken: "grounding" or a step id, else null.
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [voiceFailed, setVoiceFailed] = useState(false);

  const step = realitySteps[index];
  const isLast = index === realitySteps.length - 1;
  const groundingMessage = buildGroundingMessage();

  async function play(key: string, text: string) {
    setPlayingKey(key);
    const result = await playVoiceMessage(text, voiceId, () =>
      setPlayingKey((k) => (k === key ? null : k))
    );
    if (result.ok) {
      setVoiceFailed(false);
    } else if (result.reason !== "superseded") {
      // A real failure (not just a newer request taking over).
      setPlayingKey(null);
      setVoiceFailed(true);
    }
  }

  function stop() {
    stopVoice();
    setPlayingKey(null);
  }

  // Auto-play the grounding message when Anchor Mode opens.
  useEffect(() => {
    play("grounding", groundingMessage);
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(id: string) {
    const i = realitySteps.findIndex((s) => s.id === id);
    if (i >= 0) setIndex(i);
  }

  const groundingPlaying = playingKey === "grounding";

  return (
    <div className="rs">
      <div className="rs__glow" aria-hidden="true" />

      <div className="rs__inner">
        <p className="rs__intro">Here’s what’s happening, right now.</p>

        {/* Spoken grounding message (ElevenLabs voice) with transcript */}
        <section className="ground-voice" aria-label="Grounding message">
          <p className="ground-voice__transcript">{groundingMessage}</p>
          <div className="ground-voice__controls">
            <button
              type="button"
              className={`ground-voice__btn ${groundingPlaying ? "is-on" : ""}`}
              onClick={() => play("grounding", groundingMessage)}
            >
              <Icon name="volume" className="ground-voice__icon" />
              {groundingPlaying ? "Playing…" : "Play again"}
            </button>
            <button
              type="button"
              className="ground-voice__btn ground-voice__btn--stop"
              onClick={stop}
            >
              <Icon name="close" className="ground-voice__icon" />
              Stop audio
            </button>
          </div>
          <p className="ground-voice__by">
            {voiceFailed
              ? "Reading the words here for you."
              : `In ${voiceName}’s voice`}
          </p>
        </section>

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
            className={`rs__speak ${playingKey === step.id ? "is-on" : ""}`}
            onClick={() => play(step.id, step.voice)}
          >
            <Icon name={playingKey === step.id ? "close" : "volume"} className="rs__speak-icon" />
            {playingKey === step.id ? (
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
            <button
              type="button"
              className="rs__again"
              onClick={() => play("grounding", groundingMessage)}
            >
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
