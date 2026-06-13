import { useEffect, useRef, useState } from "react";
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
type Tone = "warn" | "urgent";
type LiveAlert = { id: string; icon: IconName; tone: Tone; text: string; time: string };

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

function nowTime(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export default function CaregiverView({ onSwitch }: CaregiverViewProps) {
  const [mood, setMood] = useState<Mood>("calm");
  const [tab, setTab] = useState<TabId>("calendar");
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [connected, setConnected] = useState(false);

  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const readingRef = useRef(false);
  const idRef = useRef(0);

  const serialSupported =
    typeof navigator !== "undefined" && "serial" in navigator;

  const noop = () => {};

  function cycleMood() {
    setMood((m) => moodOrder[(moodOrder.indexOf(m) + 1) % moodOrder.length]);
  }

  function pushAlert(icon: IconName, tone: Tone, text: string) {
    idRef.current += 1;
    const entry: LiveAlert = {
      id: `live-${idRef.current}`,
      icon,
      tone,
      text,
      time: nowTime(),
    };
    setLiveAlerts((prev) => [entry, ...prev].slice(0, 6));
  }

  // Map a serial line from the Anchor device to a caregiver alert.
  function handleSignal(raw: string) {
    const line = raw.trim();
    if (!line) return;
    if (line.includes("LOUD_SOUND")) {
      setMood("stressed");
      pushAlert("volume", "warn", `Loud sound detected near ${personName}`);
    } else if (line.includes("BUTTON_PRESSED")) {
      pushAlert("alert", "urgent", `${personName} pressed the help button`);
    }
  }

  async function connect() {
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      readingRef.current = true;
      setConnected(true);

      const reader = port.readable.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      while (readingRef.current) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) >= 0) {
          handleSignal(buffer.slice(0, idx));
          buffer = buffer.slice(idx + 1);
        }
      }
    } catch {
      // User cancelled the port picker or the device errored.
      setConnected(false);
    }
  }

  async function disconnect() {
    readingRef.current = false;
    try {
      await readerRef.current?.cancel();
    } catch {
      /* ignore */
    }
    try {
      readerRef.current?.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      await portRef.current?.close();
    } catch {
      /* ignore */
    }
    readerRef.current = null;
    portRef.current = null;
    setConnected(false);
  }

  useEffect(() => {
    return () => {
      readingRef.current = false;
      readerRef.current?.cancel?.().catch?.(() => {});
      portRef.current?.close?.().catch?.(() => {});
    };
  }, []);

  function dismissLive(id: string) {
    setLiveAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  const stress: Alert[] =
    mood === "stressed"
      ? [
          {
            id: "stress",
            icon: "alert",
            text: `${personName} is showing signs of stress. Anchor is reorienting her`,
          },
        ]
      : [];
  const staticAlerts = [...stress, ...baseAlerts()];
  const hasAlerts = liveAlerts.length + staticAlerts.length > 0;

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

      <section className="cg-monitor" aria-label="Anchor device">
        <div className="cg-monitor__row">
          <span className={`cg-monitor__dot ${connected ? "is-on" : ""}`} />
          <div className="cg-monitor__text">
            <p className="cg-monitor__title">Anchor device</p>
            <p className="cg-monitor__state">
              {connected
                ? "Connected · listening for sound & button"
                : serialSupported
                ? "Not connected"
                : "Live USB not supported here — use Chrome, or simulate below"}
            </p>
          </div>
          {serialSupported &&
            (connected ? (
              <button type="button" className="cg-monitor__btn" onClick={disconnect}>
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                className="cg-monitor__btn cg-monitor__btn--primary"
                onClick={connect}
              >
                Connect device
              </button>
            ))}
        </div>
        <div className="cg-monitor__sim">
          <span className="cg-monitor__simlabel">Simulate:</span>
          <button type="button" onClick={() => handleSignal("LOUD_SOUND")}>
            Loud sound
          </button>
          <button type="button" onClick={() => handleSignal("BUTTON_PRESSED")}>
            Button press
          </button>
        </div>
      </section>

      <section className="cg-alerts" aria-label="Alerts">
        <h2 className="cg-alerts__head">
          <Icon name="alert" className="cg-alerts__icon" />
          Needs attention
        </h2>

        {!hasAlerts && (
          <p className="cg-alerts__empty">No alerts. Everything looks settled.</p>
        )}

        {liveAlerts.map((a) => (
          <div key={a.id} className={`cg-alert cg-alert--${a.tone}`}>
            <span className="cg-alert__icon">
              <Icon name={a.icon} className="icon" />
            </span>
            <span className="cg-alert__body">
              <span className="cg-alert__text">{a.text}</span>
              <span className="cg-alert__time">Live · {a.time}</span>
            </span>
            <button
              type="button"
              className="cg-alert__dismiss"
              onClick={() => dismissLive(a.id)}
              aria-label="Dismiss alert"
            >
              <Icon name="close" className="icon" />
            </button>
          </div>
        ))}

        {staticAlerts.map((a) => (
          <div key={a.id} className="cg-alert">
            <span className="cg-alert__icon">
              <Icon name={a.icon} className="icon" />
            </span>
            <span className="cg-alert__text">{a.text}</span>
          </div>
        ))}
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
