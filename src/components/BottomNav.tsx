import { useSession, type Tab } from "../state/SessionContext";
import { HomeIcon, SearchIcon, SparkleIcon, LibraryIcon, PlusIcon } from "./icons";

const ITEMS: { tab: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  { tab: "home", label: "Home", icon: () => <HomeIcon size={24} /> },
  { tab: "search", label: "Search", icon: () => <SearchIcon size={24} /> },
  { tab: "discover", label: "Discover", icon: () => <SparkleIcon size={24} /> },
  { tab: "library", label: "Your Library", icon: () => <LibraryIcon size={24} /> },
  { tab: "create", label: "Create", icon: () => <PlusIcon size={24} /> },
];

export function BottomNav() {
  const { state, dispatch } = useSession();
  return (
    <nav className="bottomnav">
      {ITEMS.map((it) => {
        const active = state.tab === it.tab;
        const isDiscover = it.tab === "discover";
        return (
          <button
            key={it.tab}
            className={
              "bottomnav__item" +
              (active ? " is-active" : "") +
              (isDiscover ? " bottomnav__item--discover" : "")
            }
            onClick={() => dispatch({ type: "SET_TAB", tab: it.tab })}
          >
            <span className="bottomnav__icon">{it.icon(active)}</span>
            <span className="bottomnav__label">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
