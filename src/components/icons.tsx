/** Spotify-accurate inline SVG icons. Stroke icons use 24px grid. */
import type { CSSProperties } from "react";

type P = { size?: number; className?: string; style?: CSSProperties };
const box = (s: number) => ({ width: s, height: s, viewBox: "0 0 24 24" });

/* ---------- bottom nav ---------- */
export const HomeIcon = ({ size = 24, className, filled }: P & { filled?: boolean }) =>
  filled ? (
    <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
      <path d="M12 3 3 10.2V21h6v-6h6v6h6V10.2z" />
    </svg>
  ) : (
    <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );

export const SearchIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const LibraryIcon = ({ size = 24, className, filled }: P & { filled?: boolean }) => (
  <svg {...box(size)} className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4v16M10 4v16" />
    <path d="m15.5 6 4 13" strokeLinecap="butt" />
  </svg>
);

export const CreateIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

/* ---------- the AI Discover sparkle ---------- */
export const SparkleIcon = ({ size = 24, className, style }: P) => (
  <svg {...box(size)} className={className} style={style} fill="currentColor" aria-hidden>
    <path d="M11.5 2.6c.6 4.6 2.3 6.3 6.9 6.9-4.6.6-6.3 2.3-6.9 6.9-.6-4.6-2.3-6.3-6.9-6.9 4.6-.6 6.3-2.3 6.9-6.9z" />
    <path d="M18.5 14c.3 2.2 1.1 3 3.3 3.3-2.2.3-3 1.1-3.3 3.3-.3-2.2-1.1-3-3.3-3.3 2.2-.3 3-1.1 3.3-3.3z" />
  </svg>
);

/** "More like this" — sparkle with a plus */
export const SparklePlusIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M9.5 3c.5 3.9 2 5.4 5.9 5.9-3.9.5-5.4 2-5.9 5.9-.5-3.9-2-5.4-5.9-5.9C7.5 8.4 9 6.9 9.5 3z" />
    <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 14v6M15 17h6" />
    </g>
  </svg>
);

/* ---------- transport ---------- */
export const PlayIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
  </svg>
);
export const PauseIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <rect x="6.5" y="4.5" width="4" height="15" rx="1.2" />
    <rect x="13.5" y="4.5" width="4" height="15" rx="1.2" />
  </svg>
);
export const NextIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M5 5.3v13.4a1 1 0 0 0 1.53.85L16 13.7v4.8a1 1 0 0 0 2 0V5.5a1 1 0 0 0-2 0v4.8L6.53 4.45A1 1 0 0 0 5 5.3z" />
  </svg>
);
export const PrevIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M19 5.3v13.4a1 1 0 0 1-1.53.85L8 13.7v4.8a1 1 0 0 1-2 0V5.5a1 1 0 0 1 2 0v4.8l9.47-5.85A1 1 0 0 1 19 5.3z" />
  </svg>
);
export const SkipIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M6 5.3v13.4a1 1 0 0 0 1.53.85L17 13.7v4.8a1 1 0 0 0 2 0V5.5a1 1 0 0 0-2 0v4.8L7.53 4.45A1 1 0 0 0 6 5.3z" />
  </svg>
);

/* ---------- feedback ---------- */
export const HeartIcon = ({ size = 24, className, filled }: P & { filled?: boolean }) => (
  <svg {...box(size)} className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} aria-hidden>
    <path d="M12 20.5 4.3 12.9a4.8 4.8 0 0 1 6.7-6.87l1 .98 1-.98a4.8 4.8 0 0 1 6.7 6.87z" strokeLinejoin="round" />
  </svg>
);
export const ThumbDownIcon = ({ size = 24, className, filled }: P & { filled?: boolean }) => (
  <svg {...box(size)} className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
    <path d="M13.5 3H8.2a3 3 0 0 0-2.95 2.46l-1 5.4A2.5 2.5 0 0 0 6.7 14H11l-.7 3.3a2 2 0 0 0 3.6 1.5L18 13.5V3z" />
    <path d="M18 3h1.6a1.4 1.4 0 0 1 1.4 1.4v6.7a1.4 1.4 0 0 1-1.4 1.4H18" />
  </svg>
);

/* ---------- header ---------- */
export const GearIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.3 7.5l2 1.2M17.7 15.3l2 1.2M4.3 16.5l2-1.2M17.7 8.7l2-1.2" />
  </svg>
);
export const ClockIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

/* ---------- misc ---------- */
export const PlusIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MicIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <rect x="9" y="2.5" width="6" height="12" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path d="M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
export const CloseIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const BackIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 5 8 12l7 7" />
  </svg>
);
export const ChevronRightIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const MoreIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <circle cx="5" cy="12" r="1.9" />
    <circle cx="12" cy="12" r="1.9" />
    <circle cx="19" cy="12" r="1.9" />
  </svg>
);
export const CheckIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12 5 5L20 6.5" />
  </svg>
);
export const CastIcon = ({ size = 24, className }: P) => (
  <svg {...box(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="4.5" width="16" height="12" rx="2" />
    <circle cx="12" cy="10.5" r="2.4" fill="currentColor" stroke="none" />
    <path d="M9 20h6" />
  </svg>
);
export const VolumeIcon = ({ size = 24, className, muted }: P & { muted?: boolean }) => (
  <svg {...box(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M4 9v6h4l5 4V5L8 9z" />
    {muted ? (
      <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    ) : (
      <path d="M16 8a5 5 0 0 1 0 8M18.6 5.6a8.5 8.5 0 0 1 0 12.8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    )}
  </svg>
);

/** Animated equalizer bars — the green "Discover Session" indicator */
export const SoundBars = ({ size = 16, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={"eq " + (className ?? "")} fill="currentColor" aria-hidden>
    <rect className="eq__b eq__b1" x="1" y="5" width="2.6" height="6" rx="1" />
    <rect className="eq__b eq__b2" x="5.4" y="2" width="2.6" height="12" rx="1" />
    <rect className="eq__b eq__b3" x="9.8" y="4" width="2.6" height="8" rx="1" />
    <rect className="eq__b eq__b1" x="13.4" y="6" width="2.6" height="4" rx="1" />
  </svg>
);
