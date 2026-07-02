import { useSession } from "../state/SessionContext";
import { SONG_BY_ID } from "../data/songs";
import { AlbumArt } from "../components/AlbumArt";
import { SparkleIcon, SearchIcon, HeartIcon, PlusIcon } from "../components/icons";

/** A reusable banner that funnels every context tab into the Discover feature. */
function DiscoverPromo() {
  const { dispatch } = useSession();
  return (
    <button className="promo" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
      <div className="promo__spark">
        <SparkleIcon size={22} />
      </div>
      <div className="promo__text">
        <div className="promo__title">AI Discovery Session</div>
        <div className="promo__sub">Describe a mood — get an explained, controllable mix</div>
      </div>
      <span className="promo__go">Open</span>
    </button>
  );
}

const SHORTCUTS = [
  { name: "Liked Songs", grad: ["#4b6cb7", "#182848"], emoji: "💚" },
  { name: "Comforting Mix", grad: ["#7a6a12", "#3d2f08"], emoji: "🫖" },
  { name: "daylist", grad: ["#f7971e", "#1f4f66"], emoji: "🌤️" },
  { name: "Atif Aslam old hits ✨", grad: ["#8e2de2", "#4a00e0"], emoji: "🎤" },
  { name: "Pop Mix", grad: ["#8a1f66", "#3d0836"], emoji: "🎧" },
  { name: "Soft Mix", grad: ["#b22", "#611"], emoji: "🍂" },
];

export function HomeTab() {
  const { dispatch } = useSession();
  return (
    <div className="screen ctab">
      <header className="ctab__top">
        <div className="avatar avatar--sm">G</div>
        <div className="ctab__filters">
          <span className="pill pill--green">All</span>
          <span className="pill">Music</span>
          <span className="pill">Podcasts</span>
        </div>
      </header>

      <DiscoverPromo />

      <div className="shortcuts">
        {SHORTCUTS.map((s) => (
          <button key={s.name} className="shortcut" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
            <span
              className="shortcut__art"
              style={{ background: `linear-gradient(145deg, ${s.grad[0]}, ${s.grad[1]})` }}
            >
              {s.emoji}
            </span>
            <span className="shortcut__name">{s.name}</span>
          </button>
        ))}
      </div>

      <h2 className="section__title section__title--pad">Soundtrack your day</h2>
      <div className="rail">
        {["Chill Sad Mix", "Comforting Mix", "Mohit Chauhan Mix"].map((n, i) => (
          <button key={n} className="railcard" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
            <span
              className="railcard__art"
              style={{ background: `linear-gradient(145deg, ${["#0575e6", "#7a6a12", "#11998e"][i]}, #111)` }}
            />
            <span className="railcard__name">{n}</span>
            <span className="railcard__sub">Made for Goutam</span>
          </button>
        ))}
      </div>
      <p className="ctab__note">This is a context screen. The prototype’s focus is the ✨ Discover tab.</p>
    </div>
  );
}

export function SearchTab() {
  const { dispatch } = useSession();
  const cats = [
    ["Music", "#e91e63"],
    ["Podcasts", "#0d7377"],
    ["Made For You", "#7b5ea7"],
    ["New Releases", "#7a8f18"],
    ["Rain & Monsoon", "#1976d2"],
    ["I-Pop", "#1b3a6b"],
  ] as const;
  return (
    <div className="screen ctab">
      <header className="ctab__top ctab__top--col">
        <h1 className="ctab__h1">Search</h1>
      </header>
      <button className="searchfield" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
        <SearchIcon size={20} />
        <span>What do you want to listen to?</span>
      </button>
      <DiscoverPromo />
      <h2 className="section__title section__title--pad">Browse all</h2>
      <div className="browsegrid">
        {cats.map(([name, color]) => (
          <button
            key={name}
            className="browsecard"
            style={{ background: color }}
            onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LibraryTab() {
  const { state, dispatch } = useSession();
  const saved = state.saved.map((id) => SONG_BY_ID[id]).filter(Boolean);
  return (
    <div className="screen ctab">
      <header className="ctab__top">
        <div className="avatar avatar--sm">G</div>
        <h1 className="ctab__h1">Your Library</h1>
      </header>
      <div className="ctab__filters ctab__filters--pad">
        <span className="pill">Playlists</span>
        <span className="pill">Artists</span>
        <span className="pill">Albums</span>
      </div>

      <button className="libitem libitem--liked" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
        <span className="libitem__art libitem__art--liked">
          <HeartIcon size={22} filled />
        </span>
        <div className="libitem__meta">
          <div className="libitem__title">Liked Songs</div>
          <div className="libitem__sub">Playlist · {1887 + saved.length} songs</div>
        </div>
      </button>

      {saved.length > 0 && (
        <>
          <h2 className="section__title section__title--pad">Saved from Discovery</h2>
          {saved.map((s) => (
            <div key={s.id} className="libitem">
              <AlbumArt song={s} size={52} radius={5} />
              <div className="libitem__meta">
                <div className="libitem__title">{s.title}</div>
                <div className="libitem__sub">Song · {s.artist}</div>
              </div>
              <HeartIcon size={20} filled className="libitem__heart" />
            </div>
          ))}
        </>
      )}

      <DiscoverPromo />
    </div>
  );
}

export function CreateTab() {
  const { dispatch } = useSession();
  const items = [
    ["Playlist", "Create a playlist with songs or episodes", "🎵"],
    ["Collaborative playlist", "Create a playlist together with friends", "👥"],
    ["Blend", "Combine your friends’ tastes into a playlist", "🔀"],
    ["Jam", "Listen together from anywhere", "📡"],
  ] as const;
  return (
    <div className="screen ctab">
      <header className="ctab__top ctab__top--col">
        <h1 className="ctab__h1">Create</h1>
      </header>

      <button className="createitem createitem--hero" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
        <span className="createitem__icon createitem__icon--hero">
          <SparkleIcon size={24} />
        </span>
        <div className="createitem__meta">
          <div className="createitem__title">AI Discovery Session</div>
          <div className="createitem__sub">Mood-based, explained recommendations</div>
        </div>
        <PlusIcon size={22} />
      </button>

      {items.map(([title, sub, emoji]) => (
        <button key={title} className="createitem" onClick={() => dispatch({ type: "SET_TAB", tab: "discover" })}>
          <span className="createitem__icon">{emoji}</span>
          <div className="createitem__meta">
            <div className="createitem__title">{title}</div>
            <div className="createitem__sub">{sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
