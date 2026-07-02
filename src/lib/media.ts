import type { Song } from "../data/songs";

/**
 * Runtime media enrichment.
 *
 * We can't (and shouldn't) bundle copyrighted audio or artwork, so for each
 * track we look up the *real* album cover, artist photo, and 30-second preview
 * from public music APIs (Deezer first — it also returns artist photos — then
 * Apple's iTunes Search as a fallback). Both are queried via JSONP so there's
 * no backend, no API key, and it deploys as a static site.
 *
 * Everything degrades gracefully: if a lookup fails, the UI keeps its gradient
 * cover and the synth audio bed, so the prototype never breaks.
 */

export interface Media {
  cover: string | null;
  artistImage: string | null;
  preview: string | null;
}

/* undefined = not fetched yet · null = fetched, nothing found · Media = data */
const cache = new Map<string, Media | null>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeMedia(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getMedia(id: string): Media | null | undefined {
  return cache.get(id);
}

/* ---------- JSONP ---------- */
let seq = 0;
function jsonp<T>(baseUrl: string, timeoutMs = 6500): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `__media_cb_${Date.now()}_${seq++}`;
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}callback=${cb}`;
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      settled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[cb];
      script.remove();
      window.clearTimeout(timer);
    };
    const timer = window.setTimeout(() => {
      if (!settled) {
        cleanup();
        reject(new Error("jsonp timeout"));
      }
    }, timeoutMs);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[cb] = (data: T) => {
      if (!settled) {
        cleanup();
        resolve(data);
      }
    };
    script.onerror = () => {
      if (!settled) {
        cleanup();
        reject(new Error("jsonp error"));
      }
    };
    script.src = url;
    document.body.appendChild(script);
  });
}

/* ---------- providers ---------- */
/* eslint-disable @typescript-eslint/no-explicit-any */
async function fromDeezer(artist: string, title: string): Promise<Media | null> {
  const q = encodeURIComponent(`${artist} ${title}`);
  const url = `https://api.deezer.com/search?q=${q}&limit=5&output=jsonp`;
  try {
    const res: any = await jsonp(url);
    const list: any[] = res?.data ?? [];
    const t = list.find((x) => x?.preview) ?? list[0];
    if (!t) return null;
    return {
      cover: t.album?.cover_xl || t.album?.cover_big || t.album?.cover_medium || null,
      artistImage: t.artist?.picture_big || t.artist?.picture_medium || null,
      preview: t.preview || null,
    };
  } catch {
    return null;
  }
}

async function fromItunes(artist: string, title: string): Promise<Media | null> {
  const term = encodeURIComponent(`${artist} ${title}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`;
  try {
    const res: any = await jsonp(url);
    const list: any[] = res?.results ?? [];
    const r = list.find((x) => x?.previewUrl) ?? list[0];
    if (!r) return null;
    const cover: string | null = r.artworkUrl100
      ? String(r.artworkUrl100).replace("100x100bb", "600x600bb")
      : null;
    return { cover, artistImage: null, preview: r.previewUrl || null };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function lookup(song: Song): Promise<Media | null> {
  // iTunes first: reliable JSONP, real artwork + 30s previews for the catalog.
  const i = await fromItunes(song.artist, song.title);
  if (i && i.cover && i.preview) return i;
  // Deezer as a fallback (also fills in a real artist photo when available).
  const d = await fromDeezer(song.artist, song.title);
  if (!i && !d) return null;
  return {
    cover: i?.cover || d?.cover || null,
    artistImage: d?.artistImage || null,
    preview: i?.preview || d?.preview || null,
  };
}

/* ---------- localStorage cache ---------- */
const LS_PREFIX = "media:v1:";
function readLS(id: string): Media | null | undefined {
  try {
    const raw = localStorage.getItem(LS_PREFIX + id);
    if (raw === null) return undefined;
    return JSON.parse(raw) as Media | null;
  } catch {
    return undefined;
  }
}
function writeLS(id: string, m: Media | null) {
  try {
    localStorage.setItem(LS_PREFIX + id, JSON.stringify(m));
  } catch {
    /* storage full / disabled — ignore */
  }
}

/** Kick off enrichment for a song (idempotent, deduped, cached). */
export function ensureMedia(song: Song) {
  const id = song.id;
  if (cache.has(id) || inflight.has(id)) return;

  const stored = readLS(id);
  if (stored !== undefined) {
    cache.set(id, stored);
    emit();
    return;
  }

  const p = lookup(song)
    .then((m) => {
      cache.set(id, m);
      writeLS(id, m);
    })
    .catch(() => {
      cache.set(id, null);
    })
    .finally(() => {
      inflight.delete(id);
      emit();
    });
  inflight.set(id, p);
}
