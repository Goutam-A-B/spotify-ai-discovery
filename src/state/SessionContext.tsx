import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { SONG_BY_ID } from "../data/songs";
import { buildSession, similarTo, type SessionPlan } from "../lib/recommender";

export type Tab = "home" | "search" | "discover" | "library" | "create";
export type Stage = "home" | "loading" | "player" | "summary";
export type Feedback = "love" | "more" | "down" | "skip";

export interface State {
  tab: Tab;
  stage: Stage;
  moodText: string;
  moodId: string | null;
  discoveryLevel: number; // 0..1
  plan: SessionPlan | null;
  queue: string[];
  currentIndex: number;
  isPlaying: boolean;
  saved: string[];
  feedback: Record<string, Feedback>;
  playedIds: string[]; // every track that became "current"
}

const initialState: State = {
  tab: "discover",
  stage: "home",
  moodText: "",
  moodId: null,
  discoveryLevel: 0.6,
  plan: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  saved: [],
  feedback: {},
  playedIds: [],
};

type Action =
  | { type: "SET_TAB"; tab: Tab }
  | { type: "SET_MOOD_TEXT"; text: string }
  | { type: "SET_MOOD"; id: string | null; label: string }
  | { type: "SET_DISCOVERY"; value: number }
  | { type: "START_SESSION" }
  | { type: "SESSION_READY"; plan: SessionPlan }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PLAYING"; value: boolean }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; index: number }
  | { type: "FEEDBACK"; kind: Feedback }
  | { type: "TOGGLE_SAVE"; id: string }
  | { type: "END_SESSION" }
  | { type: "NEW_SESSION" };

function withPlayed(state: State, index: number): string[] {
  const id = state.queue[index];
  if (!id) return state.playedIds;
  return state.playedIds.includes(id) ? state.playedIds : [...state.playedIds, id];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };

    case "SET_MOOD_TEXT":
      return { ...state, moodText: action.text };

    case "SET_MOOD":
      return { ...state, moodId: action.id, moodText: action.label };

    case "SET_DISCOVERY":
      return { ...state, discoveryLevel: action.value };

    case "START_SESSION":
      return { ...state, stage: "loading" };

    case "SESSION_READY":
      return {
        ...state,
        stage: "player",
        plan: action.plan,
        queue: action.plan.queue,
        currentIndex: 0,
        isPlaying: true,
        feedback: {},
        playedIds: action.plan.queue.length ? [action.plan.queue[0]] : [],
      };

    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };

    case "SET_PLAYING":
      return { ...state, isPlaying: action.value };

    case "NEXT": {
      const next = state.currentIndex + 1;
      if (next >= state.queue.length) {
        return { ...state, stage: "summary", isPlaying: false, tab: "discover" };
      }
      return { ...state, currentIndex: next, isPlaying: true, playedIds: withPlayed(state, next) };
    }

    case "PREV": {
      const prev = Math.max(0, state.currentIndex - 1);
      return { ...state, currentIndex: prev, isPlaying: true };
    }

    case "GOTO": {
      const index = Math.max(0, Math.min(state.queue.length - 1, action.index));
      return { ...state, currentIndex: index, isPlaying: true, playedIds: withPlayed(state, index) };
    }

    case "FEEDBACK": {
      const currentId = state.queue[state.currentIndex];
      if (!currentId) return state;
      const feedback = { ...state.feedback, [currentId]: action.kind };

      const played = new Set(state.playedIds);
      const inQueue = new Set(state.queue);
      const exclude = new Set<string>([...played, ...inQueue]);

      let queue = [...state.queue];

      if (action.kind === "more" || action.kind === "love") {
        // AI refines: inject similar tracks right after the current one
        const n = action.kind === "more" ? 2 : 1;
        const additions = similarTo(currentId, exclude)
          .slice(0, n)
          .map((s) => s.id);
        if (additions.length) {
          queue = [
            ...queue.slice(0, state.currentIndex + 1),
            ...additions,
            ...queue.slice(state.currentIndex + 1),
          ];
        }
        return { ...state, feedback, queue };
      }

      if (action.kind === "down") {
        // AI refines: drop upcoming tracks by the same artist, then skip
        const artist = SONG_BY_ID[currentId]?.artist;
        const head = queue.slice(0, state.currentIndex + 1);
        let tail = queue.slice(state.currentIndex + 1);
        tail = tail.filter((id) => SONG_BY_ID[id]?.artist !== artist);
        // try to backfill one fresh similar-to-mood track so the session stays full
        const backfill = similarTo(currentId, new Set([...exclude, artist as string]))
          .filter((s) => s.artist !== artist)
          .slice(0, 1)
          .map((s) => s.id);
        queue = [...head, ...tail, ...backfill];
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= queue.length) {
          return { ...state, feedback, queue, stage: "summary", isPlaying: false, tab: "discover" };
        }
        return {
          ...state,
          feedback,
          queue,
          currentIndex: nextIndex,
          isPlaying: true,
          playedIds: state.playedIds.includes(queue[nextIndex])
            ? state.playedIds
            : [...state.playedIds, queue[nextIndex]],
        };
      }

      // skip = neutral: just advance
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= queue.length) {
        return { ...state, feedback, stage: "summary", isPlaying: false, tab: "discover" };
      }
      return {
        ...state,
        feedback,
        currentIndex: nextIndex,
        isPlaying: true,
        playedIds: state.playedIds.includes(queue[nextIndex])
          ? state.playedIds
          : [...state.playedIds, queue[nextIndex]],
      };
    }

    case "TOGGLE_SAVE": {
      const saved = state.saved.includes(action.id)
        ? state.saved.filter((id) => id !== action.id)
        : [...state.saved, action.id];
      return { ...state, saved };
    }

    case "END_SESSION":
      return { ...state, stage: "summary", isPlaying: false };

    case "NEW_SESSION":
      return {
        ...state,
        stage: "home",
        isPlaying: false,
        plan: null,
        queue: [],
        currentIndex: 0,
        feedback: {},
        playedIds: [],
        moodId: null,
        moodText: "",
      };

    default:
      return state;
  }
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
  /** builds the session then flips to the player after a short "AI" delay */
  generateSession: () => void;
}

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateSession = () => {
    dispatch({ type: "START_SESSION" });
    const label = state.moodText.trim() || "Your vibe";
    const plan = buildSession(state.moodId, label, state.discoveryLevel, 12);
    window.setTimeout(() => {
      dispatch({ type: "SESSION_READY", plan });
    }, 2200);
  };

  const value = useMemo(() => ({ state, dispatch, generateSession }), [state]);
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): Ctx {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
