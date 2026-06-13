import { useEffect, useRef, useState } from "react";
import {
  eventKindMeta,
  MISS_THRESHOLD,
  remindTasks,
  type RemindTask,
} from "../data";
import { Icon } from "./Icons";

type RemindMeProps = {
  onBack: () => void;
  embedded?: boolean;
};

export default function RemindMe({ onBack, embedded }: RemindMeProps) {
  const [tasks, setTasks] = useState<RemindTask[]>(remindTasks);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function speak(id: string) {
    setSpeakingId(id);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSpeakingId(null), 2800);
  }

  function complete(id: string) {
    setTasks((list) =>
      list.map((t) => (t.id === id ? { ...t, done: true } : t))
    );
  }

  function miss(id: string) {
    setTasks((list) =>
      list.map((t) => (t.id === id ? { ...t, missed: t.missed + 1 } : t))
    );
  }

  const pending = tasks.filter((t) => !t.done);
  const next = pending[0];

  return (
    <div className="remindme">
      {!embedded && (
        <header className="bridge__top">
          <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
            <Icon name="back" className="icon" />
          </button>
          <div className="bridge__titles">
            <h1>RemindMe</h1>
            <p>{pending.length} reminders left today</p>
          </div>
        </header>
      )}

      {next && (
        <section className="next" aria-label="Next reminder">
          <span className="next__eyebrow">Up next</span>
          <div className="next__main">
            <span className="next__icon">
              <Icon name={eventKindMeta[next.kind].icon} className="icon" />
            </span>
            <div className="next__text">
              <span className="next__title">{next.title}</span>
              <span className="next__time">{next.time}</span>
            </div>
          </div>
          {next.detail && <p className="next__detail">{next.detail}</p>}
          <button
            type="button"
            className={`next__speak ${speakingId === next.id ? "is-on" : ""}`}
            onClick={() => speak(next.id)}
          >
            <Icon name="volume" className="next__speak-icon" />
            {speakingId === next.id ? "Reading aloud…" : "Read this to me"}
          </button>
        </section>
      )}

      <section className="rm-list" aria-label="All reminders">
        <h2 className="calls__heading">Today’s reminders</h2>
        {tasks.map((t) => {
          const flagged = t.missed >= MISS_THRESHOLD && !t.done;
          return (
            <article
              key={t.id}
              className={`rm-item rm-item--${t.kind} ${t.done ? "is-done" : ""}`}
            >
              <span className="rm-item__time">{t.time}</span>
              <span className="rm-item__icon" aria-hidden="true">
                <Icon name={eventKindMeta[t.kind].icon} className="icon" />
              </span>
              <div className="rm-item__body">
                <span className="rm-item__title">{t.title}</span>
                {t.detail && <span className="rm-item__detail">{t.detail}</span>}
                {flagged && (
                  <span className="rm-item__alert">
                    <Icon name="alert" className="rm-item__alert-icon" />
                    Missed {t.missed} times · family notified
                  </span>
                )}
              </div>
              {!t.done ? (
                <div className="rm-item__actions">
                  <button
                    type="button"
                    className="rm-btn rm-btn--speak"
                    onClick={() => speak(t.id)}
                    aria-label="Read aloud"
                  >
                    <Icon name="volume" className="icon" />
                  </button>
                  <button
                    type="button"
                    className="rm-btn rm-btn--done"
                    onClick={() => complete(t.id)}
                    aria-label="Mark done"
                  >
                    <Icon name="check" className="icon" />
                  </button>
                  <button
                    type="button"
                    className="rm-btn rm-btn--miss"
                    onClick={() => miss(t.id)}
                  >
                    Missed
                  </button>
                </div>
              ) : (
                <span className="rm-item__doneflag">
                  <Icon name="check" className="icon" />
                </span>
              )}
            </article>
          );
        })}
      </section>

      <section className="addons" aria-label="Coming soon">
        <h2 className="calls__heading">Coming soon</h2>
        <div className="addons__row">
          <span className="addon">
            <Icon name="bell" className="addon__icon" />
            Smartwatch reminders
          </span>
          <span className="addon">
            <Icon name="place" className="addon__icon" />
            “Take your keys before leaving”
          </span>
        </div>
      </section>
    </div>
  );
}
