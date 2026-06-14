import { useState } from "react";
import { personName, safeContacts, safeRoutes } from "../data";
import { Icon } from "./Icons";

type SafePathProps = {
  onBack: () => void;
  embedded?: boolean;
};

export default function SafePath({ onBack, embedded }: SafePathProps) {
  const [inside, setInside] = useState(true);

  return (
    <div className="safepath">
      {!embedded && (
        <header className="bridge__top">
          <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
            <Icon name="back" className="icon" />
          </button>
          <div className="bridge__titles">
            <h1>SafePath</h1>
            <p>Peace of mind, gently</p>
          </div>
        </header>
      )}

      <section className={`zone ${inside ? "zone--safe" : "zone--alert"}`}>
        <div className="zone__map" aria-hidden="true">
          <span className="zone__fence" />
          <span className={`zone__dot ${inside ? "" : "zone__dot--out"}`} />
          <span className="zone__home">
            <Icon name="home" className="icon" />
          </span>
        </div>
        <div className="zone__status">
          <span className="zone__icon">
            <Icon name={inside ? "shield" : "alert"} className="icon" />
          </span>
          <div className="zone__text">
            <span className="zone__title">
              {inside
                ? `${personName} is in the safe zone`
                : `${personName} has left the safe zone`}
            </span>
            <span className="zone__sub">
              {inside
                ? "Within the usual area around home"
                : "Sarah and Tom have been alerted"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="zone__toggle"
          onClick={() => setInside((v) => !v)}
        >
          {inside ? "Simulate leaving the zone" : "Return to safe zone"}
        </button>
      </section>

      <section className="routes" aria-label="Safe routes">
        <h2 className="calls__heading">Familiar safe routes</h2>
        {safeRoutes.map((r) => (
          <article key={r.id} className="route">
            <span className="route__icon" aria-hidden="true">
              <Icon name="map" className="icon" />
            </span>
            <div className="route__text">
              <span className="route__label">{r.label}</span>
              <span className="route__detail">{r.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="contacts" aria-label="Emergency contacts">
        <h2 className="calls__heading">Emergency contacts</h2>
        {safeContacts.map((c) => (
          <article key={c.name} className="contact">
            <span className="avatar" style={{ background: c.tint }} aria-hidden="true">
              {c.initial}
            </span>
            <div className="contact__text">
              <span className="contact__name">{c.name}</span>
              <span className="contact__rel">{c.relation}</span>
            </div>
            <a className="contact__call" href={`tel:${c.phone.replace(/\s/g, "")}`}>
              <Icon name="phone" className="contact__call-icon" />
              Call
            </a>
          </article>
        ))}
      </section>

    </div>
  );
}
