import { useEffect, useState } from "react";

/** The iOS/Android-style status bar at the top of the phone frame. */
export function StatusBar() {
  const [time, setTime] = useState(() => clock());
  useEffect(() => {
    const t = window.setInterval(() => setTime(clock()), 20000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="statusbar">
      <span className="statusbar__time">{time}</span>
      <div className="statusbar__icons">
        <SignalIcon />
        <WifiIcon />
        <span className="statusbar__battery">
          <span className="statusbar__battery-level" />
        </span>
      </div>
    </div>
  );
}

function clock(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  h = h % 12 || 12;
  return `${h}:${m}`;
}

const SignalIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="white" aria-hidden>
    <rect x="0" y="9" width="3" height="5" rx="1" />
    <rect x="5" y="6" width="3" height="8" rx="1" />
    <rect x="10" y="3" width="3" height="11" rx="1" />
    <rect x="15" y="0" width="3" height="14" rx="1" opacity="0.4" />
  </svg>
);

const WifiIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="white" aria-hidden>
    <path d="M9 11.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
    <path d="M9 6.2c2 0 3.9.8 5.3 2.1l-1.6 1.6A5 5 0 0 0 9 8.5a5 5 0 0 0-3.7 1.4L3.7 8.3A7.5 7.5 0 0 1 9 6.2z" />
    <path d="M9 1.6c3.3 0 6.3 1.3 8.5 3.5l-1.6 1.6A9.6 9.6 0 0 0 9 3.9 9.6 9.6 0 0 0 2.1 6.7L.5 5.1A11.9 11.9 0 0 1 9 1.6z" />
  </svg>
);
