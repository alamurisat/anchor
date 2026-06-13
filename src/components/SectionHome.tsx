import {
  personName,
  todayLabel,
  remindTasks,
  remindersData,
  MISS_THRESHOLD,
  eventKindMeta,
} from "../data";
import { Icon } from "./Icons";
import type { IconName } from "../data";
import type { Section } from "./RoleLanding";
import logo from "../assets/anchor.png";

type SectionHomeProps = {
  section: Section;
  onNavigate: (view: string) => void;
  onSwitch: () => void;
};

type TileDef = { view: string; icon: IconName; title: string; sub: string };

const FEATURES: Record<string, { icon: IconName; title: string; sub: string }> = {
  dailyanchor: { icon: "sunrise", title: "Daily Anchor", sub: "Today, one step at a time" },
  companion: { icon: "person", title: "Companion", sub: "Who is this?" },
  bridge: { icon: "sparkle", title: "Memory Lane", sub: "Ask to see a memory" },
  journal: { icon: "book", title: "Journal", sub: "How are you feeling?" },
  messages: { icon: "chat", title: "Messages", sub: "Notes & calls" },
  calendar: { icon: "calendar", title: "Calendar", sub: "The full day" },
  remindme: { icon: "bell", title: "RemindMe", sub: "Spoken reminders" },
  carecircle: { icon: "users", title: "CareCircle", sub: "Shared care log" },
  safepath: { icon: "shield", title: "SafePath", sub: "Wandering safety" },
  memorybook: { icon: "bookheart", title: "Memory Book", sub: "Share a memory" },
  storykeeper: { icon: "mic", title: "StoryKeeper", sub: "Record a story" },
  memorymap: { icon: "map", title: "Memory Map", sub: "Places & stories" },
};

const SECTIONS: Record<
  Section,
  { label: string; views: string[] }
> = {
  patient: {
    label: "For You",
    views: ["dailyanchor", "companion", "bridge", "journal", "messages"],
  },
  caregiver: {
    label: "Caregiver",
    views: ["calendar", "remindme", "carecircle", "safepath", "messages"],
  },
  family: {
    label: "Friends & Family",
    views: ["memorybook", "storykeeper", "memorymap", "messages"],
  },
};

function tilesFor(section: Section): TileDef[] {
  return SECTIONS[section].views.map((view) => ({ view, ...FEATURES[view] }));
}

function caregiverAlerts() {
  const confusion = [
    {
      id: "confusion-1",
      icon: "sparkle" as IconName,
      text: "10:42 AM · Confusion moment. Anchor reoriented Margaret (detected via wearable)",
      to: "reality",
    },
  ];
  const fromTasks = remindTasks
    .filter((t) => t.missed >= MISS_THRESHOLD && !t.done)
    .map((t) => ({
      id: t.id,
      icon: eventKindMeta[t.kind].icon as IconName,
      text: `${t.title} missed ${t.missed} times. Family notified`,
      to: "remindme",
    }));
  const fromReminders = remindersData
    .filter((r) => r.kind === "missed")
    .map((r) => ({ id: r.id, icon: "phone" as IconName, text: r.text, to: "messages" }));
  return [...confusion, ...fromTasks, ...fromReminders];
}

export default function SectionHome({ section, onNavigate, onSwitch }: SectionHomeProps) {
  const tiles = tilesFor(section);
  const alerts = section === "caregiver" ? caregiverAlerts() : [];

  return (
    <div className={`home home--${section}`}>
      <header className="home__top">
        <div className="wordmark">
          <img className="wordmark__logo" src={logo} alt="Anchor" />
          Anchor
        </div>
        <button type="button" className="switcher" onClick={onSwitch}>
          <span className="switcher__role">{SECTIONS[section].label}</span>
          <span className="switcher__action">Switch view</span>
        </button>
      </header>

      {section === "patient" && (
        <>
          <section className="phero" aria-label="Welcome">
            <p className="phero__hello">Hello, {personName}</p>
            <p className="phero__line">You are safe, and you are loved.</p>
          </section>

          <button
            type="button"
            className="reality-cta"
            onClick={() => onNavigate("reality")}
          >
            <span className="reality-cta__icon">
              <Icon name="heart" className="icon" />
            </span>
            <span className="reality-cta__text">
              <span className="reality-cta__title">I feel confused</span>
              <span className="reality-cta__sub">
                Tap here and Anchor will help you feel safe
              </span>
            </span>
          </button>
        </>
      )}

      {section === "caregiver" && (
        <>
          <section className="cg-status" aria-label="Current status">
            <div className="cg-status__main">
              <p className="cg-status__name">{personName}</p>
              <p className="cg-status__meta">{todayLabel}</p>
            </div>
            <span className="status-chip">
              <span className="status-chip__dot" />
              Calm
            </span>
          </section>

          {alerts.length > 0 && (
            <section className="alerts" aria-label="Alerts">
              <h2 className="alerts__heading">
                <Icon name="alert" className="alerts__heading-icon" />
                Needs attention
              </h2>
              {alerts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="alert"
                  onClick={() => onNavigate(a.to)}
                >
                  <span className="alert__icon">
                    <Icon name={a.icon} className="icon" />
                  </span>
                  <span className="alert__text">{a.text}</span>
                  <span className="alert__chev" aria-hidden="true">
                    <Icon name="back" className="icon" />
                  </span>
                </button>
              ))}
            </section>
          )}
        </>
      )}

      {section === "family" && (
        <section className="fhero" aria-label="Welcome">
          <span className="fhero__badge">
            <Icon name="bookheart" className="icon" />
          </span>
          <div className="fhero__text">
            <h1 className="fhero__title">Stay close to {personName}</h1>
            <p className="fhero__sub">Share photos, stories, and messages.</p>
          </div>
        </section>
      )}

      <nav className={`tiles ${section === "patient" ? "tiles--large" : ""}`} aria-label="Features">
        {tiles.map((tile) => (
          <button
            key={tile.view}
            type="button"
            className="tile"
            onClick={() => onNavigate(tile.view)}
            aria-label={tile.title}
          >
            <span className="tile__icon">
              <Icon name={tile.icon} className="icon" />
            </span>
            <span className="tile__title">{tile.title}</span>
            <span className="tile__sub">{tile.sub}</span>
          </button>
        ))}
      </nav>

      {section === "patient" && (
        <p className="home__footnote">Voice playback is read in a familiar voice.</p>
      )}
    </div>
  );
}
