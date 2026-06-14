import { useEffect, useState } from "react";
import RoleLanding, { type Section } from "./components/RoleLanding";
import SectionHome from "./components/SectionHome";
import CaregiverView from "./components/CaregiverView";
import RealitySupport from "./components/RealitySupport";
import MemoryBridge from "./components/MemoryBridge";
import Messages from "./components/Messages";
import Journal from "./components/Journal";
import Calendar from "./components/Calendar";
import RemindMe from "./components/RemindMe";
import MemoryMap from "./components/MemoryMap";
import CareCircle from "./components/CareCircle";
import StoryKeeper from "./components/StoryKeeper";
import SafePath from "./components/SafePath";
import Companion from "./components/Companion";
import DailyAnchor from "./components/DailyAnchor";
import MemoryBook from "./components/MemoryBook";
import VoiceSetup from "./components/VoiceSetup";
import {
  ANCHOR_COMPANION,
  defaultVoices,
  type VoiceProfile,
} from "./lib/voice";
import type { AddedMemory } from "./data";
import { usePersistentState } from "./lib/usePersistentState";
import { Icon } from "./components/Icons";

type Loc = { section: Section | null; view: string };
const ROOT: Loc = { section: null, view: "home" };

const TITLES: Record<string, string> = {
  bridge: "Memories",
  companion: "Who Is This?",
  journal: "Journal",
  messages: "Messages",
  dailyanchor: "My Day",
  storykeeper: "StoryKeeper",
  memorymap: "Memory Lane",
  voicesetup: "Voice Companion",
};

// Screens that manage their own navigation and shouldn't get the shared bar.
const NO_TOPBAR = ["memorybook", "reality"];

function TopBar({
  title,
  onBack,
  onLeave,
}: {
  title: string;
  onBack: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="topbar-nav">
      <button type="button" className="topbar-nav__btn" onClick={onBack}>
        <Icon name="back" className="topbar-nav__ic" />
        Back
      </button>
      <span className="topbar-nav__title">{title}</span>
      <button type="button" className="topbar-nav__btn topbar-nav__btn--leave" onClick={onLeave}>
        <Icon name="home" className="topbar-nav__ic" />
        Exit
      </button>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span className="statusbar__time">9:41</span>
      <span className="statusbar__icons">
        <svg className="sb-ic" viewBox="0 0 18 12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg className="sb-ic" viewBox="0 0 18 13" fill="none">
          <path
            d="M2 5a10 10 0 0 1 14 0M4.6 7.7a6 6 0 0 1 8.8 0M7.2 10.3a2.6 2.6 0 0 1 3.6 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="9" cy="12.2" r="0.7" fill="currentColor" />
        </svg>
        <svg className="sb-ic sb-ic--batt" viewBox="0 0 26 13">
          <rect x="1" y="1" width="21" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
          <rect x="2.6" y="2.6" width="16" height="7.8" rx="1.6" fill="currentColor" />
          <rect x="23" y="4.6" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

export default function App() {
  // Navigation history stack — the last entry is the current screen.
  const [stack, setStack] = useState<Loc[]>([ROOT]);
  const cur = stack[stack.length - 1];

  const [voices, setVoices] = usePersistentState<VoiceProfile[]>("voices", defaultVoices);
  const [groundingVoiceId, setGroundingVoiceId] = usePersistentState(
    "groundingVoiceId.v2",
    ANCHOR_COMPANION.id
  );
  const [addedMemories, setAddedMemories] = usePersistentState<AddedMemory[]>(
    "addedMemories",
    []
  );

  const addVoice = (v: VoiceProfile) => setVoices((prev) => [...prev, v]);
  const addMemory = (m: AddedMemory) => setAddedMemories((prev) => [m, ...prev]);
  const removeMemory = (id: string) =>
    setAddedMemories((prev) => prev.filter((m) => m.id !== id));
  const groundingVoice =
    voices.find((v) => v.id === groundingVoiceId) ?? ANCHOR_COMPANION;

  function push(loc: Loc) {
    setStack((s) => [...s, loc]);
    window.history.pushState({ anchor: true }, "");
  }
  function popOnce() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }
  // Going back routes through the browser so the phone/back gesture stays in sync.
  function back() {
    if (stack.length > 1) window.history.back();
  }
  function reset() {
    setStack([ROOT]);
  }

  useEffect(() => {
    const onPop = () => popOnce();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  let cls: string;
  let body: JSX.Element;

  if (!cur.section) {
    cls = "landing";
    body = <RoleLanding onPick={(s) => push({ section: s, view: "home" })} />;
  } else if (cur.section === "caregiver") {
    cls = "caregiver";
    body = (
      <CaregiverView
        voices={voices}
        groundingVoiceId={groundingVoiceId}
        onVoiceChange={setGroundingVoiceId}
        onSwitch={reset}
      />
    );
  } else {
    const features: Record<string, JSX.Element> = {
      bridge: <MemoryBridge onBack={back} added={addedMemories} onRemove={removeMemory} />,
      messages: <Messages onBack={back} />,
      journal: <Journal onBack={back} />,
      calendar: <Calendar onBack={back} />,
      remindme: <RemindMe onBack={back} />,
      memorymap: <MemoryMap onBack={back} />,
      carecircle: <CareCircle onBack={back} />,
      storykeeper: <StoryKeeper onBack={back} />,
      safepath: <SafePath onBack={back} />,
      companion: <Companion onBack={back} />,
      dailyanchor: <DailyAnchor onBack={back} />,
      memorybook: <MemoryBook onBack={back} />,
      voicesetup: <VoiceSetup voices={voices} onAdd={addVoice} onBack={back} />,
      reality: (
        <RealitySupport
          onReturn={back}
          voiceId={groundingVoice.id}
          voiceName={groundingVoice.name}
        />
      ),
    };
    const isHome = cur.view === "home";
    cls = isHome ? cur.section : cur.view;
    body = isHome ? (
      <SectionHome
        section={cur.section}
        onNavigate={(view) => push({ section: cur.section, view })}
        onSwitch={reset}
        onAddMemory={addMemory}
      />
    ) : (
      features[cur.view]
    );
  }

  const isFeature = !!cur.section && cur.view !== "home";
  const useTopBar = isFeature && !NO_TOPBAR.includes(cur.view);

  return (
    <div className="page">
      <div className="device">
        <div className="device__screen">
          <span className="device__island" aria-hidden="true" />
          <StatusBar />
          {useTopBar && (
            <TopBar title={TITLES[cur.view] ?? ""} onBack={back} onLeave={reset} />
          )}
          <div className="device__scroll">
            <div
              className={`app app--${cls}${useTopBar ? " app--feature" : ""} screen`}
              key={stack.length + ":" + cls}
            >
              {body}
            </div>
          </div>
          <span className="device__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
