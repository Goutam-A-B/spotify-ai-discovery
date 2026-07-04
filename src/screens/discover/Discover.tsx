import { useState } from "react";
import { useSession } from "../../state/SessionContext";
import { MOODS } from "../../data/moods";
import { AdventureSlider } from "../../components/AdventureSlider";
import { NowPlaying } from "../../components/NowPlaying";
import { UpNext } from "../../components/UpNext";
import { MoodInput } from "./MoodInput";
import { SparkleIcon, MicIcon, ClockIcon } from "../../components/icons";

export function Discover() {
  const { state, dispatch, generateSession } = useSession();
  const [inputOpen, setInputOpen] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

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
          {/* subtle "it's learning" indicator — tap to reveal */}
          <div className="learnwrap">
            <button
              className={"learnbtn" + (learnOpen ? " is-on" : "")}
              aria-label="How discovery learns"
              onClick={() => setLearnOpen((v) => !v)}
            >
              🧠
            </button>
            {learnOpen && (
              <div className="learnpop" role="status">
                <b>Learning your taste</b>
                <span>Every love, skip and save re-weights what plays next. The more you listen, the better it gets.</span>
              </div>
            )}
          </div>
          <button className="iconbtn" aria-label="Session recap" onClick={() => dispatch({ type: "END_SESSION" })}>
            <ClockIcon size={22} />
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

      <NowPlaying />

      <UpNext />

      <MoodInput open={inputOpen} autoVoice={autoVoice} onClose={() => setInputOpen(false)} />
    </div>
  );
}
