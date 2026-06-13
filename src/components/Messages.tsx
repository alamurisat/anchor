import { useEffect, useRef, useState } from "react";
import {
  callRequestsData,
  defaultReminders,
  messagesData,
  remindersData,
  scheduledCallsData,
  type CallRequest,
  type Person,
  type Reminder,
  type ScheduledCall,
} from "../data";
import { Icon } from "./Icons";

type MessagesProps = {
  onBack: () => void;
  embedded?: boolean;
};

type Tab = "messages" | "calls";

function Avatar({ person }: { person: Person }) {
  return (
    <span
      className="avatar"
      style={{ background: person.tint }}
      aria-hidden="true"
    >
      {person.initial}
    </span>
  );
}

export default function Messages({ onBack, embedded }: MessagesProps) {
  const [tab, setTab] = useState<Tab>("messages");

  // Read-aloud (simulated — ElevenLabs voice playback to be added later).
  const [playingId, setPlayingId] = useState<string | null>(null);
  const playTimer = useRef<number | null>(null);

  // Call state.
  const [pending, setPending] = useState<CallRequest[]>(callRequestsData);
  const [scheduled, setScheduled] = useState<ScheduledCall[]>(scheduledCallsData);
  const [reminders, setReminders] = useState<Reminder[]>(remindersData);

  useEffect(() => {
    return () => {
      if (playTimer.current) window.clearTimeout(playTimer.current);
    };
  }, []);

  function readAloud(id: string) {
    if (playingId === id) {
      setPlayingId(null);
      if (playTimer.current) window.clearTimeout(playTimer.current);
      return;
    }
    setPlayingId(id);
    if (playTimer.current) window.clearTimeout(playTimer.current);
    playTimer.current = window.setTimeout(() => setPlayingId(null), 3500);
  }

  function acceptRequest(req: CallRequest) {
    setScheduled((list) => [
      ...list,
      {
        id: `s-${req.id}`,
        with: req.from,
        when: req.when,
        reminders: defaultReminders,
      },
    ]);
    setPending((list) => list.filter((r) => r.id !== req.id));
  }

  function declineRequest(req: CallRequest) {
    setPending((list) => list.filter((r) => r.id !== req.id));
  }

  function markCalled(call: ScheduledCall) {
    setScheduled((list) => list.filter((c) => c.id !== call.id));
  }

  // Missed call: the event leaves the calendar, but a reminder to call remains.
  function markMissed(call: ScheduledCall) {
    setScheduled((list) => list.filter((c) => c.id !== call.id));
    setReminders((list) => [
      {
        id: `r-${call.id}`,
        text: `You missed your call with ${call.with.name}. Give them a call when you’re ready.`,
        kind: "missed",
      },
      ...list,
    ]);
  }

  function dismissReminder(r: Reminder) {
    setReminders((list) => list.filter((x) => x.id !== r.id));
  }

  return (
    <div className="messages">
      {!embedded && (
        <header className="bridge__top">
          <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
            <Icon name="back" className="icon" />
          </button>
          <div className="bridge__titles">
            <h1>Messages</h1>
            <p>From the people who love you</p>
          </div>
        </header>
      )}

      <div className="segmented" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "messages"}
          className={`segmented__btn ${tab === "messages" ? "is-active" : ""}`}
          onClick={() => setTab("messages")}
        >
          <Icon name="chat" className="segmented__icon" />
          Messages
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "calls"}
          className={`segmented__btn ${tab === "calls" ? "is-active" : ""}`}
          onClick={() => setTab("calls")}
        >
          <Icon name="phone" className="segmented__icon" />
          Calls
          {pending.length > 0 && (
            <span className="segmented__count">{pending.length}</span>
          )}
        </button>
      </div>

      {tab === "messages" && (
        <div className="thread">
          {messagesData.map((m) => {
            const playing = playingId === m.id;
            return (
              <article key={m.id} className="msg">
                <Avatar person={m.from} />
                <div className="msg__body">
                  <div className="msg__head">
                    <span className="msg__name">{m.from.name}</span>
                    <span className="msg__relation">{m.from.relation}</span>
                    <span className="msg__time">{m.time}</span>
                  </div>
                  <p className="msg__text">{m.text}</p>
                  {m.voice && (
                    <button
                      type="button"
                      className={`readaloud ${playing ? "is-playing" : ""}`}
                      onClick={() => readAloud(m.id)}
                    >
                      <Icon name={playing ? "close" : "play"} className="readaloud__icon" />
                      {playing ? (
                        <>
                          <span>Playing in {m.from.name}’s voice</span>
                          <span className="wave" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                          </span>
                        </>
                      ) : (
                        <span>Read aloud in {m.from.name}’s voice</span>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
          <p className="thread__note">
            Voices are played in each family member’s own voice. Voice playback
            is coming soon.
          </p>
        </div>
      )}

      {tab === "calls" && (
        <div className="calls">
          <section className="calls__section" aria-label="Call requests">
            <h2 className="calls__heading">Call requests</h2>
            {pending.length === 0 ? (
              <p className="calls__empty">No new requests right now.</p>
            ) : (
              pending.map((req) => (
                <article key={req.id} className="request">
                  <div className="request__top">
                    <Avatar person={req.from} />
                    <div className="request__who">
                      <span className="msg__name">{req.from.name}</span>
                      <span className="msg__relation">{req.from.relation}</span>
                    </div>
                    <span className="request__when">
                      <Icon name="calendar" className="request__when-icon" />
                      {req.when}
                    </span>
                  </div>
                  <p className="request__note">“{req.note}”</p>
                  <div className="request__actions">
                    <button
                      type="button"
                      className="btn-accept"
                      onClick={() => acceptRequest(req)}
                    >
                      <Icon name="check" className="btn-accept__icon" />
                      Add to calendar
                    </button>
                    <button
                      type="button"
                      className="btn-decline"
                      onClick={() => declineRequest(req)}
                    >
                      Not now
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="calls__section" aria-label="On your calendar">
            <h2 className="calls__heading">On your calendar</h2>
            {scheduled.length === 0 ? (
              <p className="calls__empty">No calls scheduled.</p>
            ) : (
              scheduled.map((call) => (
                <article key={call.id} className="event">
                  <div className="event__time" aria-hidden="true">
                    <Icon name="calendar" className="icon" />
                  </div>
                  <div className="event__body">
                    <span className="event__title">Call with {call.with.name}</span>
                    <span className="event__when">{call.when}</span>
                    <div className="event__reminders">
                      {call.reminders.map((r) => (
                        <span key={r} className="event__chip">
                          <Icon name="bell" className="event__chip-icon" />
                          {r}
                        </span>
                      ))}
                    </div>
                    <div className="event__actions">
                      <button
                        type="button"
                        className="event__done"
                        onClick={() => markCalled(call)}
                      >
                        <Icon name="check" className="event__done-icon" />
                        We spoke
                      </button>
                      <button
                        type="button"
                        className="event__miss"
                        onClick={() => markMissed(call)}
                      >
                        Call missed
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="calls__section" aria-label="Reminders">
            <h2 className="calls__heading">Reminders</h2>
            {reminders.length === 0 ? (
              <p className="calls__empty">You’re all caught up.</p>
            ) : (
              reminders.map((r) => (
                <article key={r.id} className={`reminder reminder--${r.kind}`}>
                  <span className="reminder__icon" aria-hidden="true">
                    <Icon name="bell" className="icon" />
                  </span>
                  <p className="reminder__text">{r.text}</p>
                  <button
                    type="button"
                    className="reminder__dismiss"
                    onClick={() => dismissReminder(r)}
                    aria-label="Dismiss reminder"
                  >
                    <Icon name="close" className="icon" />
                  </button>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
