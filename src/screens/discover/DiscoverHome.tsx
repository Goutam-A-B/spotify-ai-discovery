import { useSession } from "../../state/SessionContext";
import { MOODS } from "../../data/moods";
import { AdventureSlider } from "../../components/AdventureSlider";
import { SparkleIcon, SearchIcon, MicIcon } from "../../components/icons";

export function DiscoverHome({ onOpenInput }: { onOpenInput: (voice?: boolean) => void }) {
  const { state, dispatch, generateSession } = useSession();

  return (
    <div className="screen discover-home">
      <header className="discover-home__top">
        <div className="discover-home__title">
          <SparkleIcon size={26} className="discover-home__spark" />
          <h1>Discover</h1>
        </div>
        <div className="avatar" aria-hidden>
          G
        </div>
      </header>

      <p className="discover-home__lede">
        Tell us the moment. We’ll build a listening session for it — and explain every pick.
      </p>

      {/* Mood search bar (opens the Mood Input screen) */}
      <div className="moodbar" onClick={() => onOpenInput(false)} role="button" tabIndex={0}>
        <SearchIcon size={20} className="moodbar__search" />
        <span className="moodbar__placeholder">
          {state.moodText ? state.moodText : "Describe a mood or moment…"}
        </span>
        <button
          className="moodbar__mic"
          onClick={(e) => {
            e.stopPropagation();
            onOpenInput(true);
          }}
          aria-label="Speak a mood"
        >
          <MicIcon size={20} />
        </button>
      </div>

      {/* Suggested prompt chips */}
      <section className="section">
        <h2 className="section__title">Try a vibe</h2>
        <div className="chipwrap">
          {MOODS.map((m) => {
            const active = state.moodId === m.id;
            return (
              <button
                key={m.id}
                className={"chip" + (active ? " chip--active" : "")}
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${m.accent[0]}, ${m.accent[1]})`
                    : undefined,
                }}
                onClick={() => dispatch({ type: "SET_MOOD", id: m.id, label: m.label })}
              >
                <span className="chip__emoji">{m.emoji}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Adventure slider */}
      <section className="section">
        <AdventureSlider />
      </section>

      {/* Start CTA */}
      <div className="discover-home__cta">
        <button
          className="btn-primary"
          disabled={!state.moodId && !state.moodText.trim()}
          onClick={generateSession}
        >
          <SparkleIcon size={20} />
          {state.moodId || state.moodText.trim()
            ? "Generate discovery session"
            : "Pick a vibe to start"}
        </button>
        <p className="discover-home__hint">
          {state.moodId
            ? "Session will mix your favourites with fresh finds based on the dial."
            : "Tap a vibe above or describe your own."}
        </p>
      </div>
    </div>
  );
}
