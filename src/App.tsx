import { useSession } from "./state/SessionContext";
import { PlaybackProvider } from "./state/PlaybackContext";
import { StatusBar } from "./components/StatusBar";
import { BottomNav } from "./components/BottomNav";
import { MiniPlayer } from "./components/MiniPlayer";
import { Discover } from "./screens/discover/Discover";
import { Loading } from "./screens/discover/Loading";
import { Summary } from "./screens/discover/Summary";
import { HomeTab, SearchTab, LibraryTab, CreateTab } from "./screens/OtherTabs";

function ActiveTab() {
  const { state } = useSession();
  switch (state.tab) {
    case "discover":
      return <Discover />;
    case "home":
      return <HomeTab />;
    case "search":
      return <SearchTab />;
    case "library":
      return <LibraryTab />;
    case "create":
      return <CreateTab />;
    default:
      return <Discover />;
  }
}

function PhoneContent() {
  const { state } = useSession();
  return (
    <>
      <div className="phone__body">
        <ActiveTab />
      </div>
      <MiniPlayer />
      <BottomNav />
      <div className="phone__homebar" />

      {state.stage === "loading" && <Loading />}
      {state.stage === "summary" && <Summary />}
    </>
  );
}

export function App() {
  return (
    <PlaybackProvider>
      <div className="stage">
        <div className="phone">
          <div className="phone__notch" />
          <StatusBar />
          <PhoneContent />
        </div>
      </div>
    </PlaybackProvider>
  );
}
