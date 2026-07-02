import { useEffect, useState } from "react";
import { useSession } from "../../state/SessionContext";
import { MOOD_BY_ID } from "../../data/moods";
import { humanMix } from "../../lib/recommender";
import { SparkleIcon } from "../../components/icons";

export function Loading() {
  const { state } = useSession();
  const mood = state.moodId ? MOOD_BY_ID[state.moodId] : null;
  const label = state.moodText.trim() || "For you";

  const steps = [
    `Reading the moment: “${label}”`,
    "Scanning your library & recent plays",
    `Setting the dial: ${humanMix(state.discoveryLevel)}`,
    "Lining up songs with reasons",
  ];

  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setActive((a) => Math.min(a + 1, steps.length)), 480);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overlay loading" style={{ ["--accent" as string]: mood?.accent[0] ?? "#1db954" }}>
      <div className="loading__orb">
        <span className="loading__ring" />
        <span className="loading__ring loading__ring--2" />
        <SparkleIcon size={38} className="loading__spark" />
      </div>

      <h2 className="loading__title">Building your session</h2>
      <p className="loading__mood">{mood ? `${mood.emoji} ${mood.label}` : label}</p>

      <ul className="loading__steps">
        {steps.map((s, i) => (
          <li key={s} className={i < active ? "done" : i === active ? "active" : ""}>
            <span className="loading__check">{i < active ? "✓" : ""}</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
