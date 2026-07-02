/**
 * Thin wrapper around a single <audio> element that streams the real 30-second
 * preview URLs fetched from the music APIs. Cross-origin previews play fine in a
 * media element without CORS.
 */
class PreviewPlayer {
  readonly el: HTMLAudioElement;
  private currentSrc = "";

  constructor() {
    this.el = typeof Audio !== "undefined" ? new Audio() : ({} as HTMLAudioElement);
    this.el.preload = "auto";
    // No crossOrigin: we only stream the preview, never read its samples, so
    // this plays regardless of whether the CDN sends CORS headers.
    this.el.volume = 0.72;
  }

  load(url: string) {
    if (this.currentSrc !== url) {
      this.currentSrc = url;
      this.el.src = url;
      this.el.load();
    }
  }

  async play() {
    try {
      await this.el.play();
    } catch {
      /* autoplay blocked until a user gesture — ignored */
    }
  }

  pause() {
    try {
      this.el.pause();
    } catch {
      /* noop */
    }
  }

  seek(seconds: number) {
    try {
      this.el.currentTime = seconds;
    } catch {
      /* not seekable yet */
    }
  }

  setMuted(m: boolean) {
    this.el.muted = m;
  }
}

export const previewPlayer = new PreviewPlayer();
