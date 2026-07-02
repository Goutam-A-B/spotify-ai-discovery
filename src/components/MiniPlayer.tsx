import { useSession } from "../state/SessionContext";
import { usePlayback } from "../state/PlaybackContext";
import { SONG_BY_ID } from "../data/songs";
import { AlbumArt } from "./AlbumArt";
import { PlayIcon, PauseIcon, CheckIcon } from "./icons";

/** The docked now-playing bar shown when the session plays under another tab. */
export function MiniPlayer() {
  const { state, dispatch } = useSession();
  const { progress, duration } = usePlayback();

  const show = state.stage === "player" && state.tab !== "discover";
  if (!show) return null;

  const id = state.queue[state.currentIndex];
  const song = id ? SONG_BY_ID[id] : null;
  if (!song) return null;

  const saved = state.saved.includes(song.id);
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className="miniplayer"
      style={{ ["--accent" as string]: song.colors[0] }}
      onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}
    >
      <AlbumArt song={song} size={42} radius={5} playing={state.isPlaying} />
      <div className="miniplayer__meta">
        <div className="miniplayer__title">{song.title}</div>
        <div className="miniplayer__artist">{song.artist}</div>
      </div>
      <button
        className={"miniplayer__save" + (saved ? " is-on" : "")}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "TOGGLE_SAVE", id: song.id });
        }}
        aria-label="Save"
      >
        <CheckIcon size={16} />
      </button>
      <button
        className="miniplayer__play"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "TOGGLE_PLAY" });
        }}
        aria-label={state.isPlaying ? "Pause" : "Play"}
      >
        {state.isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
      </button>
      <div className="miniplayer__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
