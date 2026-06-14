export type IconName =
  | "sunrise"
  | "leaf"
  | "bowl"
  | "music"
  | "moon"
  | "place"
  | "person"
  | "clock"
  | "photo"
  | "video"
  | "voice"
  | "mic"
  | "search"
  | "back"
  | "sparkle"
  | "plus"
  | "chat"
  | "calendar"
  | "bell"
  | "phone"
  | "check"
  | "play"
  | "close"
  | "book"
  | "feather"
  | "pill"
  | "droplet"
  | "heart"
  | "alert"
  | "users"
  | "shield"
  | "volume"
  | "map"
  | "bookheart"
  | "home"
  | "building"
  | "coffee"
  | "briefcase"
  | "plane"
  | "star";

export type RoutineItem = {
  time: string;
  title: string;
  detail: string;
  icon: IconName;
  status: "done" | "now" | "upcoming";
};

export type MemoryCard = {
  id: string;
  title: string;
  description: string;
  // Soft gradient used as a warm stand-in for a real photo.
  tint: string;
  emoji: string;
};

export type GroundingContext = {
  place: string;
  companion: string;
  timeOfDay: string;
};

export const caregiverName = "Sarah";
export const personName = "Angela";
export const todayLabel = "Tuesday morning";

export const todaysRoutine: RoutineItem[] = [
  {
    time: "8:00",
    title: "Breakfast",
    detail: "Oatmeal and coffee in the kitchen",
    icon: "sunrise",
    status: "done",
  },
  {
    time: "10:30",
    title: "Morning walk",
    detail: "A stroll around the garden with Sarah",
    icon: "leaf",
    status: "now",
  },
  {
    time: "12:30",
    title: "Lunch",
    detail: "Soup and a sandwich",
    icon: "bowl",
    status: "upcoming",
  },
  {
    time: "15:00",
    title: "Rest & music",
    detail: "Favorite records in the living room",
    icon: "music",
    status: "upcoming",
  },
  {
    time: "18:00",
    title: "Dinner",
    detail: "A family meal at the table",
    icon: "moon",
    status: "upcoming",
  },
];

export const memoryLibrary: MemoryCard[] = [
  {
    id: "family-dinner",
    title: "Family dinner",
    description: "You often have dinner here with your family on Sundays.",
    tint: "linear-gradient(135deg, #ffd9b0, #ff9e6d)",
    emoji: "🍽️",
  },
  {
    id: "garden",
    title: "The garden",
    description: "You planted these roses with Sarah three springs ago.",
    tint: "linear-gradient(135deg, #ffe2b8, #f6a96b)",
    emoji: "🌷",
  },
  {
    id: "wedding",
    title: "Wedding day",
    description: "You and Tom were married on a bright morning in June.",
    tint: "linear-gradient(135deg, #ffe7c9, #ffb98a)",
    emoji: "💛",
  },
];

export const groundingContext: GroundingContext = {
  place: "Home · Living Room",
  companion: "Sarah · Your daughter",
  timeOfDay: "Tuesday morning · Coffee time",
};

// The memory shown during a grounding moment.
export const familiarMemory: MemoryCard = memoryLibrary[0];

/* ============================================================
   MemoryBridge — simulated memory collection & prompts
   ============================================================ */

export type MediaType = "photo" | "video" | "voice";

export type BridgeMemory = {
  id: string;
  title: string;
  type: MediaType;
  description: string;
  tint: string;
  emoji: string;
  // The warm prompt an AI would surface alongside this memory.
  prompt: string;
  // Lowercase terms used to match a caregiver's question.
  keywords: string[];
  // Extra detail shown for video/voice (length, narrator, etc.).
  meta?: string;
};

export const bridgeMemories: BridgeMemory[] = [
  {
    id: "wedding-photo",
    title: "Wedding day",
    type: "photo",
    description: "You and Tom on the church steps, June 1968.",
    tint: "linear-gradient(135deg, #ffe7c9, #ffb98a)",
    emoji: "💛",
    prompt: "Do you remember the white roses you carried that morning?",
    keywords: ["wedding", "tom", "married", "marriage", "husband", "june", "dress"],
  },
  {
    id: "first-dance",
    title: "Your first dance",
    type: "video",
    description: "Tom twirling you across the hall to your favorite song.",
    tint: "linear-gradient(135deg, #ffd9b0, #ff9e6d)",
    emoji: "🎞️",
    prompt: "You and Tom danced until the band went home.",
    keywords: ["wedding", "tom", "dance", "husband", "song", "music"],
    meta: "Video · 0:42",
  },
  {
    id: "sarah-baby",
    title: "Sarah as a baby",
    type: "photo",
    description: "Holding newborn Sarah by the window in spring.",
    tint: "linear-gradient(135deg, #ffe2b8, #f6a96b)",
    emoji: "🌼",
    prompt: "Sarah was born on the first warm day of the year.",
    keywords: ["sarah", "daughter", "baby", "child", "family"],
  },
  {
    id: "sarah-graduation",
    title: "Sarah’s graduation",
    type: "photo",
    description: "Sarah in her cap and gown, beaming beside you.",
    tint: "linear-gradient(135deg, #ffeccf, #ffc187)",
    emoji: "🎓",
    prompt: "You were so proud the day Sarah graduated.",
    keywords: ["sarah", "daughter", "graduation", "college", "family", "proud"],
  },
  {
    id: "sarah-voice",
    title: "A note from Sarah",
    type: "voice",
    description: "“Hi Mum, just thinking of you today. I love you.”",
    tint: "linear-gradient(135deg, #ffd8ad, #ff9f64)",
    emoji: "🎧",
    prompt: "Your daughter Sarah recorded this for you.",
    keywords: ["sarah", "daughter", "voice", "message", "love"],
    meta: "Voice · 0:18",
  },
  {
    id: "garden",
    title: "The garden",
    type: "photo",
    description: "The roses you and Sarah planted three springs ago.",
    tint: "linear-gradient(135deg, #ffe6d2, #f3a86a)",
    emoji: "🌷",
    prompt: "Your roses still bloom every June.",
    keywords: ["garden", "roses", "flowers", "outside", "sarah"],
  },
  {
    id: "family-dinner",
    title: "Sunday dinner",
    type: "photo",
    description: "The whole family gathered around the table.",
    tint: "linear-gradient(135deg, #ffd9b0, #ff9e6d)",
    emoji: "🍽️",
    prompt: "Sundays were always for family and a long, warm meal.",
    keywords: ["dinner", "sunday", "family", "table", "meal", "food"],
  },
  {
    id: "tom-voice",
    title: "Tom reading aloud",
    type: "voice",
    description: "Tom reading the start of your favorite poem.",
    tint: "linear-gradient(135deg, #ffe7c9, #ffb98a)",
    emoji: "🎙️",
    prompt: "Tom loved to read to you in the evenings.",
    keywords: ["tom", "husband", "voice", "poem", "reading", "evening"],
    meta: "Voice · 0:55",
  },
];

export type BridgePrompt = {
  label: string;
  query: string;
};

// Quick-start questions a caregiver can tap instead of typing.
export const suggestedPrompts: BridgePrompt[] = [
  { label: "Show her wedding", query: "show pictures of her wedding" },
  { label: "Tell me about her daughter", query: "tell me about her daughter" },
  { label: "Play Tom’s voice", query: "play tom's voice" },
  { label: "Find the garden", query: "show the garden" },
  { label: "Sunday dinners", query: "find family dinners" },
];

// A memory a family member actually uploads (stored as a data URL).
export type AddedMemory = {
  id: string;
  type: MediaType;
  caption: string;
  src: string;
};

// Sample phrases the simulated voice mode "hears".
export const voiceSamples: string[] = [
  "Show pictures of her wedding",
  "Tell me about her daughter",
  "Play a message from Sarah",
  "Show me the garden",
];

/* ============================================================
   Messages — family messaging & call requests
   ============================================================ */

export type Person = {
  name: string;
  relation: string;
  initial: string;
  tint: string;
};

export type Message = {
  id: string;
  from: Person;
  text: string;
  time: string;
  // Whether a voice recording is available to read the message aloud.
  voice: boolean;
};

export type CallRequest = {
  id: string;
  from: Person;
  // Friendly label for when the family member would like to talk.
  when: string;
  note: string;
};

export type ScheduledCall = {
  id: string;
  with: Person;
  when: string;
  // Reminders the user receives before the call.
  reminders: string[];
};

export type Reminder = {
  id: string;
  text: string;
  kind: "upcoming" | "missed";
};

const sarah: Person = {
  name: "Sarah",
  relation: "Daughter",
  initial: "S",
  tint: "linear-gradient(140deg, #ff9a5c, #d9692e)",
};
const tom: Person = {
  name: "Tom",
  relation: "Husband",
  initial: "T",
  tint: "linear-gradient(140deg, #f6a96b, #e07a36)",
};
const jack: Person = {
  name: "Jack",
  relation: "Grandson",
  initial: "J",
  tint: "linear-gradient(140deg, #ffba7d, #f0843c)",
};

export const messagesData: Message[] = [
  {
    id: "m1",
    from: sarah,
    text: "Morning Mum! The kids drew you a picture today. I’ll call you tonight. Love you.",
    time: "9:12 AM",
    voice: true,
  },
  {
    id: "m2",
    from: tom,
    text: "Thinking of you this morning. Remember our walks down by the river?",
    time: "8:40 AM",
    voice: true,
  },
  {
    id: "m3",
    from: jack,
    text: "Hi Grandma! I scored a goal at football today. Can’t wait to tell you about it.",
    time: "Yesterday",
    voice: false,
  },
];

export const callRequestsData: CallRequest[] = [
  {
    id: "c1",
    from: tom,
    when: "Today · 4:00 PM",
    note: "Would love to catch up before dinner.",
  },
  {
    id: "c2",
    from: jack,
    when: "Tomorrow · 10:00 AM",
    note: "Want to show you my new bike!",
  },
];

export const scheduledCallsData: ScheduledCall[] = [
  {
    id: "s1",
    with: sarah,
    when: "Today · 6:30 PM",
    reminders: ["1 hour before", "15 minutes before"],
  },
];

export const remindersData: Reminder[] = [
  {
    id: "r1",
    text: "You missed your call with Emma. Give her a call when you’re ready.",
    kind: "missed",
  },
];

// Default reminders attached to a newly accepted call request.
export const defaultReminders = ["1 day before", "1 hour before", "15 minutes before"];

/* ============================================================
   Journal — written & voice reflections
   ============================================================ */

export type Mood = {
  id: string;
  label: string;
  emoji: string;
  tint: string;
};

export const moods: Mood[] = [
  { id: "calm", label: "Calm", emoji: "😌", tint: "#cfe8df" },
  { id: "happy", label: "Happy", emoji: "😊", tint: "#ffe6b8" },
  { id: "loved", label: "Loved", emoji: "🥰", tint: "#ffd6c4" },
  { id: "tired", label: "Tired", emoji: "😴", tint: "#dcd7ef" },
  { id: "worried", label: "Worried", emoji: "😟", tint: "#cfe0ef" },
  { id: "low", label: "Low", emoji: "😔", tint: "#d7dde6" },
];

export type JournalEntry = {
  id: string;
  date: string;
  time: string;
  moodId: string;
  kind: "text" | "voice";
  text?: string;
  duration?: string;
  src?: string;
};

export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    date: "Today",
    time: "9:30 AM",
    moodId: "loved",
    kind: "text",
    text: "Sarah called this morning and the children sent a drawing. It made me feel close to everyone, even from far away.",
  },
  {
    id: "j2",
    date: "Yesterday",
    time: "7:15 PM",
    moodId: "calm",
    kind: "text",
    text: "A calm evening. The garden looked lovely in the last of the light.",
  },
  {
    id: "j3",
    date: "Monday",
    time: "3:00 PM",
    moodId: "tired",
    kind: "text",
    text: "A quiet afternoon. I rested with some music and felt a little tired, but peaceful.",
  },
];

/* ============================================================
   Calendar — reminders across the day
   ============================================================ */

export type EventKind =
  | "medication"
  | "appointment"
  | "call"
  | "meal"
  | "hydration";

export type CalendarEvent = {
  id: string;
  time: string;
  title: string;
  detail?: string;
  kind: EventKind;
  done: boolean;
};

export const eventKindMeta: Record<
  EventKind,
  { label: string; icon: IconName }
> = {
  medication: { label: "Medication", icon: "pill" },
  appointment: { label: "Appointment", icon: "heart" },
  call: { label: "Call", icon: "phone" },
  meal: { label: "Meal", icon: "bowl" },
  hydration: { label: "Hydration", icon: "droplet" },
};

export type WeekDay = {
  label: string;
  name: string;
  date: number;
  today: boolean;
};

export const weekDays: WeekDay[] = [
  { label: "M", name: "Monday", date: 8, today: false },
  { label: "T", name: "Tuesday", date: 9, today: true },
  { label: "W", name: "Wednesday", date: 10, today: false },
  { label: "T", name: "Thursday", date: 11, today: false },
  { label: "F", name: "Friday", date: 12, today: false },
  { label: "S", name: "Saturday", date: 13, today: false },
  { label: "S", name: "Sunday", date: 14, today: false },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", time: "7:30 AM", title: "Glass of water", kind: "hydration", done: true },
  { id: "e2", time: "8:00 AM", title: "Breakfast", detail: "Oatmeal & coffee", kind: "meal", done: true },
  {
    id: "e3",
    time: "8:30 AM",
    title: "Morning medication",
    detail: "Donepezil · 1 tablet",
    kind: "medication",
    done: true,
  },
  { id: "e4", time: "10:00 AM", title: "Glass of water", kind: "hydration", done: false },
  {
    id: "e5",
    time: "11:00 AM",
    title: "Dr. Patel check-up",
    detail: "Bring the blue folder",
    kind: "appointment",
    done: false,
  },
  { id: "e6", time: "12:30 PM", title: "Lunch", detail: "Soup & sandwich", kind: "meal", done: false },
  { id: "e7", time: "1:30 PM", title: "Glass of water", kind: "hydration", done: false },
  { id: "e8", time: "4:00 PM", title: "Call with Tom", detail: "Your husband", kind: "call", done: false },
  { id: "e9", time: "6:00 PM", title: "Dinner", detail: "Family meal", kind: "meal", done: false },
  { id: "e10", time: "6:30 PM", title: "Call with Sarah", detail: "Your daughter", kind: "call", done: false },
  {
    id: "e11",
    time: "8:00 PM",
    title: "Evening medication",
    detail: "Memantine · 1 tablet",
    kind: "medication",
    done: false,
  },
];

// The recurring daily routine, reused to build each day's schedule.
function dayRoutine(prefix: string, extras: Omit<CalendarEvent, "id" | "done">[]): CalendarEvent[] {
  const base: Omit<CalendarEvent, "id" | "done">[] = [
    { time: "8:00 AM", title: "Breakfast", detail: "Oatmeal & coffee", kind: "meal" },
    { time: "8:30 AM", title: "Morning medication", detail: "Donepezil · 1 tablet", kind: "medication" },
    { time: "10:00 AM", title: "Glass of water", kind: "hydration" },
    { time: "12:30 PM", title: "Lunch", kind: "meal" },
    ...extras,
    { time: "1:30 PM", title: "Glass of water", kind: "hydration" },
    { time: "6:00 PM", title: "Dinner", detail: "Family meal", kind: "meal" },
    { time: "8:00 PM", title: "Evening medication", detail: "Memantine · 1 tablet", kind: "medication" },
  ];
  // Keep the day sorted by time of day.
  const order = (t: string) => {
    const [hm, ap] = t.split(" ");
    let [h, m] = hm.split(":").map(Number);
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  return base
    .sort((a, b) => order(a.time) - order(b.time))
    .map((e, i) => ({ id: `${prefix}-${i}`, done: false, ...e }));
}

// Each day of the week has its own schedule. Today (Tuesday, the 9th) keeps the
// detailed list above; other days are built from the routine plus a highlight.
export const eventsByDay: Record<number, CalendarEvent[]> = {
  8: dayRoutine("mon", [{ time: "2:00 PM", title: "Hair appointment", detail: "With Mai", kind: "appointment" }]),
  9: calendarEvents,
  10: dayRoutine("wed", [{ time: "4:00 PM", title: "Call with Jack", detail: "Your grandson", kind: "call" }]),
  11: dayRoutine("thu", [{ time: "11:00 AM", title: "Physiotherapy visit", detail: "Gentle exercises", kind: "appointment" }]),
  12: dayRoutine("fri", [{ time: "6:30 PM", title: "Call with Sarah", detail: "Your daughter", kind: "call" }]),
  13: dayRoutine("sat", [{ time: "3:00 PM", title: "Family visit", detail: "Sarah & the children", kind: "appointment" }]),
  14: dayRoutine("sun", [{ time: "5:00 PM", title: "Sunday dinner", detail: "The whole family", kind: "meal" }]),
};

/* ============================================================
   RemindMe — spoken reminders with family escalation
   ============================================================ */

export type RemindTask = {
  id: string;
  time: string;
  title: string;
  detail?: string;
  kind: EventKind;
  done: boolean;
  // Times this task has been missed; family is alerted when repeated.
  missed: number;
};

// Family is notified once a task has been missed this many times.
export const MISS_THRESHOLD = 2;

export const remindTasks: RemindTask[] = [
  { id: "rm1", time: "8:30 AM", title: "Morning medication", detail: "Donepezil · 1 tablet", kind: "medication", done: true, missed: 0 },
  { id: "rm2", time: "10:00 AM", title: "Drink a glass of water", kind: "hydration", done: false, missed: 0 },
  { id: "rm3", time: "11:00 AM", title: "Dr. Patel check-up", detail: "Bring the blue folder", kind: "appointment", done: false, missed: 0 },
  { id: "rm4", time: "12:30 PM", title: "Lunch", detail: "Soup & sandwich", kind: "meal", done: false, missed: 0 },
  { id: "rm5", time: "2:00 PM", title: "Afternoon medication", detail: "Memantine · 1 tablet", kind: "medication", done: false, missed: 2 },
];

/* ============================================================
   Memory Map — meaningful places
   ============================================================ */

export type MapPlace = {
  id: string;
  title: string;
  icon: IconName;
  // Position on the stylised map, in percentages.
  x: number;
  y: number;
  story: string;
  audio?: string;
};

export const mapPlaces: MapPlace[] = [
  {
    id: "p-home",
    title: "Home",
    icon: "home",
    x: 54,
    y: 62,
    story: "Where you live now, with your favourite chair by the window and the kettle always warm.",
  },
  {
    id: "p-church",
    title: "St. Mary’s Church",
    icon: "building",
    x: 28,
    y: 30,
    story: "You and Tom were married here on a bright June morning in 1968.",
    audio: "0:40",
  },
  {
    id: "p-garden",
    title: "The Garden",
    icon: "leaf",
    x: 74,
    y: 40,
    story: "You planted roses here with Sarah three springs ago. They still bloom every June.",
  },
  {
    id: "p-river",
    title: "Riverside Walk",
    icon: "droplet",
    x: 22,
    y: 70,
    story: "Sunday walks along the water with Tom, stopping for tea at the little café.",
    audio: "0:25",
  },
  {
    id: "p-childhood",
    title: "Childhood Home",
    icon: "home",
    x: 46,
    y: 18,
    story: "The house where you grew up, always full of the smell of your mother’s baking.",
  },
];

/* ============================================================
   CareCircle — shared family care log
   ============================================================ */

export type CareMember = {
  name: string;
  role: string;
  initial: string;
  tint: string;
  onDuty?: boolean;
};

export const careCircle: CareMember[] = [
  { name: "Sarah", role: "Primary caregiver", initial: "S", tint: "linear-gradient(140deg, #ff9a5c, #d9692e)", onDuty: true },
  { name: "Tom", role: "Husband", initial: "T", tint: "linear-gradient(140deg, #f6a96b, #e07a36)" },
  { name: "Jack", role: "Grandson", initial: "J", tint: "linear-gradient(140deg, #ffba7d, #f0843c)" },
  { name: "Dr. Patel", role: "GP", initial: "P", tint: "linear-gradient(140deg, #7fc7b6, #2f9385)" },
];

export type CareCategory = "mood" | "behavior" | "activity";

export type CareNote = {
  id: string;
  author: string;
  initial: string;
  tint: string;
  time: string;
  category: CareCategory;
  text: string;
};

export const careLog: CareNote[] = [
  { id: "n1", author: "Sarah", initial: "S", tint: "linear-gradient(140deg, #ff9a5c, #d9692e)", time: "9:15 AM", category: "mood", text: "Woke up cheerful and enjoyed coffee on the porch." },
  { id: "n2", author: "Tom", initial: "T", tint: "linear-gradient(140deg, #f6a96b, #e07a36)", time: "11:40 AM", category: "activity", text: "We did the crossword together. She remembered several answers." },
  { id: "n3", author: "Sarah", initial: "S", tint: "linear-gradient(140deg, #ff9a5c, #d9692e)", time: "1:00 PM", category: "behavior", text: "A little restless after lunch; settled once the music came on." },
];

export const medAdherence = { taken: 2, total: 3 };
export const nextAppointment = "Dr. Patel · Tuesday 11:00 AM";

/* ============================================================
   StoryKeeper — guided story archive
   ============================================================ */

export type StoryTopic = {
  id: string;
  label: string;
  icon: IconName;
  questions: string[];
};

export const storyTopics: StoryTopic[] = [
  { id: "childhood", label: "Childhood", icon: "star", questions: ["Tell me about your childhood.", "What games did you play?"] },
  { id: "love", label: "Love & Marriage", icon: "heart", questions: ["How did you meet your spouse?", "What was your wedding like?"] },
  { id: "work", label: "Work", icon: "briefcase", questions: ["What was your first job?", "What work were you proudest of?"] },
  { id: "family", label: "Family", icon: "users", questions: ["Tell me about your children.", "What were Sundays like?"] },
  { id: "travel", label: "Travel", icon: "plane", questions: ["Where did you love to travel?", "What was your favourite trip?"] },
];

export type Story = {
  id: string;
  topicId: string;
  question: string;
  kind: "voice" | "text";
  text?: string;
  duration?: string;
  date: string;
  src?: string;
};

export const stories: Story[] = [
  { id: "st1", topicId: "childhood", question: "Tell me about your childhood.", kind: "voice", duration: "1:12", date: "Mon" },
  { id: "st2", topicId: "love", question: "How did you meet your spouse?", kind: "text", text: "I met Tom at a dance hall in 1965. He stepped on my foot twice and apologised for an hour. We were inseparable after that.", date: "Sun" },
  { id: "st3", topicId: "work", question: "What was your first job?", kind: "voice", duration: "0:48", date: "Last week" },
];

/* ============================================================
   SafePath — wandering safety (not a medical device)
   ============================================================ */

export type SafeContact = {
  name: string;
  relation: string;
  initial: string;
  tint: string;
  phone: string;
};

export const safeContacts: SafeContact[] = [
  { name: "Sarah", relation: "Daughter", initial: "S", tint: "linear-gradient(140deg, #ff9a5c, #d9692e)", phone: "07700 900123" },
  { name: "Tom", relation: "Husband", initial: "T", tint: "linear-gradient(140deg, #f6a96b, #e07a36)", phone: "07700 900456" },
  { name: "Emergency services", relation: "999", initial: "+", tint: "linear-gradient(140deg, #e2702e, #c0461f)", phone: "999" },
];

export type SafeRoute = {
  id: string;
  label: string;
  detail: string;
};

export const safeRoutes: SafeRoute[] = [
  { id: "sr1", label: "Home → Garden → Home", detail: "A familiar 10-minute loop" },
  { id: "sr2", label: "Home → Corner shop → Home", detail: "Quiet, well-lit streets" },
];

/* ============================================================
   Companion Mode — "Who is this?" voice answers
   ============================================================ */

export type CompanionPerson = {
  id: string;
  name: string;
  relation: string;
  emoji: string;
  tint: string;
  // A short, comforting reminder of who they are.
  description: string;
  // How you know / where you met them.
  met: string;
};

export const companionPeople: CompanionPerson[] = [
  {
    id: "sarah",
    name: "Sarah",
    relation: "Your daughter",
    emoji: "🧡",
    tint: "linear-gradient(140deg, #ffd9b0, #ff9e6d)",
    description:
      "Sarah is your daughter. She visits often, takes good care of you, and you are very close.",
    met: "Sarah is your daughter. You have loved her since the day she was born in spring.",
  },
  {
    id: "tom",
    name: "Tom",
    relation: "Your husband",
    emoji: "💛",
    tint: "linear-gradient(140deg, #ffe2b8, #f6a96b)",
    description:
      "Tom is your husband. You have shared your life together for over fifty years.",
    met: "You met Tom at a dance hall in 1965, and married on a bright June morning in 1968.",
  },
  {
    id: "jack",
    name: "Jack",
    relation: "Your grandson",
    emoji: "⚽",
    tint: "linear-gradient(140deg, #ffba7d, #f0843c)",
    description:
      "Jack is your grandson, Sarah’s boy. He loves football and always makes you laugh.",
    met: "Jack is Sarah’s son, your grandson. You first held him the day he was born.",
  },
];

export type CompanionFacet = "identity" | "met" | "about";

export type CompanionQuestion = {
  label: string;
  facet: CompanionFacet;
};

export const companionQuestions: CompanionQuestion[] = [
  { label: "Who is this person?", facet: "identity" },
  { label: "Where did I meet them?", facet: "met" },
  { label: "Tell me about them", facet: "about" },
];

// Phrases the simulated voice listener "hears".
export const companionVoiceSamples: { phrase: string; facet: CompanionFacet }[] = [
  { phrase: "Who is this person?", facet: "identity" },
  { phrase: "Where did I meet them?", facet: "met" },
  { phrase: "Tell me about them", facet: "about" },
];

/* ============================================================
   Daily Anchor — gentle, plain-language routine reminders
   ============================================================ */

export type DailyAnchorItem = {
  id: string;
  time: string;
  message: string;
  icon: IconName;
  // Highlighted as something special about today.
  special?: boolean;
};

export const dailyAnchors: DailyAnchorItem[] = [
  { id: "d1", time: "Morning", message: "Good morning. It’s breakfast time.", icon: "sunrise" },
  { id: "d2", time: "8:30 AM", message: "It’s time to take your medication.", icon: "pill" },
  { id: "d3", time: "Today", message: "Sarah, your daughter, is visiting today.", icon: "heart", special: true },
  { id: "d4", time: "Midday", message: "It’s lunch time. Something warm to eat.", icon: "bowl" },
  { id: "d5", time: "Afternoon", message: "Take a moment for a glass of water.", icon: "droplet" },
  { id: "d6", time: "Evening", message: "Tonight you’ll have dinner with family.", icon: "moon" },
];

/* ============================================================
   Memory Book — friends & family contribute memories
   ============================================================ */

export type SharedMemory = {
  id: string;
  title: string;
  description: string;
  day: string;
  month: string;
  year: string;
  locations: string[];
  people: string[];
  by: string;
  connection: string;
};

export const monthOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ============================================================
   Reality Support Layer — reactive reorientation
   ============================================================ */

export type RealityStep = {
  id: string;
  eyebrow: string;
  headline: string;
  detail: string;
  icon: IconName;
  tint: string;
  // The line spoken aloud (the calming voice explanation).
  voice: string;
  // The first step shows the breathing orb instead of an icon.
  breath?: boolean;
};

export const realitySteps: RealityStep[] = [
  {
    id: "safe",
    eyebrow: "Right now",
    headline: "You are safe.",
    detail: "Take a slow breath with me. Everything is okay.",
    icon: "heart",
    tint: "#f4ece2",
    voice: "You are safe. Take a slow breath with me. Everything is okay.",
    breath: true,
  },
  {
    id: "place",
    eyebrow: "Where you are",
    headline: "You are at home.",
    detail: "In your living room, in your favourite chair by the window.",
    icon: "home",
    tint: "#f4ece2",
    voice: "You are at home, in your living room, in your favourite chair by the window.",
  },
  {
    id: "person",
    eyebrow: "Who is with you",
    headline: "Sarah is here with you.",
    detail: "Sarah is your daughter. She loves you very much.",
    icon: "users",
    tint: "#f4ece2",
    voice: "Sarah is here with you. Sarah is your daughter, and she loves you very much.",
  },
  {
    id: "time",
    eyebrow: "The time",
    headline: "It’s Tuesday morning.",
    detail: "A quiet morning, time for a warm cup of coffee.",
    icon: "coffee",
    tint: "#f4ece2",
    voice: "It is Tuesday morning. A quiet morning, time for a warm cup of coffee.",
  },
  {
    id: "today",
    eyebrow: "Later today",
    headline: "Your daughter is visiting.",
    detail: "Something gentle to look forward to this afternoon.",
    icon: "calendar",
    tint: "#f4ece2",
    voice: "Later today, your daughter is coming to visit. Something to look forward to.",
  },
  {
    id: "close",
    eyebrow: "Remember",
    headline: "Everything is okay.",
    detail: "You are home, you are safe, and you are loved.",
    icon: "sunrise",
    tint: "#f4ece2",
    voice: "Everything is okay. You are home, you are safe, and you are loved.",
  },
];

export type RealityQuestion = {
  label: string;
  stepId: string;
};

export const realityQuestions: RealityQuestion[] = [
  { label: "Where am I?", stepId: "place" },
  { label: "Who is with me?", stepId: "person" },
  { label: "What time is it?", stepId: "time" },
  { label: "What’s happening today?", stepId: "today" },
];
