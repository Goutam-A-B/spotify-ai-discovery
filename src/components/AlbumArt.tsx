import { useMemo } from "react";
import type { Song } from "../data/songs";

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
 * Photographic-feeling generative cover art built from each track's colour
 * pair — layered radial "mesh" gradients + a vignette. No copyrighted images.
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
  const background = useMemo(() => {
    const a = hexToRgb(song.colors[0]);
    const b = hexToRgb(song.colors[1]);
    const light = shade(a, 0.35);
    const dark = shade(b, -0.35);
    return [
      `radial-gradient(120% 90% at 18% 12%, ${light} 0%, transparent 55%)`,
      `radial-gradient(120% 110% at 85% 20%, ${shade(a, 0.05)} 0%, transparent 50%)`,
      `radial-gradient(140% 120% at 75% 95%, ${dark} 0%, transparent 55%)`,
      `radial-gradient(120% 120% at 20% 90%, ${shade(b, 0.1)} 0%, transparent 55%)`,
      `linear-gradient(150deg, ${song.colors[0]}, ${song.colors[1]})`,
    ].join(", ");
  }, [song.colors]);

  return (
    <div
      className={"cover" + (playing ? " cover--playing" : "")}
      style={{ width: size, height: size, borderRadius: radius, background }}
    >
      <span className="cover__sheen" />
    </div>
  );
}
