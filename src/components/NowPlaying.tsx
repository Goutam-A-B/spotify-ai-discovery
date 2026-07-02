import { useEffect, useRef, useState } from "react";
import { useSession, type Feedback } from "../state/SessionContext";
import { SONG_BY_ID, type Familiarity } from "../data/songs";
import { AlbumArt } from "./AlbumArt";
import {
  HeartIcon,
  MoreIcon,
  PlusIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
  SkipIcon,
  ThumbDownIcon,
  SparkleIcon,
  SparklePlusIcon,
  ChevronRightIcon,
  SoundBars,
} from "./icons";

const EYEBROW: Record<Familiarity, { text: string; cls: string }> = {
  new: { text: "NEW FOR YOU", cls: "eyebrow--new" },
  adjacent: { text: "SIMILAR TO YOUR FAVES", cls: "eyebrow--adj" },
  familiar: { text: "IN YOUR ROTATION", cls: "eyebrow--fam" },
};

const FLASH: Record<Feedback, string> = {
  love: "Loved — leaning into this",
  more: "Added 2 similar tracks up next",
  down: "Noted — fewer like this",
  skip: "Skipped",
};

function pretty(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function NowPlaying() {
  const { state, dispatch } = useSession();
  const [expandWhy, setExpandWhy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const id = state.queue[state.currentIndex];
  const song = id ? SONG_BY_ID[id] : null;

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  useEffect(() => { setExpandWhy(false); }, [id]);

  if (!song) return null;
  const saved = state.saved.includes(song.id);
  const eyebrow = EYEBROW[song.familiarity];
  const loved = state.feedback[song.id] === "love";
  const disliked = state.feedback[song.id] === "down";
  const moreLiked = state.feedback[song.id] === "more";

  const doFeedback = (kind: Feedback) => {
    setFlash(FLASH[kind]);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(null), 1700);
    dispatch({ type: "FEEDBACK", kind });
  };

  return (
    <div className="np" style={{ ["--accent" as string]: song.colors[0], ["--accent2" as string]: song.colors[1] }}>
      {flash && <div className="np__flash">{flash}</div>}

      <div className="np__label">NOW PLAYING</div>

      <div className="np__head">
        <AlbumArt song={song} size={78} radius={8} playing={state.isPlaying} />

        <div className="np__info">
          <span className={"eyebrow " + eyebrow.cls}>{eyebrow.text}</span>
          <div className="np__title">{song.title}</div>
          <div className="np__genre">
            {pretty(song.tags[0])} · {song.language}
          </div>
          <div className="np__similar">
            <SoundBars size={13} className="np__eq" />
            <span>
              Similar to your <b>{song.similarArtists[0]}</b>
              {song.similarArtists[1] ? <> and <b>{song.similarArtists[1]}</b></> : null}
            </span>
          </div>
        </div>

        <div className="np__actions">
          <button
            className={"np__icon" + (saved ? " is-on" : "")}
            onClick={() => dispatch({ type: "TOGGLE_SAVE", id: song.id })}
            aria-label={saved ? "Remove from Liked" : "Add to Liked"}
          >
            <HeartIcon size={22} filled={saved} />
          </button>
          <button className="np__icon" aria-label="Details" onClick={() => setExpandWhy((e) => !e)}>
            <MoreIcon size={22} />
          </button>
        </div>
      </div>

      <button
        className={"np__save" + (saved ? " np__save--on" : "")}
        onClick={() => dispatch({ type: "TOGGLE_SAVE", id: song.id })}
      >
        {saved ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
        {saved ? "Saved" : "Save"}
      </button>

      {/* Why this song? */}
      <button className="why" onClick={() => setExpandWhy((e) => !e)}>
        <SparkleIcon size={18} className="why__spark" />
        <div className="why__body">
          <div className="why__title">Why this song?</div>
          <div className="why__text">
            {song.why[0]}
            {expandWhy && (
              <ul className="why__more">
                {song.why.slice(1).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
            {expandWhy && (
              <div className="why__pills">
                <span className="why__pills-label">Sounds like</span>
                {song.similarArtists.map((a) => (
                  <span key={a} className="pill pill--sm">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <ChevronRightIcon size={20} className={"why__chev" + (expandWhy ? " why__chev--open" : "")} />
      </button>

      {/* Transport + feedback */}
      <div className="np__transport">
        <button className={"tbtn" + (disliked ? " tbtn--down" : "")} onClick={() => doFeedback("down")}>
          <span className="tbtn__ic"><ThumbDownIcon size={22} filled={disliked} /></span>
          <span className="tbtn__lbl">Not for me</span>
        </button>
        <button className={"tbtn" + (moreLiked ? " tbtn--more" : "")} onClick={() => doFeedback("more")}>
          <span className="tbtn__ic"><SparklePlusIcon size={22} /></span>
          <span className="tbtn__lbl">More like this</span>
        </button>
        <button className="np__play" onClick={() => dispatch({ type: "TOGGLE_PLAY" })} aria-label={state.isPlaying ? "Pause" : "Play"}>
          {state.isPlaying ? <PauseIcon size={30} /> : <PlayIcon size={30} />}
        </button>
        <button className="tbtn" onClick={() => doFeedback("skip")}>
          <span className="tbtn__ic"><SkipIcon size={22} /></span>
          <span className="tbtn__lbl">Skip</span>
        </button>
        <button className={"tbtn" + (loved ? " tbtn--love" : "")} onClick={() => doFeedback("love")}>
          <span className="tbtn__ic"><HeartIcon size={22} filled={loved} /></span>
          <span className="tbtn__lbl">Love this</span>
        </button>
      </div>

      <div className="np__session">
        <SoundBars size={14} />
        Discover Session
      </div>
    </div>
  );
}
