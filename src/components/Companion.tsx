import { useEffect, useRef, useState } from "react";
import {
  companionPeople,
  companionQuestions,
  companionVoiceSamples,
  type CompanionFacet,
  type CompanionPerson,
} from "../data";
import { Icon } from "./Icons";

type CompanionProps = {
  onBack: () => void;
};

function answerFor(person: CompanionPerson, facet: CompanionFacet): string {
  switch (facet) {
    case "identity":
      return `This is ${person.name}, ${person.relation.toLowerCase()}. ${person.description}`;
    case "met":
      return person.met;
    case "about":
      return person.description;
  }
}

export default function Companion({ onBack }: CompanionProps) {
  const [person, setPerson] = useState<CompanionPerson>(companionPeople[0]);
  const [facet, setFacet] = useState<CompanionFacet>("identity");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const listenTimer = useRef<number | null>(null);
  const speakTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (listenTimer.current) window.clearTimeout(listenTimer.current);
      if (speakTimer.current) window.clearTimeout(speakTimer.current);
    };
  }, []);

  const answer = answerFor(person, facet);

  function speak() {
    setSpeaking(true);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
    speakTimer.current = window.setTimeout(() => setSpeaking(false), 4000);
  }

  function stopSpeak() {
    setSpeaking(false);
    if (speakTimer.current) window.clearTimeout(speakTimer.current);
  }

  function ask(next: CompanionFacet) {
    setFacet(next);
    speak();
  }

  function choosePerson(p: CompanionPerson) {
    setPerson(p);
    setFacet("identity");
    speak();
  }

  function startListening() {
    setListening(true);
    if (listenTimer.current) window.clearTimeout(listenTimer.current);
    const sample =
      companionVoiceSamples[
        Math.floor(Math.random() * companionVoiceSamples.length)
      ];
    listenTimer.current = window.setTimeout(() => {
      setListening(false);
      ask(sample.facet);
    }, 2200);
  }

  function cancelListening() {
    if (listenTimer.current) window.clearTimeout(listenTimer.current);
    setListening(false);
  }

  return (
    <div className="companion">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Companion</h1>
          <p>Ask me about the people you love</p>
        </div>
      </header>

      <section className="whoswith" aria-label="Who is with you">
        <span className="whoswith__label">Who’s with you?</span>
        <div className="whoswith__row">
          {companionPeople.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`whoswith__btn ${person.id === p.id ? "is-on" : ""}`}
              onClick={() => choosePerson(p)}
              aria-pressed={person.id === p.id}
            >
              <span className="avatar" style={{ background: p.tint }} aria-hidden="true">
                {p.name.charAt(0)}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </section>

      <section className="spotlight" aria-label={`About ${person.name}`}>
        <div className="spotlight__photo" style={{ background: person.tint }} aria-hidden="true">
          <span className="spotlight__initial">{person.name.charAt(0)}</span>
        </div>
        <h2 className="spotlight__name">{person.name}</h2>
        <p className="spotlight__relation">{person.relation}</p>

        <p className="spotlight__answer">{answer}</p>

        <button
          type="button"
          className={`spotlight__speak ${speaking ? "is-on" : ""}`}
          onClick={() => (speaking ? stopSpeak() : speak())}
        >
          <Icon name={speaking ? "close" : "volume"} className="spotlight__speak-icon" />
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
            <span>Hear this</span>
          )}
        </button>
      </section>

      <button type="button" className="ask-voice" onClick={startListening}>
        <span className="ask-voice__mic">
          <Icon name="mic" className="icon" />
        </span>
        <span className="ask-voice__text">
          <span className="ask-voice__title">Tap and ask a question</span>
          <span className="ask-voice__hint">“Who is this person?”</span>
        </span>
      </button>

      <div className="chips" role="list">
        {companionQuestions.map((q) => (
          <button
            key={q.facet}
            type="button"
            role="listitem"
            className={`chip ${facet === q.facet ? "is-on" : ""}`}
            onClick={() => ask(q.facet)}
          >
            {q.label}
          </button>
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
            <p className="voice__status">Listening…</p>
            <p className="voice__hint">Try “Where did I meet them?”</p>
            <button type="button" className="voice__cancel" onClick={cancelListening}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
