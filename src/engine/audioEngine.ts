class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private activeRedOscillator: OscillatorNode | null = null;
  private redTimer: number | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
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

  // 1-second Yellow Caution Beep (880 Hz Sine wave pulse)
  public playYellowBeep() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

      // Soft envelope (0.2s pulse, 0.1s silence, 0.2s pulse)
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 1.0);
    } catch {
      // Ignore web audio autoplay restrictions if uninitialized
    }
  }

  // 5-second Red Danger Emergency Buzzer (Dual alternating 520Hz/650Hz square waves)
  public playRedAlarm() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Stop any already playing red alarm to avoid overlap
      this.stopRedAlarm();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      
      // Frequency siren modulation over 5 seconds
      const now = this.ctx.currentTime;
      for (let i = 0; i < 10; i++) {
        const t = now + i * 0.5;
        osc.frequency.setValueAtTime(i % 2 === 0 ? 520 : 650, t);
      }

      gain.gain.setValueAtTime(0.12, now);
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
      // Ignore browser audio restrictions
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
