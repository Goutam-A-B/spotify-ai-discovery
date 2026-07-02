import { useSession } from "../state/SessionContext";

function label(v: number): string {
  if (v < 0.2) return "Comfort";
  if (v < 0.4) return "Familiar";
  if (v < 0.6) return "Balanced";
  if (v < 0.8) return "Adventurous";
  return "Explorer";
}

/**
 * The differentiator: a familiar-vs-new dial.
 * Comfort ≈ 80% familiar · Adventure ≈ 80% new.
 */
export function AdventureSlider() {
  const { state, dispatch } = useSession();
  const v = state.discoveryLevel;
  const pct = Math.round(v * 100);
  // keep the floating badge inside the card bounds
  const badgeLeft = Math.min(88, Math.max(12, pct));

  return (
    <div className="adv">
      <div className="adv__title">How adventurous?</div>
      <div className="adv__sub">We’ll balance familiar favorites and new discoveries</div>

      <div className="adv__badgewrap">
        <span className="adv__badge" style={{ left: `${badgeLeft}%` }}>
          {label(v)}
        </span>
      </div>

      <input
        className="adv__range"
        type="range"
        min={0}
        max={100}
        value={pct}
        aria-label="Discovery dial from comfort to adventure"
        onChange={(e) => dispatch({ type: "SET_DISCOVERY", value: Number(e.target.value) / 100 })}
        style={{ ["--pct" as string]: `${pct}%` }}
      />

      <div className="adv__ends">
        <div className="adv__end">
          <span className="adv__end-main">Comfort</span>
          <span className="adv__end-sub">More familiar</span>
        </div>
        <div className="adv__end adv__end--right">
          <span className="adv__end-main">Adventure</span>
          <span className="adv__end-sub">More new</span>
        </div>
      </div>
    </div>
  );
}
