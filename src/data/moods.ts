export interface Mood {
  id: string;
  label: string;
  emoji: string;
  /** 0 (calm) .. 1 (high energy) — feeds the fake AI "energy" input */
  energy: number;
  /** language the mood leans toward, used by the rule engine */
  languageHint?: string;
  /** gradient used for the chip + session header */
  accent: [string, string];
  /** short line shown while "AI" builds the session */
  vibe: string;
}

/**
 * The suggested prompt chips on the Discover landing page.
 * These map to `Song.moods[]` ids in the catalog.
 */
export const MOODS: Mood[] = [
  {
    id: "late-night-coding",
    label: "Late-night coding",
    emoji: "💻",
    energy: 0.35,
    accent: ["#3b2f63", "#1b1636"],
    vibe: "Low-key focus with just enough pulse to stay in flow.",
  },
  {
    id: "monsoon-drive",
    label: "Monsoon drive",
    emoji: "🌧️",
    energy: 0.45,
    languageHint: "Hindi",
    accent: ["#1f4f66", "#122a3a"],
    vibe: "Windshield wipers, warm vocals, headlights on wet roads.",
  },
  {
    id: "heartbreak",
    label: "Heartbreak",
    emoji: "💔",
    energy: 0.3,
    accent: ["#5a2233", "#2a1420"],
    vibe: "The good kind of sad. Slow, aching, honest.",
  },
  {
    id: "gym",
    label: "Gym",
    emoji: "🔥",
    energy: 0.9,
    accent: ["#7a2d12", "#3a1408"],
    vibe: "High tempo, big drops, no skips.",
  },
  {
    id: "tamil-feel-good",
    label: "Tamil feel-good",
    emoji: "🎵",
    energy: 0.65,
    languageHint: "Tamil",
    accent: ["#155e52", "#0c2f2a"],
    vibe: "Sunny melodies and that Kollywood bounce.",
  },
  {
    id: "study-focus",
    label: "Study focus",
    emoji: "📚",
    energy: 0.25,
    accent: ["#2f3a52", "#171d2c"],
    vibe: "Quiet, textured, distraction-free.",
  },
  {
    id: "happy-vibes",
    label: "Happy vibes",
    emoji: "☀️",
    energy: 0.8,
    accent: ["#8a6a12", "#3d2f08"],
    vibe: "Bright, bouncy, windows-down energy.",
  },
  {
    id: "nostalgia",
    label: "2010s nostalgia",
    emoji: "📼",
    energy: 0.55,
    accent: ["#4a2c66", "#241533"],
    vibe: "The songs that raised you. Bittersweet and warm.",
  },
];

export const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m]));
