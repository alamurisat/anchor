import { useState } from "react";
import {
  eventsByDay,
  eventKindMeta,
  weekDays,
  type CalendarEvent,
  type EventKind,
} from "../data";
import { usePersistentState } from "../lib/usePersistentState";
import { Icon } from "./Icons";

type CalendarProps = {
  onBack: () => void;
  embedded?: boolean;
};

const order: EventKind[] = ["medication", "appointment", "call", "meal", "hydration"];
const todayDate = weekDays.find((d) => d.today)?.date ?? weekDays[0].date;

export default function Calendar({ onBack, embedded }: CalendarProps) {
  // Whole-week schedule, saved across reloads (per-day done states too).
  const [byDay, setByDay] = usePersistentState<Record<number, CalendarEvent[]>>(
    "calendar.byDay",
    eventsByDay
  );
  const [selected, setSelected] = useState<number>(todayDate);
  const [filter, setFilter] = useState<EventKind | "all">("all");

  const dayEvents = byDay[selected] ?? [];
  const visible = dayEvents.filter((e) => filter === "all" || e.kind === filter);
  const remaining = dayEvents.filter((e) => !e.done).length;
  const selectedDay = weekDays.find((d) => d.date === selected);
  const heading =
    selected === todayDate ? "Today" : selectedDay?.name ?? "That day";

  function toggle(id: string) {
    setByDay((prev) => ({
      ...prev,
      [selected]: (prev[selected] ?? []).map((e) =>
        e.id === id ? { ...e, done: !e.done } : e
      ),
    }));
  }

  return (
    <div className="calendar">
      {!embedded && (
        <header className="bridge__top">
          <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
            <Icon name="back" className="icon" />
          </button>
          <div className="bridge__titles">
            <h1>Calendar</h1>
            <p>{heading} · {remaining} reminders left</p>
          </div>
        </header>
      )}

      <div className="week" role="tablist" aria-label="Days of the week">
        {weekDays.map((d) => (
          <button
            key={d.date}
            type="button"
            role="tab"
            aria-selected={selected === d.date}
            className={`week__day ${d.today ? "is-today" : ""} ${
              selected === d.date ? "is-selected" : ""
            }`}
            onClick={() => setSelected(d.date)}
          >
            <span className="week__label">{d.label}</span>
            <span className="week__date">{d.date}</span>
          </button>
        ))}
      </div>

      {embedded && (
        <p className="cal-dayhead">
          {heading} · {remaining} reminders left
        </p>
      )}

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
        {visible.length === 0 ? (
          <li className="cal-empty">Nothing scheduled here.</li>
        ) : (
          visible.map((e) => (
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
          ))
        )}
      </ol>
    </div>
  );
}
