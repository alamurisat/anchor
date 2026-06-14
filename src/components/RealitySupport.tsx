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
  voiceName = "Samantha",
}: RealitySupportProps) {
  // Which question's answer is open (a step id), or null for the overview.
  const [active, setActive] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [voiceFailed, setVoiceFailed] = useState(false);

  const groundingMessage = buildGroundingMessage();
  const answer = active ? realitySteps.find((s) => s.id === active) : null;

  async function play(key: string, text: string) {
    setPlayingKey(key);
    const result = await playVoiceMessage(text, voiceId, () =>
      setPlayingKey((k) => (k === key ? null : k))
    );
    if (result.ok) {
      setVoiceFailed(false);
    } else if (result.reason !== "superseded") {
      setPlayingKey(null);
      setVoiceFailed(true);
    }
  }

  function stop() {
    stopVoice();
    setPlayingKey(null);
  }

  // Speak the grounding message automatically when Anchor Mode opens.
  useEffect(() => {
    play("grounding", groundingMessage);
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ask(stepId: string) {
    const step = realitySteps.find((s) => s.id === stepId);
    if (!step) return;
    setActive(stepId);
    play(stepId, step.voice);
  }

  const groundingPlaying = playingKey === "grounding";

  return (
    <div className="rs">
      <div className="rs__glow" aria-hidden="true" />

      <button type="button" className="rs__back" onClick={onReturn} aria-label="Go back">
        <Icon name="back" className="icon" />
      </button>

      <div className="rs__inner">
        <p className="rs__intro">Here’s what’s happening, right now.</p>

        <div className="breath" aria-hidden="true">
          <span className="breath__ring breath__ring--1" />
          <span className="breath__ring breath__ring--2" />
          <span className="breath__core" />
        </div>

        {/* The calming spoken reassurance (plays automatically) */}
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
            {voiceFailed ? "Reading the words here for you." : `In ${voiceName}’s voice`}
          </p>
        </section>

        {/* One way to explore: ask a question */}
        <div className="rs__questions" role="list">
          <span className="rs__questions-label">Ask me anything:</span>
          {realityQuestions.map((q) => (
            <button
              key={q.stepId}
              type="button"
              role="listitem"
              className={`rs__q ${active === q.stepId ? "is-on" : ""}`}
              onClick={() => ask(q.stepId)}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* The answer to the chosen question */}
        {answer && (
          <div className="rs__answer" key={answer.id}>
            <div className="rs__photo" style={{ background: answer.tint }} aria-hidden="true">
              <Icon name={answer.icon} className="rs__icon" />
            </div>
            <span className="rs__eyebrow">{answer.eyebrow}</span>
            <h1 className="rs__headline">{answer.headline}</h1>
            <p className="rs__detail">{answer.detail}</p>
            <button
              type="button"
              className={`rs__speak ${playingKey === answer.id ? "is-on" : ""}`}
              onClick={() => play(answer.id, answer.voice)}
            >
              <Icon
                name={playingKey === answer.id ? "close" : "volume"}
                className="rs__speak-icon"
              />
              {playingKey === answer.id ? (
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
        )}

        <button type="button" className="rs__done" onClick={onReturn}>
          I feel better
        </button>
      </div>
    </div>
  );
}
