import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSession } from "./SessionContext";
import { SONG_BY_ID } from "../data/songs";
import { useMedia } from "../lib/useMedia";
import { previewPlayer } from "../audio/player";
import { audioEngine } from "../audio/engine";

interface PlaybackCtx {
  progress: number;
  duration: number;
  seek: (seconds: number) => void;
}

const Ctx = createContext<PlaybackCtx | null>(null);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useSession();
  const currentId = state.queue[state.currentIndex];
  const song = currentId ? SONG_BY_ID[currentId] : null;
  const media = useMedia(song);
  const preview = media?.preview ?? null;
  const sessionActive = state.stage === "browse";

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(song?.duration ?? 30);
  const progressRef = useRef(0);
  const advancing = useRef(false);
  const last = useRef(0);

  // reset the clock when the track (or its audio source) changes
  useEffect(() => {
    progressRef.current = 0;
    advancing.current = false;
    setProgress(0);
    setDuration(preview ? 30 : song?.duration ?? 30);
  }, [currentId, preview, song]);

  // route playback to the real preview when available, else the synth bed
  useEffect(() => {
    if (!sessionActive || !song) {
      previewPlayer.pause();
      audioEngine.pause();
      return;
    }
    if (preview) {
      audioEngine.pause();
      previewPlayer.load(preview);
      if (state.isPlaying) previewPlayer.play();
      else previewPlayer.pause();
    } else {
      previewPlayer.pause();
      if (state.isPlaying) audioEngine.play({ root: song.root, chord: song.chord });
      else audioEngine.pause();
    }
  }, [currentId, preview, state.isPlaying, sessionActive, song]);

  // progress + auto-advance
  useEffect(() => {
    if (!sessionActive || !song) return;

    const advance = () => {
      if (advancing.current) return;
      advancing.current = true;
      dispatch({ type: "NEXT" });
    };

    if (preview) {
      const el = previewPlayer.el;
      const onTime = () => {
        progressRef.current = el.currentTime;
        setProgress(el.currentTime);
      };
      const onMeta = () => {
        if (el.duration && isFinite(el.duration)) setDuration(el.duration);
      };
      el.addEventListener("timeupdate", onTime);
      el.addEventListener("loadedmetadata", onMeta);
      el.addEventListener("ended", advance);
      if (el.duration && isFinite(el.duration)) setDuration(el.duration);
      return () => {
        el.removeEventListener("timeupdate", onTime);
        el.removeEventListener("loadedmetadata", onMeta);
        el.removeEventListener("ended", advance);
      };
    }

    // synth fallback: rAF timer against the nominal duration
    if (!state.isPlaying) return;
    last.current = performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = (now - last.current) / 1000;
      last.current = now;
      const next = progressRef.current + dt;
      if (next >= (song.duration ?? 30)) {
        advance();
        return;
      }
      progressRef.current = next;
      setProgress(next);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [currentId, preview, state.isPlaying, sessionActive, song, dispatch]);

  const seek = (seconds: number) => {
    const v = Math.max(0, Math.min(duration, seconds));
    progressRef.current = v;
    setProgress(v);
    if (preview) previewPlayer.seek(v);
  };

  return <Ctx.Provider value={{ progress, duration, seek }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayback(): PlaybackCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayback must be used within PlaybackProvider");
  return ctx;
}
