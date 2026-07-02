import { useEffect } from "react";
import { useSession } from "../state/SessionContext";
import { audioEngine } from "../audio/engine";
import { SONG_BY_ID } from "../data/songs";

/**
 * Bridges app state -> the generative audio engine.
 * Plays the current track's pad while playing; pauses otherwise.
 */
export function AudioController() {
  const { state } = useSession();
  const currentId = state.queue[state.currentIndex];
  const sessionActive = state.stage === "browse";

  useEffect(() => {
    if (!sessionActive || !currentId) {
      audioEngine.pause();
      return;
    }
    const song = SONG_BY_ID[currentId];
    if (!song) return;
    if (state.isPlaying) {
      audioEngine.play({ root: song.root, chord: song.chord });
    } else {
      audioEngine.pause();
    }
  }, [currentId, state.isPlaying, sessionActive]);

  return null;
}
