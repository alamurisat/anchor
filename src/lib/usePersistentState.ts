import { useEffect, useRef, useState } from "react";

// A drop-in replacement for useState that saves to localStorage, so anything
// the user adds (memories, notes, stories, voices, settings) survives reloads.
// No login needed — this is a local demo store.
export function usePersistentState<T>(key: string, initial: T) {
  const storageKey = `anchor.${key}`;

  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw != null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Skip writing on the very first render (we just read it).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — ignore in a demo */
    }
  }, [storageKey, state]);

  return [state, setState] as const;
}
