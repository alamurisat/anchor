import { useState } from "react";
import {
  eventKindMeta,
  MISS_THRESHOLD,
  personName,
  remindersData,
  remindTasks,
} from "../data";
import { Icon } from "./Icons";
import type { IconName } from "../data";
import logo from "../assets/anchor.png";
import Calendar from "./Calendar";
import RemindMe from "./RemindMe";
import CareCircle from "./CareCircle";
import SafePath from "./SafePath";
import Messages from "./Messages";

type CaregiverViewProps = {
  onSwitch: () => void;
};

type Mood = "calm" | "stressed" | "calming";
type TabId = "calendar" | "remindme" | "carecircle" | "safepath" | "messages";

const moodOrder: Mood[] = ["calm", "stressed", "calming"];
const moodLabel: Record<Mood, string> = {
  calm: "CALM",
  stressed: "STRESSED",
  calming: "CALMING DOWN",
};

const tabs: { id: TabId; label: string; icon: IconName }[] = [
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "remindme", label: "Reminders", icon: "bell" },
  { id: "carecircle", label: "Care", icon: "users" },
  { id: "safepath", label: "Safety", icon: "shield" },
  { id: "messages", label: "Messages", icon: "chat" },
];

type Alert = { id: string; icon: IconName; text: string };

function baseAlerts(): Alert[] {
  const tasks = remindTasks
    .filter((t) => t.missed >= MISS_THRESHOLD && !t.done)
    .map((t) => ({
      id: t.id,
      icon: eventKindMeta[t.kind].icon,
      text: `${t.title} missed ${t.missed} times. Family notified`,
    }));
  const calls = remindersData
    .filter((r) => r.kind === "missed")
    .map((r) => ({ id: r.id, icon: "phone" as IconName, text: r.text }));
  return [...tasks, ...calls];
}

export default function CaregiverView({ onSwitch }: CaregiverViewProps) {
  const [mood, setMood] = useState<Mood>("calm");
  const [tab, setTab] = useState<TabId>("calendar");

  const noop = () => {};

  function cycleMood() {
    setMood((m) => moodOrder[(moodOrder.indexOf(m) + 1) % moodOrder.length]);
  }

  const alerts: Alert[] =
    mood === "stressed"
      ? [
          {
            id: "stress",
            icon: "alert" as IconName,
            text: `${personName} is showing signs of stress. Anchor is reorienting her`,
          },
          ...baseAlerts(),
        ]
      : baseAlerts();

  const content = {
    calendar: <Calendar onBack={noop} embedded />,
    remindme: <RemindMe onBack={noop} embedded />,
    carecircle: <CareCircle onBack={noop} embedded />,
    safepath: <SafePath onBack={noop} embedded />,
    messages: <Messages onBack={noop} embedded />,
  }[tab];

  return (
    <div className="cg">
      <header className="cg__header">
        <img className="cg__logo" src={logo} alt="Anchor" />
        <button type="button" className="switcher" onClick={onSwitch}>
          <span className="switcher__role">Caregiver</span>
          <span className="switcher__action">Switch view</span>
        </button>
      </header>

      <button
        type="button"
        className={`mood-card mood-card--${mood}`}
        onClick={cycleMood}
        aria-label={`User is feeling ${moodLabel[mood]}. Tap to simulate another state.`}
      >
        <span className="mood-card__label">User is feeling</span>
        <span className="mood-card__status">{moodLabel[mood]}</span>
        <span className="mood-orb" aria-hidden="true">
          <span className="mood-ripple mood-ripple--1" />
          <span className="mood-ripple mood-ripple--2" />
          <span className="mood-ripple mood-ripple--3" />
          <span className="mood-core" />
        </span>
        <span className="mood-card__hint">Tap to simulate state</span>
      </button>

      <section className="cg-alerts" aria-label="Alerts">
        <h2 className="cg-alerts__head">
          <Icon name="alert" className="cg-alerts__icon" />
          Needs attention
        </h2>
        {alerts.length === 0 ? (
          <p className="cg-alerts__empty">No alerts. Everything looks settled.</p>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="cg-alert">
              <span className="cg-alert__icon">
                <Icon name={a.icon} className="icon" />
              </span>
              <span className="cg-alert__text">{a.text}</span>
            </div>
          ))
        )}
      </section>

      <nav className="cg-tabs" role="tablist" aria-label="Caregiver sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`cg-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} className="cg-tab__icon" />
            <span className="cg-tab__label">{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="cg-content">{content}</div>
    </div>
  );
}
