/**
 * Advanced Cross-Platform Haptic & Somatic Disruption Engine
 * Handles continuous & pulsed physical vibration on Android (navigator.vibrate)
 * and Web Audio sub-bass tactile resonance + speaker diaphragm displacement for iOS & Android.
 */

class HapticEngine {
  private audioCtx: AudioContext | null = null;
  private isHolding = false;
  private loopTimeout: any = null;
  private stepTimeouts: any[] = [];
  private currentPattern: number[] = [];

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Synthesizes physical acoustic-tactile pulse for mobile phone speaker resonance & chassis vibration
   */
  public playTactilePulse(durationMs: number) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const durationSec = Math.max(0.04, durationMs / 1000);

      // 1. Sub-bass oscillator (52Hz -> 38Hz) for tactile diaphragm push
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(54, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + durationSec);

      // 2. Low-mid harmonic oscillator (140Hz -> 65Hz) to ensure speaker audible/tactile rumble on phone chassis
      const midOsc = ctx.createOscillator();
      midOsc.type = 'triangle';
      midOsc.frequency.setValueAtTime(140, now);
      midOsc.frequency.exponentialRampToValueAtTime(65, now + durationSec);

      // 3. Click transient for sharp somatic impulse
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sawtooth';
      clickOsc.frequency.setValueAtTime(180, now);
      clickOsc.frequency.exponentialRampToValueAtTime(45, now + Math.min(0.035, durationSec));

      // 4. Gains & lowpass filtering
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.85, now + 0.006);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.45, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(0.03, durationSec));

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      osc.connect(gainNode);
      midOsc.connect(gainNode);
      clickOsc.connect(clickGain);
      gainNode.connect(filter);
      clickGain.connect(filter);
      filter.connect(ctx.destination);

      osc.start(now);
      midOsc.start(now);
      clickOsc.start(now);

      const stopTime = now + durationSec + 0.05;
      osc.stop(stopTime);
      midOsc.stop(stopTime);
      clickOsc.stop(stopTime);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Triggers Android physical vibration safely with pattern & duration fallback
   */
  public triggerAndroidVibration(pattern: number[] | number): boolean {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        let ok = navigator.vibrate(pattern);
        if (!ok && Array.isArray(pattern) && pattern.length > 0) {
          // Fallback to first pulse if pattern array was rejected
          ok = navigator.vibrate(pattern[0] || 200);
        }
        return !!ok;
      } catch {
        try {
          if (Array.isArray(pattern) && pattern.length > 0) {
            return !!navigator.vibrate(pattern[0]);
          } else if (typeof pattern === 'number') {
            return !!navigator.vibrate(pattern);
          }
        } catch {}
      }
    }
    return false;
  }

  /**
   * Triggers a single haptic pattern loop step
   */
  private executePatternStep(pattern: number[]) {
    if (!this.isHolding) return;

    // 1. Android Physical Vibration
    this.triggerAndroidVibration(pattern);

    // 2. Tactile Audio Resonance for speaker chassis
    let accumulatedTime = 0;
    for (let i = 0; i < pattern.length; i++) {
      const duration = pattern[i];
      if (i % 2 === 0) {
        if (accumulatedTime === 0) {
          this.playTactilePulse(duration);
        } else {
          const timeoutId = setTimeout(() => {
            if (this.isHolding) {
              this.playTactilePulse(duration);
            }
          }, accumulatedTime);
          this.stepTimeouts.push(timeoutId);
        }
      }
      accumulatedTime += duration;
    }

    const totalCycleTime = pattern.reduce((acc, val) => acc + val, 0);

    // Schedule next cycle loop while holding/active
    this.loopTimeout = setTimeout(() => {
      if (this.isHolding) {
        this.executePatternStep(pattern);
      }
    }, Math.max(140, totalCycleTime));
  }

  /**
   * Start continuous haptic disruption while holding or toggled active
   */
  public start(pattern: number[]) {
    this.stop(); // Clear any existing cycle
    this.isHolding = true;
    this.currentPattern = pattern;

    // Pre-warm audio context
    try {
      this.getAudioContext();
    } catch {}

    // Execute first pattern step (executes both physical vibration and acoustic tactile pulse)
    this.executePatternStep(pattern);
  }

  /**
   * Stop continuous haptic disruption
   */
  public stop() {
    this.isHolding = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
    this.stepTimeouts.forEach(t => clearTimeout(t));
    this.stepTimeouts = [];

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  /**
   * Single click / tap feedback
   */
  public triggerImpact(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
    const ms = intensity === 'light' ? 35 : intensity === 'medium' ? 70 : 140;
    this.triggerAndroidVibration(ms);
    this.playTactilePulse(ms);
  }

  /**
   * Quick test for device vibration hardware with feedback result
   */
  public testVibration(durationMs: number = 400): { supported: boolean; success: boolean } {
    const supported = this.isSupported();
    let success = false;
    if (supported) {
      success = this.triggerAndroidVibration(durationMs);
    }
    this.playTactilePulse(durationMs);
    return { supported, success };
  }

  public getIsHolding(): boolean {
    return this.isHolding;
  }
}

export const hapticEngine = new HapticEngine();
