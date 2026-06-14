import { useState } from "react";
import { monthOptions, type SharedMemory } from "../data";
import { usePersistentState } from "../lib/usePersistentState";
import { Icon } from "./Icons";

type MemoryBookProps = {
  onBack: () => void;
};

type View = "home" | "add";

const emptyForm = {
  title: "",
  description: "",
  day: "",
  month: "",
  year: "",
};

export default function MemoryBook({ onBack }: MemoryBookProps) {
  const [view, setView] = useState<View>("home");
  const [name, setName] = usePersistentState("mb.name", "");
  const [connection, setConnection] = usePersistentState("mb.connection", "");
  const [memories, setMemories] = usePersistentState<SharedMemory[]>("mb.memories", []);

  // Add-a-memory form state.
  const [form, setForm] = useState(emptyForm);
  const [locations, setLocations] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [locationDraft, setLocationDraft] = useState("");
  const [personDraft, setPersonDraft] = useState("");

  function resetForm() {
    setForm(emptyForm);
    setLocations([]);
    setPeople([]);
    setLocationDraft("");
    setPersonDraft("");
  }

  function addLocation() {
    const v = locationDraft.trim();
    if (!v) return;
    setLocations((l) => [...l, v]);
    setLocationDraft("");
  }

  function addPerson() {
    const v = personDraft.trim();
    if (!v) return;
    setPeople((p) => [...p, v]);
    setPersonDraft("");
  }

  function saveMemory() {
    if (!form.title.trim()) return;
    setMemories((list) => [
      {
        id: `mb-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        day: form.day.trim(),
        month: form.month,
        year: form.year.trim(),
        locations,
        people,
        by: name.trim() || "A loved one",
        connection: connection.trim(),
      },
      ...list,
    ]);
    resetForm();
    setView("home");
  }

  const dateLabel = (m: SharedMemory) =>
    [m.day, m.month, m.year].filter(Boolean).join(" ");

  /* ---------------- Add a Memory ---------------- */
  if (view === "add") {
    return (
      <div className="mbook">
        <div className="mbook__bar" aria-hidden="true" />
        <div className="mbook__inner">
          <header className="mbook__head">
            <button
              type="button"
              className="mbook__back"
              onClick={() => setView("home")}
              aria-label="Back to Memory Book"
            >
              <Icon name="back" className="icon" />
            </button>
            <h1 className="mbook__title">Add a Memory</h1>
          </header>

          <label className="mb-field">
            <span className="mb-label">Memory Title</span>
            <input
              className="mb-input"
              type="text"
              value={form.title}
              placeholder="The summer we went camping…"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="mb-field">
            <span className="mb-label">Description</span>
            <textarea
              className="mb-input mb-textarea"
              value={form.description}
              placeholder="Describe the memory in as much detail as you’d like…"
              rows={5}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="mb-field">
            <span className="mb-label">
              <Icon name="calendar" className="mb-label-icon" />
              When did this happen?
            </span>
            <div className="mb-date">
              <label className="mb-date__col">
                <span className="mb-date__cap">Day</span>
                <input
                  className="mb-input"
                  type="text"
                  inputMode="numeric"
                  value={form.day}
                  placeholder="e.g. 14"
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                />
              </label>
              <label className="mb-date__col">
                <span className="mb-date__cap">Month</span>
                <div className="mb-select-wrap">
                  <select
                    className="mb-input mb-select"
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                  >
                    <option value="">Month</option>
                    {monthOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <span className="mb-select__chev" aria-hidden="true">
                    <Icon name="back" className="icon" />
                  </span>
                </div>
              </label>
              <label className="mb-date__col">
                <span className="mb-date__cap">Year</span>
                <input
                  className="mb-input"
                  type="text"
                  inputMode="numeric"
                  value={form.year}
                  placeholder="e.g. 1998"
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="mb-field">
            <span className="mb-label">
              <Icon name="place" className="mb-label-icon" />
              Significant locations
            </span>
            <div className="mb-addrow">
              <input
                className="mb-input"
                type="text"
                value={locationDraft}
                placeholder="Grandma’s kitchen, Lake Tahoe…"
                onChange={(e) => setLocationDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLocation();
                  }
                }}
              />
              <button type="button" className="mb-add" onClick={addLocation}>
                Add
              </button>
            </div>
            {locations.length > 0 && (
              <div className="mb-chips">
                {locations.map((l, i) => (
                  <span key={`${l}-${i}`} className="mb-chip">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-field">
            <span className="mb-label">
              <Icon name="users" className="mb-label-icon" />
              People in this memory
            </span>
            <div className="mb-addrow">
              <input
                className="mb-input"
                type="text"
                value={personDraft}
                placeholder="Aunt Carol, Uncle Jim…"
                onChange={(e) => setPersonDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPerson();
                  }
                }}
              />
              <button type="button" className="mb-add" onClick={addPerson}>
                Add
              </button>
            </div>
            {people.length > 0 && (
              <div className="mb-chips">
                {people.map((p, i) => (
                  <span key={`${p}-${i}`} className="mb-chip">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="mb-save"
            onClick={saveMemory}
            disabled={!form.title.trim()}
          >
            Save Memory
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Home ---------------- */
  return (
    <div className="mbook">
      <div className="mbook__bar" aria-hidden="true" />
      <div className="mbook__inner">
        <button
          type="button"
          className="mbook__exit"
          onClick={onBack}
          aria-label="Back to home"
        >
          <Icon name="back" className="icon" />
        </button>

        <div className="mbook__hero">
          <span className="mbook__badge">
            <Icon name="bookheart" className="icon" />
          </span>
          <h1 className="mbook__title mbook__title--center">Memory Book</h1>
          <p className="mbook__subtitle">
            Share a cherished memory with someone you love.
          </p>
        </div>

        <section className="mb-card">
          <label className="mb-field">
            <span className="mb-label">Your Name</span>
            <input
              className="mb-input mb-input--filled"
              type="text"
              value={name}
              placeholder="e.g. Angela"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mb-field">
            <span className="mb-label">Your Connection</span>
            <input
              className="mb-input mb-input--filled"
              type="text"
              value={connection}
              placeholder="e.g. Grandmother, Best Friend, Neighbour…"
              onChange={(e) => setConnection(e.target.value)}
            />
          </label>
        </section>

        <button type="button" className="mb-addmemory" onClick={() => setView("add")}>
          <span className="mb-addmemory__plus">
            <Icon name="plus" className="icon" />
          </span>
          <span className="mb-addmemory__label">Add a Memory</span>
        </button>

        {memories.length === 0 ? (
          <p className="mbook__empty">
            Your memories will appear here once you add them.
          </p>
        ) : (
          <div className="mb-list">
            {memories.map((m) => (
              <article key={m.id} className="mb-memory">
                <h2 className="mb-memory__title">{m.title}</h2>
                {dateLabel(m) && (
                  <span className="mb-memory__date">{dateLabel(m)}</span>
                )}
                {m.description && (
                  <p className="mb-memory__desc">{m.description}</p>
                )}
                {(m.locations.length > 0 || m.people.length > 0) && (
                  <div className="mb-memory__tags">
                    {m.locations.map((l, i) => (
                      <span key={`l-${i}`} className="mb-tag mb-tag--place">
                        <Icon name="place" className="mb-tag__icon" />
                        {l}
                      </span>
                    ))}
                    {m.people.map((p, i) => (
                      <span key={`p-${i}`} className="mb-tag mb-tag--person">
                        <Icon name="users" className="mb-tag__icon" />
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                <span className="mb-memory__by">
                  Shared by {m.by}
                  {m.connection ? ` · ${m.connection}` : ""}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
