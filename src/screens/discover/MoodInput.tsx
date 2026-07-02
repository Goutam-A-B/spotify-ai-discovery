import { useEffect, useRef } from "react";
import { useSession } from "../../state/SessionContext";
import { MOODS } from "../../data/moods";
import { useVoiceInput } from "../../lib/useVoiceInput";
import { AdventureSlider } from "../../components/AdventureSlider";
import { CloseIcon, MicIcon, SparkleIcon } from "../../components/icons";

export function MoodInput({
  open,
  autoVoice,
  onClose,
}: {
  open: boolean;
  autoVoice: boolean;
  onClose: () => void;
}) {
  const { state, dispatch, generateSession } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const voice = useVoiceInput((text) => {
    if (text) dispatch({ type: "SET_MOOD", id: matchMood(text), label: text });
  });

  useEffect(() => {
    if (!open) return;
    if (autoVoice) {
      voice.start();
    } else {
      const t = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoVoice]);

  if (!open) return null;

  const canGenerate = !!state.moodId || state.moodText.trim().length > 0;

  const generate = () => {
    onClose();
    generateSession();
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grab" />
        <header className="sheet__head">
          <h2>What’s the moment?</h2>
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <CloseIcon size={22} />
          </button>
        </header>

        <div className="moodinput__field">
          <input
            ref={inputRef}
            className="moodinput__input"
            value={voice.listening ? voice.transcript : state.moodText}
            placeholder="e.g. rainy evening, need something calm"
            onChange={(e) => dispatch({ type: "SET_MOOD", id: matchMood(e.target.value), label: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canGenerate) generate();
            }}
          />
          <button
            className={"mic-btn" + (voice.listening ? " mic-btn--live" : "")}
            onClick={() => (voice.listening ? voice.stop() : voice.start())}
            aria-label={voice.listening ? "Stop listening" : "Speak"}
          >
            <MicIcon size={22} />
          </button>
        </div>

        {voice.listening && (
          <div className="moodinput__listening">
            <span className="pulse-dot" /> Listening… “{voice.transcript || "…"}”
          </div>
        )}
        {!voice.supported && !voice.listening && (
          <div className="moodinput__note">Voice uses a simulated dictation in this browser.</div>
        )}

        <div className="moodinput__chips">
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={"chip chip--sm" + (state.moodId === m.id ? " chip--active" : "")}
              onClick={() => dispatch({ type: "SET_MOOD", id: m.id, label: m.label })}
            >
              <span className="chip__emoji">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        <AdventureSlider compact />

        <button className="btn-primary btn-primary--full" disabled={!canGenerate} onClick={generate}>
          <SparkleIcon size={20} />
          Generate session
        </button>
      </div>
    </div>
  );
}

/** loose keyword match from free text -> a known mood id */
function matchMood(text: string): string | null {
  const t = text.toLowerCase();
  const rules: [string, string[]][] = [
    ["late-night-coding", ["cod", "focus late", "night work", "deep work", "late night"]],
    ["monsoon-drive", ["rain", "monsoon", "drive", "driving"]],
    ["heartbreak", ["heartbreak", "breakup", "sad", "cry", "miss", "lonely"]],
    ["gym", ["gym", "workout", "run", "lift", "pump", "hype"]],
    ["tamil-feel-good", ["tamil", "kollywood", "feel good tamil"]],
    ["study-focus", ["study", "focus", "read", "concentrate"]],
    ["happy-vibes", ["happy", "sunny", "good mood", "party", "dance"]],
    ["nostalgia", ["nostalg", "old", "2010", "throwback", "memories"]],
  ];
  for (const [id, kws] of rules) {
    if (kws.some((k) => t.includes(k))) return id;
  }
  return null;
}
