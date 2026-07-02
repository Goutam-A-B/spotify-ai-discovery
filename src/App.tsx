import { useSession } from "./state/SessionContext";
import { PlaybackProvider } from "./state/PlaybackContext";
import { StatusBar } from "./components/StatusBar";
import { BottomNav } from "./components/BottomNav";
import { MiniPlayer } from "./components/MiniPlayer";
import { AudioController } from "./components/AudioController";
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
        <div className="stage__caption">
          <span className="stage__dot" />
          Spotify · AI Discovery — interactive prototype
        </div>
        <div className="phone">
          <div className="phone__notch" />
          <StatusBar />
          <PhoneContent />
        </div>
        <p className="stage__hint">Tip: turn sound on — every track plays a mood-tuned audio bed.</p>
      </div>
      <AudioController />
    </PlaybackProvider>
  );
}
