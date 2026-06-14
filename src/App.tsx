import { useState } from "react";
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
import { usePersistentState } from "./lib/usePersistentState";

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
  const [section, setSection] = useState<Section | null>(null);
  const [view, setView] = useState("home");
  // Shared-account voice settings (saved across reloads).
  const [voices, setVoices] = usePersistentState<VoiceProfile[]>("voices", defaultVoices);
  const [groundingVoiceId, setGroundingVoiceId] = usePersistentState(
    "groundingVoiceId",
    ANCHOR_COMPANION.id
  );

  const home = () => setView("home");
  const addVoice = (v: VoiceProfile) => setVoices((prev) => [...prev, v]);
  const groundingVoice =
    voices.find((v) => v.id === groundingVoiceId) ?? ANCHOR_COMPANION;
  const switchView = () => {
    setSection(null);
    setView("home");
  };

  let cls: string;
  let body: JSX.Element;

  if (!section) {
    cls = "landing";
    body = (
      <RoleLanding
        onPick={(s) => {
          setSection(s);
          setView("home");
        }}
      />
    );
  } else if (section === "caregiver") {
    cls = "caregiver";
    body = (
      <CaregiverView
        voices={voices}
        groundingVoiceId={groundingVoiceId}
        onVoiceChange={setGroundingVoiceId}
        onSwitch={switchView}
      />
    );
  } else {
    const features: Record<string, JSX.Element> = {
      bridge: <MemoryBridge onBack={home} />,
      messages: <Messages onBack={home} />,
      journal: <Journal onBack={home} />,
      calendar: <Calendar onBack={home} />,
      remindme: <RemindMe onBack={home} />,
      memorymap: <MemoryMap onBack={home} />,
      carecircle: <CareCircle onBack={home} />,
      storykeeper: <StoryKeeper onBack={home} />,
      safepath: <SafePath onBack={home} />,
      companion: <Companion onBack={home} />,
      dailyanchor: <DailyAnchor onBack={home} />,
      memorybook: <MemoryBook onBack={home} />,
      voicesetup: <VoiceSetup voices={voices} onAdd={addVoice} onBack={home} />,
      reality: (
        <RealitySupport
          onReturn={home}
          voiceId={groundingVoice.id}
          voiceName={groundingVoice.name}
        />
      ),
    };
    const isHome = view === "home";
    cls = isHome ? section : view;
    body = isHome ? (
      <SectionHome section={section} onNavigate={setView} onSwitch={switchView} />
    ) : (
      features[view]
    );
  }

  return (
    <div className="page">
      <div className="device">
        <div className="device__screen">
          <span className="device__island" aria-hidden="true" />
          <StatusBar />
          <div className="device__scroll">
            <div className={`app app--${cls}`}>{body}</div>
          </div>
          <span className="device__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
