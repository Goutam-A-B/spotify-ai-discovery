import { useEffect, useSyncExternalStore } from "react";
import type { Song } from "../data/songs";
import { ensureMedia, getMedia, subscribeMedia, type Media } from "./media";

/**
 * Returns enriched media for a song and triggers the lookup on first use.
 * `undefined` = still loading · `null` = nothing found · `Media` = ready.
 */
export function useMedia(song: Song | null | undefined): Media | null | undefined {
  const value = useSyncExternalStore(
    subscribeMedia,
    () => (song ? getMedia(song.id) : undefined),
    () => undefined,
  );

  useEffect(() => {
    if (song) ensureMedia(song);
  }, [song]);

  return value;
}
