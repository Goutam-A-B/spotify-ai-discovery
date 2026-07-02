import { useState } from "react";
import { useSession } from "../../state/SessionContext";
import { DiscoverHome } from "./DiscoverHome";
import { MoodInput } from "./MoodInput";
import { Loading } from "./Loading";
import { Player } from "./Player";
import { Summary } from "./Summary";

export function Discover() {
  const { state } = useSession();
  const [inputOpen, setInputOpen] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);

  const openInput = (voice = false) => {
    setAutoVoice(voice);
    setInputOpen(true);
  };

  return (
    <>
      {state.stage === "home" && <DiscoverHome onOpenInput={openInput} />}
      {state.stage === "loading" && <Loading />}
      {state.stage === "player" && <Player />}
      {state.stage === "summary" && <Summary />}

      <MoodInput open={inputOpen && state.stage === "home"} autoVoice={autoVoice} onClose={() => setInputOpen(false)} />
    </>
  );
}
