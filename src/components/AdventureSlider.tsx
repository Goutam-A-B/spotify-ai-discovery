import { useSession } from "../state/SessionContext";
import { humanMix } from "../lib/recommender";

function label(v: number): string {
  if (v < 0.25) return "Comfort";
  if (v < 0.45) return "Mostly familiar";
  if (v < 0.6) return "Balanced";
  if (v < 0.8) return "Adventurous";
  return "Full Adventure";
}

/**
 * The differentiator: user-controlled familiar-vs-new mix.
 * Comfort = 80% familiar, Adventure = 80% new.
 */
export function AdventureSlider({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useSession();
  const v = state.discoveryLevel;
  const pct = Math.round(v * 100);

  return (
    <div className={"adventure" + (compact ? " adventure--compact" : "")}>
      <div className="adventure__head">
        <div>
          <div className="adventure__title">Discovery dial</div>
          <div className="adventure__sub">{humanMix(v)}</div>
        </div>
        <span className="adventure__badge">{label(v)}</span>
      </div>

      <div className="adventure__track">
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          aria-label="Discovery level from comfort to adventure"
          onChange={(e) => dispatch({ type: "SET_DISCOVERY", value: Number(e.target.value) / 100 })}
          style={{ ["--pct" as string]: `${pct}%` }}
        />
      </div>

      <div className="adventure__ends">
        <span>🛋️ Comfort</span>
        <span>Adventure 🚀</span>
      </div>
    </div>
  );
}
