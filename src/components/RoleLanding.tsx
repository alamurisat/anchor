import { Icon } from "./Icons";
import type { IconName } from "../data";
import logo from "../assets/anchor.png";

export type Section = "family" | "caregiver" | "patient";

type RoleLandingProps = {
  onPick: (section: Section) => void;
};

type Role = {
  id: Section;
  icon: IconName;
  title: string;
  description: string;
};

const roles: Role[] = [
  {
    id: "patient",
    icon: "volume",
    title: "For You",
    description: "A calm, voice-guided companion. Tap and listen. Anchor is always here.",
  },
  {
    id: "family",
    icon: "bookheart",
    title: "Friends & Family",
    description: "Share cherished memories, record stories, and stay close.",
  },
  {
    id: "caregiver",
    icon: "shield",
    title: "Caregiver",
    description: "Track wellbeing, manage the day, and see alerts at a glance.",
  },
];

export default function RoleLanding({ onPick }: RoleLandingProps) {
  return (
    <div className="landing">
      <div className="landing__inner">
        <header className="landing__brand">
          <img className="landing__logo" src={logo} alt="Anchor" />
          <h1 className="landing__name">Anchor</h1>
          <p className="landing__tagline">Their voice, your anchor.</p>
        </header>

        <div className="landing__roles">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role role--${role.id}`}
              onClick={() => onPick(role.id)}
            >
              <span className="role__icon">
                <Icon name={role.icon} className="icon" />
              </span>
              <span className="role__text">
                <span className="role__title">{role.title}</span>
                <span className="role__desc">{role.description}</span>
              </span>
              <span className="role__chev" aria-hidden="true">
                <Icon name="back" className="icon" />
              </span>
            </button>
          ))}
        </div>

        <p className="landing__note">
          Everything lives under one shared account. Switch views anytime.
        </p>
      </div>
    </div>
  );
}
