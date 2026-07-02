# Spotify · AI Discovery — Interactive Phone Prototype

An interactive, deployable phone prototype of an **AI Discovery Session** for Spotify.
Describe a mood, get a continuously-playing session of recommendations, steer the
familiar-vs-new mix, give training feedback, and see every pick explained.

Built to prove the product thesis: **AI-powered discovery reduces effort and
increases trust in music recommendations.**

> Every button is real — the mood input, chips, Adventure dial, feedback controls,
> save, queue and mini-player all drive live state and audio. No static mockups.

## What's inside (maps to the case study)

| Case-study piece | Where it lives |
| --- | --- |
| 1. Discover landing page | `src/screens/discover/DiscoverHome.tsx` |
| 2. Adventure slider (Comfort ↔ Adventure) | `src/components/AdventureSlider.tsx` |
| 3. Discovery session player | `src/screens/discover/Player.tsx` |
| 4. "Why this song?" (explainability) | inside `Player.tsx` |
| 5. Feedback controls (Love / More / Not for me / Skip) | inside `Player.tsx` |
| 6. Up Next queue | inside `Player.tsx` |
| 7. Session summary + stats | `src/screens/discover/Summary.tsx` |
| Mood input + voice | `src/screens/discover/MoodInput.tsx`, `src/lib/useVoiceInput.ts` |
| Loading state + fake "AI input" JSON | `src/screens/discover/Loading.tsx` |
| Rule engine (40/30/20/10, slider-weighted) | `src/lib/recommender.ts` |

### The 6 prototype screens
`Discover Home → Mood Input → Loading → Discovery Player → Feedback → Session Summary`

### How the "AI" works (no ML, on purpose)
A transparent rule engine in `recommender.ts` mixes tracks by familiarity based on
the **discovery dial**: Comfort ≈ 80% familiar, Adventure ≈ 80% new. Feedback
refines the live queue — **More like this** injects similar tracks up next,
**Not for me** drops that artist and back-fills, **Love** leans in, **Skip** is neutral.

### About the audio
Real songs can't be bundled in a prototype, so each track plays a soft, mood-tuned
**generative audio bed** (Web Audio API, `src/audio/engine.ts`). The transport
controls genuinely start/stop sound and drive the progress bar. Turn your volume on.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Build / preview the production bundle:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

This is a standard Vite + React app; Vercel auto-detects it.

**Option A — Vercel dashboard (easiest)**
1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New… → Project → Import** the repo.
3. Framework preset: **Vite** (auto). Build: `npm run build`. Output: `dist`.
4. **Deploy.**

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel          # follow prompts (accept the Vite defaults)
vercel --prod   # promote to production
```

`vercel.json` adds an SPA fallback so any route resolves to the app.

## Tech
- React 18 + TypeScript + Vite (no runtime UI dependencies)
- Web Audio API for generative playback
- Web Speech API for voice mood input (graceful simulated fallback)
- Self-contained: no external network calls, works offline once loaded

## Notes for usability testing
- Best viewed on a phone, or in a desktop browser (renders inside a phone frame).
- Open with sound on to experience continuous listening.
- Suggested test task: *"Find music for a rainy evening, keep what you like."*
- North-star metric to observe: **songs saved per discovery session.**
