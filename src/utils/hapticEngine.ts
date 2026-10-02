/**
 * Advanced Cross-Platform Haptic & Somatic Disruption Engine
 * Handles continuous long-press vibration on Android (navigator.vibrate)
 * and iOS (WebKit / iPhone Taptic Engine audio-tactile sub-bass resonance synthesis).
 */

class HapticEngine {
  private audioCtx: AudioContext | null = null;
  private isHolding = false;
  private loopTimeout: any = null;
  private currentPattern: number[] = [];

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Synthesizes physical sub-bass tactile pulse for iOS Taptic Engine & speaker rumble
   */
  private playTactilePulse(durationMs: number) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      // 1. Sub-bass oscillator at 52Hz (resonant frequency for mobile chassis vibration)
      const osc = ctx.createOscillator();
      osc.type = 'triangle'; // Richer odd harmonics than sine for stronger tactile feedback
      osc.frequency.setValueAtTime(52, now);
      // Pitch drop adds physical punch
      osc.frequency.exponentialRampToValueAtTime(38, now + durationSec);

      // 2. High impact transient oscillator for physical click feel (iOS Taptic imitation)
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(140, now);
      clickOsc.frequency.exponentialRampToValueAtTime(40, now + Math.min(0.04, durationSec));

      // 3. Distortion / Saturation node for maximum diaphragm displacement
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.95, now + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(0.035, durationSec));

      // 4. Low-pass filter to keep sound deeply visceral and tactile
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      osc.connect(gainNode);
      clickOsc.connect(clickGain);

      gainNode.connect(filter);
      clickGain.connect(filter);
      filter.connect(ctx.destination);

      osc.start(now);
      clickOsc.start(now);

      osc.stop(now + durationSec + 0.05);
      clickOsc.stop(now + Math.min(0.05, durationSec + 0.01));
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Triggers a single haptic pattern loop
   */
  private executePatternStep(pattern: number[]) {
    if (!this.isHolding) return;

    // 1. Android / Standard Vibration API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }

    // 2. iOS / WebKit Taptic Resonance Simulation
    // Pattern array format: [vibrateMs, pauseMs, vibrateMs, pauseMs, ...]
    let accumulatedTime = 0;
    for (let i = 0; i < pattern.length; i++) {
      const duration = pattern[i];
      if (i % 2 === 0) {
        // Vibrate step
        if (accumulatedTime === 0) {
          this.playTactilePulse(duration);
        } else {
          setTimeout(() => {
            if (this.isHolding) {
              this.playTactilePulse(duration);
            }
          }, accumulatedTime);
        }
      }
      accumulatedTime += duration;
    }

    // Calculate total pattern cycle duration
    const totalCycleTime = pattern.reduce((acc, val) => acc + val, 0);

    // Schedule next repetition if still holding
    this.loopTimeout = setTimeout(() => {
      if (this.isHolding) {
        this.executePatternStep(pattern);
      }
    }, Math.max(100, totalCycleTime));
  }

  /**
   * Start continuous haptic disruption while holding
   */
  public start(pattern: number[]) {
    this.stop(); // Clear any existing cycle
    this.isHolding = true;
    this.currentPattern = pattern;

    // Unlock audio context on user interaction
    try {
      this.getAudioContext();
    } catch (e) {}

    this.executePatternStep(pattern);
  }

  /**
   * Stop continuous haptic disruption when released
   */
  public stop() {
    this.isHolding = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(0);
      } catch (e) {}
    }
  }

  /**
   * Single click / tap feedback
   */
  public triggerImpact(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
    const ms = intensity === 'light' ? 25 : intensity === 'medium' ? 50 : 100;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
    this.playTactilePulse(ms);
  }

  public getIsHolding(): boolean {
    return this.isHolding;
  }
}

export const hapticEngine = new HapticEngine();
