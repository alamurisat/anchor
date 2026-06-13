import { useState } from "react";
import {
  careCircle,
  careLog,
  medAdherence,
  nextAppointment,
  personName,
  type CareCategory,
  type CareNote,
} from "../data";
import { Icon } from "./Icons";

type CareCircleProps = {
  onBack: () => void;
  embedded?: boolean;
};

const categories: { id: CareCategory; label: string }[] = [
  { id: "mood", label: "Mood" },
  { id: "behavior", label: "Behaviour" },
  { id: "activity", label: "Activity" },
];

export default function CareCircle({ onBack, embedded }: CareCircleProps) {
  const [log, setLog] = useState<CareNote[]>(careLog);
  const [category, setCategory] = useState<CareCategory>("mood");
  const [draft, setDraft] = useState("");

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    setLog((list) => [
      {
        id: `n-${Date.now()}`,
        author: "Sarah",
        initial: "S",
        tint: "linear-gradient(140deg, #ff9a5c, #d9692e)",
        time: "Just now",
        category,
        text,
      },
      ...list,
    ]);
    setDraft("");
  }

  return (
    <div className="carecircle">
      {!embedded && (
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>CareCircle</h1>
          <p>Caring for {personName}, together</p>
        </div>
      </header>
      )}

      <section className="circle" aria-label="Care team">
        {careCircle.map((m) => (
          <div key={m.name} className="circle__member">
            <span className="avatar" style={{ background: m.tint }} aria-hidden="true">
              {m.initial}
            </span>
            <span className="circle__name">{m.name}</span>
            <span className="circle__role">{m.role}</span>
            {m.onDuty && <span className="circle__duty">On duty</span>}
          </div>
        ))}
      </section>

      <div className="stats">
        <div className="stat">
          <span className="stat__icon stat__icon--med">
            <Icon name="pill" className="icon" />
          </span>
          <div className="stat__text">
            <span className="stat__value">
              {medAdherence.taken} / {medAdherence.total}
            </span>
            <span className="stat__label">Medication today</span>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon stat__icon--appt">
            <Icon name="heart" className="icon" />
          </span>
          <div className="stat__text">
            <span className="stat__value">Next appointment</span>
            <span className="stat__label">{nextAppointment}</span>
          </div>
        </div>
      </div>

      <section className="log" aria-label="Care log">
        <h2 className="calls__heading">Daily care log</h2>

        <div className="notebox">
          <div className="notebox__cats">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`notecat ${category === c.id ? "is-on" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            className="notebox__area"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Add a note about ${personName}’s day…`}
            rows={2}
          />
          <button
            type="button"
            className="notebox__add"
            onClick={addNote}
            disabled={!draft.trim()}
          >
            Add note
          </button>
        </div>

        {log.map((note) => (
          <article key={note.id} className="note">
            <span className="avatar avatar--sm" style={{ background: note.tint }} aria-hidden="true">
              {note.initial}
            </span>
            <div className="note__body">
              <div className="note__meta">
                <span className="note__author">{note.author}</span>
                <span className="note__cat">{note.category}</span>
                <span className="note__time">{note.time}</span>
              </div>
              <p className="note__text">{note.text}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
