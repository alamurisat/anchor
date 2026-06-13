import type { IconName } from "../data";

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, JSX.Element> = {
  sunrise: (
    <>
      <path d="M12 3v3M5.6 8.6 7.7 10.7M3 16h2M19 16h2M16.3 10.7l2.1-2.1" />
      <path d="M3 20h18" />
      <path d="M8 16a4 4 0 0 1 8 0" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z" />
      <path d="M5 19c3-4 6-6 9-7.5" />
    </>
  ),
  bowl: (
    <>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M9 7c0-1 .8-1.5.8-2.5M13 7c0-1 .8-1.5.8-2.5" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  place: (
    <>
      <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  photo: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M5 17l4.5-4 3.5 3 3-2.5L19 17" />
    </>
  ),
  video: (
    <>
      <rect x="3.5" y="6" width="12" height="12" rx="3" />
      <path d="M15.5 10l5-3v10l-5-3" />
    </>
  ),
  voice: (
    <>
      <path d="M4 12h2l2.5-6 3 14 2.5-9 1.5 3h4.5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  back: <path d="M14.5 6l-6 6 6 6" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  chat: (
    <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 4v-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="3" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </>
  ),
  phone: (
    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  book: (
    <>
      <path d="M5 4.5h9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H5Z" />
      <path d="M5 4.5v13" />
    </>
  ),
  feather: (
    <>
      <path d="M19 5a6 6 0 0 1-6 6l-5 5-2-2 5-5a6 6 0 0 1 6-6c1 0 2 .5 2 2Z" />
      <path d="M6 18l4-4" />
    </>
  ),
  pill: (
    <>
      <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="M8.5 8.5l7 7" />
    </>
  ),
  droplet: <path d="M12 3.5s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10Z" />,
  heart: (
    <path d="M12 20s-7-4.6-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.4 12 20 12 20Z" />
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4M12 17.5v.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.6M16.5 19a5.5 5.5 0 0 0-3-4.9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.3 2.9 7.7 7 9 4.1-1.3 7-4.7 7-9V6l-7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.5h3l4-3.5v12l-4-3.5H4Z" />
      <path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7 7 0 0 1 0 11" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  bookheart: (
    <>
      <path d="M6 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5a2 2 0 0 0-2-2H6Z" />
      <path d="M11.6 9.6c-.7-.9-2.2-.5-2.2.7 0 .9 1.1 1.7 2.2 2.6 1.1-.9 2.2-1.7 2.2-2.6 0-1.2-1.5-1.6-2.2-.7Z" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  building: (
    <>
      <path d="M6 21V6l6-3 6 3v15" />
      <path d="M12 3v18M9 9h0M15 9h0M9 13h0M15 13h0" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 8h12v4a5 5 0 0 1-10 0Z" />
      <path d="M17 9h2a2 2 0 0 1 0 4h-2" />
      <path d="M6 21h12" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17" />
    </>
  ),
  plane: (
    <path d="M10.5 3.5c.8-.8 2-.8 2 .8v5l7 4v2l-7-2v3.5l2 1.5v1.5l-3.5-1-3.5 1V18l2-1.5V13l-7 2v-2l7-4v-5c0-1.6 1.2-1.6 2-.8Z" />
  ),
  star: (
    <path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5 6.9 19.2 8 13.5l-4.3-4 5.8-.7L12 3.5Z" />
  ),
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
