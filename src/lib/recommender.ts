import { SONGS, SONG_BY_ID, type Song, type Familiarity } from "../data/songs";
import { MOOD_BY_ID } from "../data/moods";

/**
 * A deliberately simple, explainable rule engine — no ML.
 * The Adventure slider (discoveryLevel 0..1) changes the target mix:
 *
 *   Comfort  (0.0) -> ~80% familiar
 *   Balanced (0.5) -> ~50 / 50
 *   Adventure(1.0) -> ~80% new
 *
 * This is the fake "AI" backend the case study calls for.
 */

export interface FakeAiInput {
  mood: string; // human label
  moodId: string | null;
  energy: number;
  language: string;
  discovery_level: number;
  favorite_artists: string[];
}

export interface SessionPlan {
  input: FakeAiInput;
  queue: string[]; // ordered song ids
  mixLabel: string; // "80% familiar · 20% new" etc.
}

const FAVORITE_ARTISTS = ["Mohit Chauhan", "Atif Aslam", "Anuv Jain", "Sid Sriram", "Lauv", "Prateek Kuhad"];

/** weight for how well a song matches the requested mood */
function moodScore(song: Song, moodId: string | null, energy: number): number {
  let score = 0;
  if (moodId && song.moods.includes(moodId)) score += 3;
  // energy proximity (closer = better)
  score += 1 - Math.min(1, Math.abs(song.energy - energy));
  return score;
}

/**
 * Build the target counts for each familiarity bucket given the slider.
 * total is the number of tracks in the session.
 */
function targetMix(discovery: number, total: number) {
  // familiar share falls from 0.8 -> 0.2 as discovery goes 0 -> 1
  const familiarShare = 0.8 - 0.6 * discovery;
  const newShare = 0.2 + 0.6 * discovery;
  const familiar = Math.round(familiarShare * total);
  const fresh = Math.round(newShare * total);
  const adjacent = Math.max(0, total - familiar - fresh);
  return { familiar, adjacent, fresh };
}

export function humanMix(discovery: number): string {
  const familiar = Math.round((0.8 - 0.6 * discovery) * 100);
  const fresh = 100 - familiar;
  return `${familiar}% familiar · ${fresh}% new`;
}

function pick(pool: Song[], n: number, used: Set<string>): Song[] {
  const out: Song[] = [];
  for (const s of pool) {
    if (out.length >= n) break;
    if (used.has(s.id)) continue;
    out.push(s);
    used.add(s.id);
  }
  return out;
}

/**
 * Generate a discovery session queue.
 */
export function buildSession(
  moodId: string | null,
  moodLabel: string,
  discoveryLevel: number,
  length = 12,
): SessionPlan {
  const mood = moodId ? MOOD_BY_ID[moodId] : null;
  const energy = mood ? mood.energy : 0.5;
  const language = mood?.languageHint ?? "Any";

  // rank the whole catalog by mood fit for this request
  const ranked = [...SONGS].sort((a, b) => moodScore(b, moodId, energy) - moodScore(a, moodId, energy));

  const byBucket = (f: Familiarity) => ranked.filter((s) => s.familiarity === f);

  const { familiar, adjacent, fresh } = targetMix(discoveryLevel, length);
  const used = new Set<string>();

  const familiarPicks = pick(byBucket("familiar"), familiar, used);
  const adjacentPicks = pick(byBucket("adjacent"), adjacent, used);
  const freshPicks = pick(byBucket("new"), fresh, used);

  // Interleave so the session breathes: comfort track, then a discovery, etc.
  const buckets = [familiarPicks, adjacentPicks, freshPicks];
  const woven: Song[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const b of buckets) {
      const next = b.shift();
      if (next) {
        woven.push(next);
        added = true;
      }
    }
  }

  // top up if we came short (small catalog)
  if (woven.length < length) {
    for (const s of ranked) {
      if (woven.length >= length) break;
      if (!used.has(s.id)) {
        woven.push(s);
        used.add(s.id);
      }
    }
  }

  return {
    input: {
      mood: moodLabel,
      moodId,
      energy,
      language,
      discovery_level: Number(discoveryLevel.toFixed(2)),
      favorite_artists: FAVORITE_ARTISTS,
    },
    queue: woven.slice(0, length).map((s) => s.id),
    mixLabel: humanMix(discoveryLevel),
  };
}

/** songs similar to a given track, not already in `exclude` */
export function similarTo(songId: string, exclude: Set<string>): Song[] {
  const song = SONG_BY_ID[songId];
  if (!song) return [];
  return SONGS.filter((s) => {
    if (s.id === songId || exclude.has(s.id)) return false;
    const sharesArtist =
      s.artist === song.artist ||
      song.similarArtists.includes(s.artist) ||
      s.similarArtists.includes(song.artist);
    const sharedTags = s.tags.filter((t) => song.tags.includes(t)).length;
    const sharedMood = s.moods.some((m) => song.moods.includes(m));
    return sharesArtist || (sharedTags >= 2 && sharedMood);
  }).sort((a, b) => {
    const at = a.tags.filter((t) => song.tags.includes(t)).length;
    const bt = b.tags.filter((t) => song.tags.includes(t)).length;
    return bt - at;
  });
}
