import { useEffect, useRef, useState } from "react";
import { useSession, type Feedback } from "../../state/SessionContext";
import { usePlayback } from "../../state/PlaybackContext";
import { SONG_BY_ID, formatTime, type Familiarity } from "../../data/songs";
import { MOOD_BY_ID } from "../../data/moods";
import { audioEngine } from "../../audio/engine";
import { AlbumArt } from "../../components/AlbumArt";
import {
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  HeartIcon,
  ThumbDownIcon,
  SkipForwardIcon,
  SparkleIcon,
  BackIcon,
  VolumeIcon,
  QueueIcon,
} from "../../components/icons";

const FAMILIARITY: Record<Familiarity, { label: string; cls: string }> = {
  familiar: { label: "In your rotation", cls: "tag--familiar" },
  adjacent: { label: "Because you like…", cls: "tag--adjacent" },
  new: { label: "Fresh find", cls: "tag--new" },
};

const FLASH: Record<Feedback, string> = {
  love: "❤️ Loved — the AI will lean into this",
  more: "✨ More like this — added 2 similar tracks up next",
  down: "👎 Noted — fewer like this, and skipping",
  skip: "⏭️ Skipped",
};

export function Player() {
  const { state, dispatch } = useSession();
  const { progress, duration, seek } = usePlayback();
  const [flash, setFlash] = useState<string | null>(null);
  const [muted, setMuted] = useState(audioEngine.muted);
  const flashTimer = useRef<number | null>(null);

  const currentId = state.queue[state.currentIndex];
  const song = currentId ? SONG_BY_ID[currentId] : null;
  const mood = state.moodId ? MOOD_BY_ID[state.moodId] : null;
  const saved = song ? state.saved.includes(song.id) : false;

  useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearInterval(flashTimer.current);
    };
  }, []);

  if (!song) return null;

  const fam = FAMILIARITY[song.familiarity];
  const upNext = state.queue.slice(state.currentIndex + 1);

  const showFlash = (kind: Feedback) => {
    setFlash(FLASH[kind]);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(null), 2200);
  };

  const feedback = (kind: Feedback) => {
    showFlash(kind);
    dispatch({ type: "FEEDBACK", kind });
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className="screen player"
      style={{ ["--accent" as string]: song.colors[0], ["--accent2" as string]: song.colors[1] }}
    >
      <header className="player__top">
        <button className="iconbtn" onClick={() => dispatch({ type: "SET_TAB", tab: "home" })} aria-label="Minimize">
          <BackIcon size={24} />
        </button>
        <div className="player__eyebrow">
          <span className="player__eyebrow-label">DISCOVERY SESSION</span>
          <span className="player__eyebrow-mood">{mood ? `${mood.emoji} ${mood.label}` : state.moodText}</span>
        </div>
        <button className="iconbtn" onClick={() => dispatch({ type: "END_SESSION" })} aria-label="End session">
          <SparkleIcon size={22} />
        </button>
      </header>

      {/* Cover */}
      <div className="player__coverwrap">
        <AlbumArt song={song} size={300} radius={12} playing={state.isPlaying} />
      </div>

      {/* Title row */}
      <div className="player__titlerow">
        <div className="player__meta">
          <div className="player__title">{song.title}</div>
          <div className="player__artist">{song.artist}</div>
        </div>
        <button
          className={"savebtn" + (saved ? " savebtn--on" : "")}
          onClick={() => dispatch({ type: "TOGGLE_SAVE", id: song.id })}
          aria-label={saved ? "Remove from Liked" : "Save to Liked"}
        >
          <HeartIcon size={26} filled={saved} />
        </button>
      </div>

      <div className={"tag " + fam.cls}>{fam.label}</div>

      {/* Progress */}
      <div className="player__progress">
        <div
          className="bar"
          onClick={(e) => {
            const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * duration);
          }}
        >
          <div className="bar__fill" style={{ width: `${pct}%` }}>
            <span className="bar__knob" />
          </div>
        </div>
        <div className="player__times">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="player__transport">
        <button
          className="iconbtn"
          onClick={() => {
            const next = audioEngine.toggleMuted();
            setMuted(next);
          }}
          aria-label="Mute"
        >
          <VolumeIcon size={22} muted={muted} />
        </button>
        <button className="iconbtn iconbtn--lg" onClick={() => dispatch({ type: "PREV" })} aria-label="Previous">
          <PrevIcon size={30} />
        </button>
        <button
          className="playbtn"
          onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
          aria-label={state.isPlaying ? "Pause" : "Play"}
        >
          {state.isPlaying ? <PauseIcon size={30} /> : <PlayIcon size={30} />}
        </button>
        <button className="iconbtn iconbtn--lg" onClick={() => dispatch({ type: "NEXT" })} aria-label="Next">
          <NextIcon size={30} />
        </button>
        <div className="player__count">
          {state.currentIndex + 1}/{state.queue.length}
        </div>
      </div>

      {/* Feedback controls — training signals */}
      <div className="feedback">
        {flash && <div className="feedback__flash">{flash}</div>}
        <div className="feedback__row">
          <FeedbackBtn kind="love" label="Love this" onClick={feedback} active={state.feedback[song.id] === "love"}>
            <HeartIcon size={22} filled={state.feedback[song.id] === "love"} />
          </FeedbackBtn>
          <FeedbackBtn kind="more" label="More like this" onClick={feedback} active={state.feedback[song.id] === "more"}>
            <SparkleIcon size={22} />
          </FeedbackBtn>
          <FeedbackBtn kind="down" label="Not for me" onClick={feedback} active={state.feedback[song.id] === "down"}>
            <ThumbDownIcon size={22} />
          </FeedbackBtn>
          <FeedbackBtn kind="skip" label="Skip" onClick={feedback} active={false}>
            <SkipForwardIcon size={22} />
          </FeedbackBtn>
        </div>
      </div>

      {/* Why this song? — the trust feature */}
      <section className="why">
        <div className="why__head">
          <SparkleIcon size={18} className="why__icon" />
          <h3>Why this song?</h3>
        </div>
        <ul className="why__list">
          {song.why.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <div className="why__similar">
          <span className="why__similar-label">Sounds like</span>
          {song.similarArtists.map((a) => (
            <span key={a} className="pill">{a}</span>
          ))}
        </div>
      </section>

      {/* Up Next queue */}
      <section className="upnext">
        <div className="upnext__head">
          <QueueIcon size={18} />
          <h3>Up next</h3>
          <span className="upnext__count">{upNext.length} tracks</span>
        </div>
        <div className="upnext__list">
          {upNext.map((id, i) => {
            const s = SONG_BY_ID[id];
            const f = FAMILIARITY[s.familiarity];
            return (
              <button key={id} className="upnext__item" onClick={() => dispatch({ type: "GOTO", index: state.currentIndex + 1 + i })}>
                <AlbumArt song={s} size={46} radius={5} />
                <div className="upnext__meta">
                  <div className="upnext__title">{s.title}</div>
                  <div className="upnext__artist">{s.artist}</div>
                </div>
                <span className={"dot " + f.cls}>{s.familiarity === "new" ? "NEW" : s.familiarity === "adjacent" ? "SIM" : "FAV"}</span>
              </button>
            );
          })}
          {upNext.length === 0 && <div className="upnext__empty">Last track — enjoy the finish 🎧</div>}
        </div>
        <button className="btn-ghost" onClick={() => dispatch({ type: "END_SESSION" })}>
          End session & see summary
        </button>
      </section>
    </div>
  );
}

function FeedbackBtn({
  kind,
  label,
  active,
  onClick,
  children,
}: {
  kind: Feedback;
  label: string;
  active: boolean;
  onClick: (k: Feedback) => void;
  children: React.ReactNode;
}) {
  return (
    <button className={"fbtn fbtn--" + kind + (active ? " is-active" : "")} onClick={() => onClick(kind)}>
      <span className="fbtn__icon">{children}</span>
      <span className="fbtn__label">{label}</span>
    </button>
  );
}
