import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { SONG_BY_ID } from "../data/songs";
import { buildSession, similarTo, type SessionPlan } from "../lib/recommender";

export type Tab = "home" | "search" | "discover" | "library" | "create";
/** The Discover surface is always "browse"; loading & summary are overlays on top. */
export type Stage = "browse" | "loading" | "summary";
export type Feedback = "love" | "more" | "down" | "skip";

export interface State {
  tab: Tab;
  stage: Stage;
  moodText: string;
  moodId: string | null;
  moodLabel: string;
  discoveryLevel: number; // 0..1
  plan: SessionPlan | null;
  queue: string[];
  currentIndex: number;
  isPlaying: boolean;
  saved: string[];
  feedback: Record<string, Feedback>;
  playedIds: string[];
}

// Curated default queue so the first screen reads like the design: an
// atmospheric-indie "now playing" with matching discoveries up next.
const DEFAULT_QUEUE = ["t19", "t18", "t14", "t9", "t7", "t5", "t8", "t1", "t20", "t21", "t15", "t3"];

const initialState: State = {
  tab: "discover",
  stage: "browse",
  moodText: "",
  moodId: null,
  moodLabel: "For you",
  discoveryLevel: 0.5,
  plan: null,
  queue: DEFAULT_QUEUE,
  currentIndex: 0,
  isPlaying: false,
  saved: [],
  feedback: {},
  playedIds: [DEFAULT_QUEUE[0]],
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
  | { type: "CLOSE_SUMMARY" }
  | { type: "NEW_SESSION" };

function pushPlayed(list: string[], id: string | undefined): string[] {
  if (!id || list.includes(id)) return list;
  return [...list, id];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };

    case "SET_MOOD_TEXT":
      return { ...state, moodText: action.text };

    case "SET_MOOD":
      return { ...state, moodId: action.id, moodText: action.label, moodLabel: action.label || "For you" };

    case "SET_DISCOVERY":
      return { ...state, discoveryLevel: action.value };

    case "START_SESSION":
      return { ...state, stage: "loading" };

    case "SESSION_READY":
      return {
        ...state,
        stage: "browse",
        tab: "discover",
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
        return { ...state, stage: "summary", tab: "discover", isPlaying: false };
      }
      return { ...state, currentIndex: next, isPlaying: true, playedIds: pushPlayed(state.playedIds, state.queue[next]) };
    }

    case "PREV":
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1), isPlaying: true };

    case "GOTO": {
      const index = Math.max(0, Math.min(state.queue.length - 1, action.index));
      return { ...state, currentIndex: index, isPlaying: true, playedIds: pushPlayed(state.playedIds, state.queue[index]) };
    }

    case "FEEDBACK": {
      const currentId = state.queue[state.currentIndex];
      if (!currentId) return state;
      const feedback = { ...state.feedback, [currentId]: action.kind };
      const exclude = new Set<string>([...state.playedIds, ...state.queue]);
      let queue = [...state.queue];

      if (action.kind === "more" || action.kind === "love") {
        const n = action.kind === "more" ? 2 : 1;
        const additions = similarTo(currentId, exclude).slice(0, n).map((s) => s.id);
        if (additions.length) {
          queue = [...queue.slice(0, state.currentIndex + 1), ...additions, ...queue.slice(state.currentIndex + 1)];
        }
        return { ...state, feedback, queue };
      }

      if (action.kind === "down") {
        const artist = SONG_BY_ID[currentId]?.artist;
        const head = queue.slice(0, state.currentIndex + 1);
        let tail = queue.slice(state.currentIndex + 1).filter((id) => SONG_BY_ID[id]?.artist !== artist);
        const backfill = similarTo(currentId, new Set([...exclude, artist as string]))
          .filter((s) => s.artist !== artist)
          .slice(0, 1)
          .map((s) => s.id);
        queue = [...head, ...tail, ...backfill];
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= queue.length) {
          return { ...state, feedback, queue, stage: "summary", tab: "discover", isPlaying: false };
        }
        return { ...state, feedback, queue, currentIndex: nextIndex, isPlaying: true, playedIds: pushPlayed(state.playedIds, queue[nextIndex]) };
      }

      // skip = neutral advance
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= queue.length) {
        return { ...state, feedback, stage: "summary", tab: "discover", isPlaying: false };
      }
      return { ...state, feedback, currentIndex: nextIndex, isPlaying: true, playedIds: pushPlayed(state.playedIds, queue[nextIndex]) };
    }

    case "TOGGLE_SAVE": {
      const saved = state.saved.includes(action.id)
        ? state.saved.filter((id) => id !== action.id)
        : [...state.saved, action.id];
      return { ...state, saved };
    }

    case "END_SESSION":
      return { ...state, stage: "summary", tab: "discover", isPlaying: false };

    case "CLOSE_SUMMARY":
      return { ...state, stage: "browse" };

    case "NEW_SESSION": {
      const fresh = buildSession(null, "For you", 0.5, 12);
      return {
        ...state,
        stage: "browse",
        tab: "discover",
        moodId: null,
        moodText: "",
        moodLabel: "For you",
        discoveryLevel: 0.5,
        plan: fresh,
        queue: fresh.queue,
        currentIndex: 0,
        isPlaying: false,
        feedback: {},
        playedIds: fresh.queue.length ? [fresh.queue[0]] : [],
      };
    }

    default:
      return state;
  }
}

interface GenerateOpts {
  moodId?: string | null;
  label?: string;
  discovery?: number;
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
  generateSession: (opts?: GenerateOpts) => void;
}

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateSession = (opts?: GenerateOpts) => {
    dispatch({ type: "START_SESSION" });
    const moodId = opts?.moodId !== undefined ? opts.moodId : state.moodId;
    const label = (opts?.label ?? state.moodText).trim() || "For you";
    const discovery = opts?.discovery ?? state.discoveryLevel;
    const plan = buildSession(moodId, label, discovery, 12);
    window.setTimeout(() => dispatch({ type: "SESSION_READY", plan }), 2100);
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
