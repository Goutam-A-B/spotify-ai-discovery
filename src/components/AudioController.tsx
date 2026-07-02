import { useEffect } from "react";
import { useSession } from "../state/SessionContext";
import { audioEngine } from "../audio/engine";
import { SONG_BY_ID } from "../data/songs";

/**
 * Bridges app state -> the generative audio engine.
 * Loads a new pad when the track changes and honours play/pause.
 */
export function AudioController() {
  const { state } = useSession();
  const currentId = state.queue[state.currentIndex];
  const sessionActive = state.stage === "player";

  // load + play a new chord when the track changes
  useEffect(() => {
    if (!sessionActive || !currentId) return;
    const song = SONG_BY_ID[currentId];
    if (!song) return;
    if (state.isPlaying) {
      audioEngine.play({ root: song.root, chord: song.chord });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, sessionActive]);

  // honour play/pause for the current track
  useEffect(() => {
    if (!sessionActive || !currentId) return;
    if (state.isPlaying) {
      audioEngine.resume();
    } else {
      audioEngine.pause();
    }
  }, [state.isPlaying, sessionActive, currentId]);

  // stop audio when the session ends
  useEffect(() => {
    if (state.stage === "summary" || state.stage === "home") {
      audioEngine.pause();
    }
  }, [state.stage]);

  return null;
}
