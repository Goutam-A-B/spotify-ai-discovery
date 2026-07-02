import { useMemo, useState } from "react";
import type { Song } from "../data/songs";
import { useMedia } from "../lib/useMedia";

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function shade([r, g, b]: [number, number, number], amt: number): string {
  const f = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return `rgb(${clamp(r + (f - r) * p)}, ${clamp(g + (f - g) * p)}, ${clamp(b + (f - b) * p)})`;
}

/**
 * Real album artwork (fetched at runtime) layered over a generative gradient.
 * The gradient shows while the image loads and if the lookup finds nothing, so
 * covers never pop in as blank boxes.
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
  const media = useMedia(song);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const background = useMemo(() => {
    const a = hexToRgb(song.colors[0]);
    const b = hexToRgb(song.colors[1]);
    return [
      `radial-gradient(120% 90% at 18% 12%, ${shade(a, 0.35)} 0%, transparent 55%)`,
      `radial-gradient(140% 120% at 80% 95%, ${shade(b, -0.3)} 0%, transparent 55%)`,
      `linear-gradient(150deg, ${song.colors[0]}, ${song.colors[1]})`,
    ].join(", ");
  }, [song.colors]);

  const cover = media?.cover;
  const showImg = !!cover && !failed;

  return (
    <div
      className={"cover" + (playing ? " cover--playing" : "")}
      style={{ width: size, height: size, borderRadius: radius, background }}
    >
      {showImg && (
        <img
          className={"cover__img" + (loaded ? " is-loaded" : "")}
          src={cover}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      <span className="cover__sheen" />
    </div>
  );
}
