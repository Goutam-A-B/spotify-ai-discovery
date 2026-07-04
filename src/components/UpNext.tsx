import { useSession } from "../state/SessionContext";
import { SONG_BY_ID, type Familiarity } from "../data/songs";
import { AlbumArt } from "./AlbumArt";

const BADGE: Record<Familiarity, { text: string; cls: string }> = {
  new: { text: "NEW", cls: "badge--new" },
  adjacent: { text: "SIMILAR", cls: "badge--adj" },
  familiar: { text: "LIKED", cls: "badge--fam" },
};

export function UpNext() {
  const { state, dispatch } = useSession();
  const upNext = state.queue.slice(state.currentIndex + 1);

  if (upNext.length === 0) return null;

  return (
    <section className="upnext">
      <div className="upnext__head">
        <span className="upnext__label">UP NEXT</span>
        <span className="upnext__count">{upNext.length} tracks</span>
      </div>

      <div className="upnext__row">
        {upNext.map((id, i) => {
          const s = SONG_BY_ID[id];
          const b = BADGE[s.familiarity];
          return (
            <button key={id} className="unc" onClick={() => dispatch({ type: "GOTO", index: state.currentIndex + 1 + i })}>
              <AlbumArt song={s} size={112} radius={8} />
              <div className="unc__title">{s.title}</div>
              <div className="unc__artist">{s.artist}</div>
              <span className={"badge " + b.cls}>{b.text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
