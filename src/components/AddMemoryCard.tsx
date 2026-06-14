import { useEffect, useRef, useState } from "react";
import { personName } from "../data";
import { Icon } from "./Icons";

// A quick photo / video / voice contribution for friends & family.
export default function AddMemoryCard() {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function add() {
    setJustAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 2600);
  }

  return (
    <section className="add" aria-label="Add a memory">
      <div className="add__head">
        <h2>Add a memory</h2>
        <p>Photos, videos, and voice notes help {personName} feel grounded.</p>
      </div>
      <div className="add__row">
        <button type="button" className="add__btn" onClick={add}>
          <Icon name="photo" className="add__icon" />
          Photo
        </button>
        <button type="button" className="add__btn" onClick={add}>
          <Icon name="video" className="add__icon" />
          Video
        </button>
        <button type="button" className="add__btn" onClick={add}>
          <Icon name="voice" className="add__icon" />
          Voice
        </button>
      </div>
      <p className={`add__note ${justAdded ? "add__note--show" : ""}`} role="status">
        Thank you. Your memory was added to {personName}’s collection.
      </p>
    </section>
  );
}
