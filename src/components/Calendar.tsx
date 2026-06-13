import { useState } from "react";
import {
  calendarEvents,
  eventKindMeta,
  todayLabel,
  weekDays,
  type CalendarEvent,
  type EventKind,
} from "../data";
import { Icon } from "./Icons";

type CalendarProps = {
  onBack: () => void;
  embedded?: boolean;
};

const order: EventKind[] = ["medication", "appointment", "call", "meal", "hydration"];

export default function Calendar({ onBack, embedded }: CalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [filter, setFilter] = useState<EventKind | "all">("all");

  function toggle(id: string) {
    setEvents((list) =>
      list.map((e) => (e.id === id ? { ...e, done: !e.done } : e))
    );
  }

  const visible = events.filter((e) => filter === "all" || e.kind === filter);
  const remaining = events.filter((e) => !e.done).length;

  return (
    <div className="calendar">
      {!embedded && (
        <header className="bridge__top">
          <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
            <Icon name="back" className="icon" />
          </button>
          <div className="bridge__titles">
            <h1>Calendar</h1>
            <p>{todayLabel} · {remaining} reminders left</p>
          </div>
        </header>
      )}

      <div className="week" role="list">
        {weekDays.map((d, i) => (
          <div
            key={i}
            role="listitem"
            className={`week__day ${d.today ? "is-today" : ""}`}
          >
            <span className="week__label">{d.label}</span>
            <span className="week__date">{d.date}</span>
          </div>
        ))}
      </div>

      <div className="filters">
        <button
          type="button"
          className={`filter ${filter === "all" ? "is-on" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {order.map((kind) => (
          <button
            key={kind}
            type="button"
            className={`filter filter--${kind} ${filter === kind ? "is-on" : ""}`}
            onClick={() => setFilter(kind)}
          >
            <Icon name={eventKindMeta[kind].icon} className="filter__icon" />
            {eventKindMeta[kind].label}
          </button>
        ))}
      </div>

      <ol className="agenda">
        {visible.map((e) => (
          <li
            key={e.id}
            className={`slot slot--${e.kind} ${e.done ? "is-done" : ""}`}
          >
            <span className="slot__time">{e.time}</span>
            <span className="slot__icon" aria-hidden="true">
              <Icon name={eventKindMeta[e.kind].icon} className="icon" />
            </span>
            <div className="slot__body">
              <span className="slot__title">{e.title}</span>
              {e.detail && <span className="slot__detail">{e.detail}</span>}
              <span className="slot__kind">{eventKindMeta[e.kind].label}</span>
            </div>
            <button
              type="button"
              className={`slot__check ${e.done ? "is-checked" : ""}`}
              onClick={() => toggle(e.id)}
              aria-pressed={e.done}
              aria-label={e.done ? "Mark as not done" : "Mark as done"}
            >
              <Icon name="check" className="icon" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
