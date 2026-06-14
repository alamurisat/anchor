import { useEffect, useRef, useState } from "react";
import { mapPlaces } from "../data";
import { Icon } from "./Icons";

type MemoryMapProps = {
  onBack: () => void;
};

export default function MemoryMap({ onBack }: MemoryMapProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function togglePlay(id: string) {
    if (playingId === id) {
      setPlayingId(null);
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    setPlayingId(id);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPlayingId(null), 3500);
  }

  return (
    <div className="memorymap">
      <header className="bridge__top">
        <button type="button" className="iconbtn" onClick={onBack} aria-label="Back to home">
          <Icon name="back" className="icon" />
        </button>
        <div className="bridge__titles">
          <h1>Memory Lane</h1>
          <p>A walk through your favourite places</p>
        </div>
      </header>

      <ol className="lane">
        {mapPlaces.map((p) => {
          const playing = playingId === p.id;
          return (
            <li key={p.id} className="lane-stop">
              <span className="lane-node" aria-hidden="true">
                <Icon name={p.icon} className="icon" />
              </span>
              <article className="lane-card">
                <h2 className="lane-card__title">{p.title}</h2>
                <p className="lane-card__story">{p.story}</p>
                {p.audio && (
                  <button
                    type="button"
                    className={`listen ${playing ? "is-playing" : ""}`}
                    onClick={() => togglePlay(p.id)}
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
                      <span>Listen to this memory · {p.audio}</span>
                    )}
                  </button>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
