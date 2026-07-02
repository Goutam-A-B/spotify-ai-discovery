import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSession } from "./SessionContext";
import { SONG_BY_ID } from "../data/songs";

interface PlaybackCtx {
  progress: number; // seconds into current track
  duration: number; // seconds
  seek: (seconds: number) => void;
}

const Ctx = createContext<PlaybackCtx | null>(null);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useSession();
  const [progress, setProgress] = useState(0);
  const last = useRef<number>(0);
  const progressRef = useRef(0);
  const advancing = useRef(false);

  const currentId = state.queue[state.currentIndex];
  const duration = currentId ? SONG_BY_ID[currentId]?.duration ?? 200 : 200;

  // reset the clock whenever the track changes
  useEffect(() => {
    progressRef.current = 0;
    advancing.current = false;
    setProgress(0);
    last.current = performance.now();
  }, [currentId]);

  // run the clock while playing on the player
  useEffect(() => {
    if (!state.isPlaying || state.stage !== "browse") return;
    last.current = performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = (now - last.current) / 1000;
      last.current = now;
      const next = progressRef.current + dt;
      if (next >= duration) {
        // auto-advance to the next recommendation (guard against double-fire)
        if (!advancing.current) {
          advancing.current = true;
          dispatch({ type: "NEXT" });
        }
        return; // stop scheduling; the track-change effect restarts the clock
      }
      progressRef.current = next;
      setProgress(next);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [state.isPlaying, state.stage, duration, dispatch]);

  const seek = (seconds: number) => {
    const v = Math.max(0, Math.min(duration, seconds));
    progressRef.current = v;
    setProgress(v);
  };

  return <Ctx.Provider value={{ progress, duration, seek }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayback(): PlaybackCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayback must be used within PlaybackProvider");
  return ctx;
}
