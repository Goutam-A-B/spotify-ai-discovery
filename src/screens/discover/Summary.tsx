import { useMemo, useState } from "react";
import { useSession } from "../../state/SessionContext";
import { SONG_BY_ID } from "../../data/songs";
import { MOOD_BY_ID } from "../../data/moods";
import { AlbumArt } from "../../components/AlbumArt";
import { SparkleIcon, HeartIcon, PlusIcon, CheckIcon } from "../../components/icons";

export function Summary() {
  const { state, dispatch } = useSession();
  const [playlistMade, setPlaylistMade] = useState(false);

  const mood = state.moodId ? MOOD_BY_ID[state.moodId] : null;
  const moodLabel = state.moodText.trim() || "Your vibe";

  const stats = useMemo(() => {
    const played = state.playedIds.map((id) => SONG_BY_ID[id]).filter(Boolean);
    const discovered = played.filter((s) => s.familiarity !== "familiar");
    const artists = new Set(discovered.map((s) => s.artist));
    const sessionIds = new Set([...state.playedIds, ...state.queue]);
    const saved = state.saved.filter((id) => sessionIds.has(id));
    const loved = Object.entries(state.feedback).filter(([, v]) => v === "love" || v === "more").length;
    return {
      heard: played.length,
      discovered: discovered.length,
      artists: artists.size,
      saved,
      loved,
    };
  }, [state.playedIds, state.queue, state.saved, state.feedback]);

  const makePlaylist = () => {
    // simulate saving unsaved session songs + creating a playlist
    setPlaylistMade(true);
  };

  return (
    <div className="screen summary" style={{ ["--accent" as string]: mood?.accent[0] ?? "#1db954" }}>
      <div className="summary__badge">
        <SparkleIcon size={30} />
      </div>
      <h1 className="summary__title">Session complete</h1>
      <p className="summary__mood">{mood ? `${mood.emoji} ${mood.label}` : moodLabel}</p>

      <div className="summary__stats">
        <Stat n={stats.discovered} label="new songs discovered" />
        <Stat n={stats.artists} label="new artists found" />
        <Stat n={stats.saved.length} label="songs saved" />
        <Stat n={stats.loved} label="positive signals" />
      </div>

      <div className="summary__trained">
        <SparkleIcon size={16} />
        Your {stats.loved + Object.keys(state.feedback).length} signals trained the next session
      </div>

      {stats.saved.length > 0 ? (
        <section className="summary__saved">
          <h3>Saved this session</h3>
          <div className="summary__savedlist">
            {stats.saved.map((id) => {
              const s = SONG_BY_ID[id];
              return (
                <div key={id} className="summary__savedrow">
                  <AlbumArt song={s} size={44} radius={5} />
                  <div className="summary__savedmeta">
                    <div className="summary__savedtitle">{s.title}</div>
                    <div className="summary__savedartist">{s.artist}</div>
                  </div>
                  <HeartIcon size={20} filled className="summary__heart" />
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <p className="summary__nosave">You didn’t save anything this time — that’s a signal too.</p>
      )}

      <div className="summary__actions">
        {stats.saved.length > 0 &&
          (playlistMade ? (
            <div className="summary__made">
              <CheckIcon size={18} /> Added to “{moodLabel} · Discovery” playlist
            </div>
          ) : (
            <button className="btn-primary btn-primary--full" onClick={makePlaylist}>
              <PlusIcon size={20} />
              Add {stats.saved.length} to a playlist
            </button>
          ))}
        <button className="btn-ghost btn-ghost--full" onClick={() => dispatch({ type: "NEW_SESSION" })}>
          Start a new session
        </button>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="stat">
      <div className="stat__n">{n}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}
