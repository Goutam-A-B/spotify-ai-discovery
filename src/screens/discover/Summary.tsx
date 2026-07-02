import { useMemo, useState } from "react";
import { useSession } from "../../state/SessionContext";
import { SONG_BY_ID } from "../../data/songs";
import { MOOD_BY_ID } from "../../data/moods";
import { AlbumArt } from "../../components/AlbumArt";
import { SparkleIcon, HeartIcon, PlusIcon, CheckIcon, CloseIcon } from "../../components/icons";

export function Summary() {
  const { state, dispatch } = useSession();
  const [playlistMade, setPlaylistMade] = useState(false);

  const mood = state.moodId ? MOOD_BY_ID[state.moodId] : null;
  const moodLabel = state.moodText.trim() || "For you";

  const stats = useMemo(() => {
    const played = state.playedIds.map((id) => SONG_BY_ID[id]).filter(Boolean);
    const discovered = played.filter((s) => s.familiarity !== "familiar");
    const artists = new Set(discovered.map((s) => s.artist));
    const sessionIds = new Set([...state.playedIds, ...state.queue]);
    const saved = state.saved.filter((id) => sessionIds.has(id));
    const signals = Object.keys(state.feedback).length;
    return { discovered: discovered.length, artists: artists.size, saved, signals };
  }, [state.playedIds, state.queue, state.saved, state.feedback]);

  return (
    <div className="overlay summary" style={{ ["--accent" as string]: mood?.accent[0] ?? "#1db954" }}>
      <button className="summary__close iconbtn" onClick={() => dispatch({ type: "CLOSE_SUMMARY" })} aria-label="Close">
        <CloseIcon size={24} />
      </button>

      <div className="summary__badge"><SparkleIcon size={30} /></div>
      <h1 className="summary__title">Session complete</h1>
      <p className="summary__mood">{mood ? `${mood.emoji} ${mood.label}` : moodLabel}</p>

      <div className="summary__stats">
        <Stat n={stats.discovered} label="new songs discovered" />
        <Stat n={stats.artists} label="new artists found" />
        <Stat n={stats.saved.length} label="songs saved" />
        <Stat n={stats.signals} label="signals trained" />
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
              <CheckIcon size={18} /> Added to “{moodLabel} · Discovery”
            </div>
          ) : (
            <button className="btn-primary" onClick={() => setPlaylistMade(true)}>
              <PlusIcon size={20} />
              Add {stats.saved.length} to a playlist
            </button>
          ))}
        <button className="btn-ghost" onClick={() => dispatch({ type: "NEW_SESSION" })}>
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
