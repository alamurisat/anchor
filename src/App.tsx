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

export default function App() {
  const [section, setSection] = useState<Section | null>(null);
  const [view, setView] = useState("home");

  const home = () => setView("home");

  if (!section) {
    return (
      <div className="app app--landing">
        <RoleLanding
          onPick={(s) => {
            setSection(s);
            setView("home");
          }}
        />
      </div>
    );
  }

  // The caregiver view is a self-contained tabbed dashboard.
  if (section === "caregiver") {
    return (
      <div className="app app--caregiver">
        <CaregiverView
          onSwitch={() => {
            setSection(null);
            setView("home");
          }}
        />
      </div>
    );
  }

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
    reality: <RealitySupport onReturn={home} />,
  };

  const isHome = view === "home";
  const cls = isHome ? section : view;

  return (
    <div className={`app app--${cls}`}>
      {isHome ? (
        <SectionHome
          section={section}
          onNavigate={setView}
          onSwitch={() => {
            setSection(null);
            setView("home");
          }}
        />
      ) : (
        features[view]
      )}
    </div>
  );
}
