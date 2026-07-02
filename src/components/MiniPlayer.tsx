import { useSession } from "../state/SessionContext";
import { usePlayback } from "../state/PlaybackContext";
import { SONG_BY_ID } from "../data/songs";
import { AlbumArt } from "./AlbumArt";
import { PlayIcon, PauseIcon, CheckIcon, CastIcon } from "./icons";

/** Persistent now-playing bar docked above the nav (all tabs), like Spotify. */
export function MiniPlayer() {
  const { state, dispatch } = useSession();
  const { progress, duration } = usePlayback();

  // The Discover tab already shows the full NOW PLAYING card, so the docked
  // bar only appears when browsing the other tabs.
  if (state.stage !== "browse" || state.tab === "discover") return null;
  const id = state.queue[state.currentIndex];
  const song = id ? SONG_BY_ID[id] : null;
  if (!song) return null;

  const saved = state.saved.includes(song.id);
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className="mini"
      style={{ ["--accent" as string]: song.colors[0], ["--accent2" as string]: song.colors[1] }}
      onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}
    >
      <AlbumArt song={song} size={44} radius={6} playing={state.isPlaying} />
      <div className="mini__meta">
        <div className="mini__title">{song.title}</div>
        <div className="mini__artist">{song.artist}</div>
      </div>
      <button className="mini__cast" aria-label="Connect to a device" onClick={(e) => e.stopPropagation()}>
        <CastIcon size={22} />
      </button>
      <button
        className={"mini__save" + (saved ? " is-on" : "")}
        aria-label={saved ? "Saved" : "Save"}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "TOGGLE_SAVE", id: song.id });
        }}
      >
        <CheckIcon size={16} />
      </button>
      <button
        className="mini__play"
        aria-label={state.isPlaying ? "Pause" : "Play"}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "TOGGLE_PLAY" });
        }}
      >
        {state.isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
      </button>
      <div className="mini__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
