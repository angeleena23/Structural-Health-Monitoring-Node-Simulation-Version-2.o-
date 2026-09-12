class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.8;
  private activeRedOscillator: OscillatorNode | null = null;
  private redTimer: number | null = null;
  private unlocked: boolean = false;

  constructor() {
    this.attachUnlockListeners();
  }

  private attachUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.unlocked = true;
        });
      } else if (this.ctx && this.ctx.state === 'running') {
        this.unlocked = true;
      }
    };

    ['click', 'keydown', 'touchstart', 'mousedown'].forEach((event) => {
      window.addEventListener(event, unlock, { once: true });
    });
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted && this.activeRedOscillator) {
      this.stopRedAlarm();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // 1-second Yellow Caution Alert: Clean double-beep tone (880 Hz Sine wave pulse pair)
  public playYellowBeep() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const masterVol = 0.18 * this.volume;

      // Pulse 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.exponentialRampToValueAtTime(masterVol, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Pulse 2 (0.45s to 0.85s)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.45);
      gain2.gain.setValueAtTime(0.01, now + 0.45);
      gain2.gain.exponentialRampToValueAtTime(masterVol, now + 0.50);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.45);
      osc2.stop(now + 0.85);
    } catch {
      // Ignore audio restrictions
    }
  }

  // 5-second Red Danger Alert: Emergency dual siren buzzer (520 Hz / 680 Hz alternating)
  public playRedAlarm() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stopRedAlarm();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      // Alternating 10 pulses over 5 seconds
      for (let i = 0; i < 10; i++) {
        const t = now + i * 0.5;
        osc.frequency.setValueAtTime(i % 2 === 0 ? 520 : 680, t);
      }

      const masterVol = 0.16 * this.volume;
      gain.gain.setValueAtTime(masterVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 5.0);

      this.activeRedOscillator = osc;
      this.redTimer = window.setTimeout(() => {
        this.activeRedOscillator = null;
        this.redTimer = null;
      }, 5000);
    } catch {
      // Ignore audio restrictions
    }
  }

  public stopRedAlarm() {
    if (this.activeRedOscillator) {
      try {
        this.activeRedOscillator.stop();
      } catch {
        // Safe catch
      }
      this.activeRedOscillator = null;
    }
    if (this.redTimer) {
      clearTimeout(this.redTimer);
      this.redTimer = null;
    }
  }
}

export const audioEngine = new AudioSynthesizer();
