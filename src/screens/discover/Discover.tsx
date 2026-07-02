import { useState } from "react";
import { useSession } from "../../state/SessionContext";
import { MOODS } from "../../data/moods";
import { AdventureSlider } from "../../components/AdventureSlider";
import { NowPlaying } from "../../components/NowPlaying";
import { UpNext } from "../../components/UpNext";
import { MoodInput } from "./MoodInput";
import { SparkleIcon, MicIcon, GearIcon, ClockIcon } from "../../components/icons";

export function Discover() {
  const { state, dispatch, generateSession } = useSession();
  const [inputOpen, setInputOpen] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  const [learnMore, setLearnMore] = useState(false);

  const openInput = (voice = false) => {
    setAutoVoice(voice);
    setInputOpen(true);
  };

  const pickMood = (id: string, label: string) => {
    dispatch({ type: "SET_MOOD", id, label });
    generateSession({ moodId: id, label, discovery: state.discoveryLevel });
  };

  return (
    <div className="screen discover">
      <header className="dsc__top">
        <div>
          <h1 className="dsc__title">Discover</h1>
          <div className="dsc__subtitle">
            Your AI-powered discovery session <SparkleIcon size={13} className="dsc__spark" />
          </div>
        </div>
        <div className="dsc__topicons">
          <button className="iconbtn" aria-label="Session recap" onClick={() => dispatch({ type: "END_SESSION" })}>
            <ClockIcon size={22} />
          </button>
          <button className="iconbtn" aria-label="New session" onClick={() => dispatch({ type: "NEW_SESSION" })}>
            <GearIcon size={22} />
          </button>
        </div>
      </header>

      <h2 className="dsc__q">What are you in the mood for?</h2>

      <div className="moodbar" role="button" tabIndex={0} onClick={() => openInput(false)}>
        <SparkleIcon size={20} className="moodbar__spark" />
        <span className="moodbar__placeholder">
          {state.moodId ? state.moodLabel : "Describe your mood or vibe…"}
        </span>
        <button
          className="moodbar__mic"
          aria-label="Speak a mood"
          onClick={(e) => {
            e.stopPropagation();
            openInput(true);
          }}
        >
          <MicIcon size={20} />
        </button>
      </div>

      <div className="chips">
        {MOODS.map((m) => (
          <button
            key={m.id}
            className={"chip" + (state.moodId === m.id ? " chip--active" : "")}
            onClick={() => pickMood(m.id, m.label)}
          >
            {m.label} <span className="chip__emoji">{m.emoji}</span>
          </button>
        ))}
      </div>

      <AdventureSlider />

      <button className={"learn" + (learnMore ? " learn--open" : "")} onClick={() => setLearnMore((v) => !v)}>
        <span className="learn__spark"><SparkleIcon size={20} /></span>
        <div className="learn__body">
          <div className="learn__title">Discover Session is learning your taste…</div>
          <div className="learn__sub">
            {learnMore
              ? "Every Love, More-like-this, skip and save re-weights what plays next. The dial sets how far we roam from your favorites."
              : "The more you listen, the better it gets."}
          </div>
        </div>
        <span className="learn__cta">{learnMore ? "Close" : "Learn more"}</span>
      </button>

      <NowPlaying />

      <UpNext />

      <MoodInput open={inputOpen} autoVoice={autoVoice} onClose={() => setInputOpen(false)} />
    </div>
  );
}
