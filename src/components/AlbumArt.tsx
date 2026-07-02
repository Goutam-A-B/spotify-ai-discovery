import type { Song } from "../data/songs";

function initials(title: string): string {
  const words = title.replace(/[("'].*$/, "").trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generative cover art. We can't ship real album covers in a prototype, so
 * each track gets a consistent gradient + vibe emoji + initials.
 */
export function AlbumArt({
  song,
  size = 56,
  radius = 6,
  playing = false,
}: {
  song: Song;
  size?: number;
  radius?: number;
  playing?: boolean;
}) {
  const [a, b] = song.colors;
  return (
    <div
      className={"cover" + (playing ? " cover--playing" : "")}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${a}, ${b})`,
      }}
    >
      <span className="cover__emoji" style={{ fontSize: size * 0.34 }}>
        {song.emoji}
      </span>
      <span className="cover__initials" style={{ fontSize: size * 0.16 }}>
        {initials(song.title)}
      </span>
    </div>
  );
}
