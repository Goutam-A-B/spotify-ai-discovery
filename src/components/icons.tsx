/** Minimal inline SVG icons in the Spotify visual language. */
import type { CSSProperties } from "react";

type P = { size?: number; className?: string; style?: CSSProperties };

const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24" });

export const HomeIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M12 3.1 3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10z" />
  </svg>
);

export const SearchIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = ({ size = 24, className, style }: P) => (
  <svg {...base(size)} className={className} style={style} fill="currentColor" aria-hidden>
    <path d="M12 2c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6z" />
    <path d="M19 13c.2 1.9 1 2.7 2.9 2.9-1.9.2-2.7 1-2.9 2.9-.2-1.9-1-2.7-2.9-2.9 1.9-.2 2.7-1 2.9-2.9z" />
  </svg>
);

export const LibraryIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <rect x="3" y="3" width="3.4" height="18" rx="1" />
    <rect x="8" y="3" width="3.4" height="18" rx="1" />
    <path d="M15.5 4.2 18.8 3l3 15.6-3.3 1z" />
  </svg>
);

export const PlusIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const PlayIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5z" />
  </svg>
);

export const PauseIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export const NextIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M5 5.5v13a1 1 0 0 0 1.5.87L15 14v4.5a1 1 0 0 0 2 0v-13a1 1 0 0 0-2 0V10L6.5 4.63A1 1 0 0 0 5 5.5z" />
  </svg>
);

export const PrevIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M19 5.5v13a1 1 0 0 1-1.5.87L9 14v4.5a1 1 0 0 1-2 0v-13a1 1 0 0 1 2 0V10l8.5-5.37A1 1 0 0 1 19 5.5z" />
  </svg>
);

export const HeartIcon = ({ size = 24, className, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} aria-hidden>
    <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z" strokeLinejoin="round" />
  </svg>
);

export const ThumbDownIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
    <path d="M7 3v10l4 7a2 2 0 0 0 2-2v-4h5.2a2 2 0 0 0 2-2.4l-1.2-6A2 2 0 0 0 17 3z" />
    <path d="M7 3H4v10h3" />
  </svg>
);

export const SkipForwardIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4v16l10-8z" fill="currentColor" stroke="none" />
    <path d="M19 5v14" />
  </svg>
);

export const CheckIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m4 12 5 5L20 6" />
  </svg>
);

export const MicIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <rect x="9" y="2.5" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <path d="M12 18v3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const BackIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 5 8 12l7 7" />
  </svg>
);

export const CloseIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const QueueIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
    <path d="M4 7h11M4 12h11M4 17h7" />
    <path d="M18 9v8" />
    <circle cx="16" cy="17" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const ShuffleIcon = ({ size = 24, className }: P) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 4h4l10 16h4" />
    <path d="M17 4h4v4M3 20h4l3-4.8" />
    <path d="M21 16v4h-4" />
  </svg>
);

export const VolumeIcon = ({ size = 24, className, muted }: P & { muted?: boolean }) => (
  <svg {...base(size)} className={className} fill="currentColor" aria-hidden>
    <path d="M4 9v6h4l5 4V5L8 9z" />
    {muted ? (
      <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    ) : (
      <path d="M16 8a5 5 0 0 1 0 8M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    )}
  </svg>
);
