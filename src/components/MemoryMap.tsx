import { useEffect, useRef, useState } from "react";
import { mapPlaces, type MapPlace } from "../data";
import { Icon } from "./Icons";

type MemoryMapProps = {
  onBack: () => void;
};

export default function MemoryMap({ onBack }: MemoryMapProps) {
  const [active, setActive] = useState<MapPlace>(mapPlaces[0]);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function select(place: MapPlace) {
    setActive(place);
    setPlaying(false);
    if (timer.current) window.clearTimeout(timer.current);
  }

  function togglePlay() {
    setPlaying((p) => !p);
    if (timer.current) window.clearTimeout(timer.current);
    if (!playing) {
      timer.current = window.setTimeout(() => setPlaying(false), 3500);
    }
  }

  return (
    <div className="memorymap">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Memory Map</h1>
          <p>The places that made you, you</p>
        </div>
      </header>

      <div className="map" role="group" aria-label="Map of meaningful places">
        <span className="map__path" aria-hidden="true" />
        {mapPlaces.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pin ${active.id === p.id ? "is-active" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => select(p)}
            aria-label={p.title}
          >
            <span className="pin__bubble">
              <Icon name={p.icon} className="pin__icon" />
            </span>
            <span className="pin__label">{p.title}</span>
          </button>
        ))}
      </div>

      <article className="place">
        <div className="place__photo" aria-hidden="true">
          <Icon name={active.icon} className="place__icon" />
        </div>
        <div className="place__text">
          <h2>{active.title}</h2>
          <p>{active.story}</p>
          {active.audio && (
            <button
              type="button"
              className={`listen ${playing ? "is-playing" : ""}`}
              onClick={togglePlay}
            >
              <Icon name={playing ? "close" : "play"} className="listen__icon" />
              {playing ? (
                <>
                  <span>Playing…</span>
                  <span className="wave" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                </>
              ) : (
                <span>Listen to this memory · {active.audio}</span>
              )}
            </button>
          )}
        </div>
      </article>

      <p className="map__hint">Tap a place on the map to revisit its story.</p>
    </div>
  );
}
