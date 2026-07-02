/**
 * A tiny generative audio engine.
 *
 * We can't (and shouldn't) bundle real copyrighted tracks in a prototype, so
 * every "song" plays a soft, mood-tuned ambient pad + gentle arpeggio built
 * from its chord data. The point is that the play/pause/skip controls are
 * genuinely wired to sound — nothing here is fake.
 */

type ChordSpec = { root: number; chord: number[] };

function midiToFreq(baseHz: number, semitones: number): number {
  return baseHz * Math.pow(2, semitones / 12);
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private voices: OscillatorNode[] = [];
  private arpTimer: number | null = null;
  private current: ChordSpec | null = null;
  private _muted = false;
  private _volume = 0.22;
  private started = false;

  get muted() {
    return this._muted;
  }

  /** must be called from a user gesture (browsers block audio otherwise) */
  private ensureContext() {
    if (this.ctx) return;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 900;
    this.filter.Q.value = 0.7;

    this.master = this.ctx.createGain();
    this.master.gain.value = 0;

    // slow filter sweep for movement
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.value = 0.06;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 350;
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    this.filter.connect(this.master);
    this.master.connect(this.ctx.destination);
  }

  private stopVoices() {
    for (const v of this.voices) {
      try {
        v.stop();
        v.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.voices = [];
    if (this.arpTimer !== null) {
      window.clearInterval(this.arpTimer);
      this.arpTimer = null;
    }
  }

  /** load a chord and start playing it (fades in) */
  play(spec: ChordSpec) {
    this.ensureContext();
    if (!this.ctx || !this.master || !this.filter) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    this.current = spec;
    this.started = true;
    this.stopVoices();

    const now = this.ctx.currentTime;

    // ---- sustained pad from the chord tones ----
    spec.chord.forEach((semi, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = midiToFreq(spec.root, semi);

      const g = this.ctx!.createGain();
      const level = i === 0 ? 0.5 : 0.22 / Math.sqrt(i);
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(level, now + 1.4);

      // gentle detune shimmer
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * (3 + i);

      osc.connect(g);
      g.connect(this.filter!);
      osc.start();
      this.voices.push(osc);
    });

    // ---- soft arpeggio pluck loop for a sense of melody ----
    const arpNotes = spec.chord.map((s) => midiToFreq(spec.root * 2, s));
    let step = 0;
    this.arpTimer = window.setInterval(() => {
      if (!this.ctx || !this.filter || this._muted) {
        step++;
        return;
      }
      const t = this.ctx.currentTime;
      const pluck = this.ctx.createOscillator();
      pluck.type = "sine";
      pluck.frequency.value = arpNotes[step % arpNotes.length];
      const pg = this.ctx.createGain();
      pg.gain.setValueAtTime(0.0001, t);
      pg.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      pluck.connect(pg);
      pg.connect(this.filter);
      pluck.start(t);
      pluck.stop(t + 1.0);
      step++;
    }, 620);

    this.applyMasterTarget(0.9);
  }

  /** fade the pad down but keep the current chord loaded */
  pause() {
    if (!this.ctx || !this.master) return;
    this.applyMasterTarget(0);
  }

  /** resume the currently loaded chord */
  resume() {
    if (!this.current) return;
    if (!this.started) {
      this.play(this.current);
      return;
    }
    this.ensureContext();
    if (this.ctx?.state === "suspended") this.ctx.resume();
    // if voices were torn down, rebuild them
    if (this.voices.length === 0) {
      this.play(this.current);
    } else {
      this.applyMasterTarget(0.9);
    }
  }

  private applyMasterTarget(fraction: number) {
    if (!this.ctx || !this.master) return;
    const target = this._muted ? 0 : this._volume * fraction;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + 0.4);
  }

  setMuted(m: boolean) {
    this._muted = m;
    this.applyMasterTarget(this.voices.length ? 0.9 : 0);
  }

  toggleMuted() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  stopAll() {
    this.stopVoices();
    this.current = null;
    this.started = false;
    if (this.master && this.ctx) this.master.gain.value = 0;
  }
}

export const audioEngine = new AudioEngine();
