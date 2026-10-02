/**
 * Web Audio Isochronic Tone Generator for Neuroregulation
 * Generates smooth, click-free amplitude-modulated isochronic pulses with optional soothing ambient noise.
 */

export interface IsochronicPreset {
  id: string;
  name: string;
  nameEn: string;
  category: 'theta' | 'alpha' | 'delta' | 'gamma' | 'schumann' | 'smr';
  pulseRate: number; // in Hz (isochronic rate)
  carrierFreq: number; // in Hz (base pitch)
  description: string;
  descriptionEn: string;
  benefits: string[];
  benefitsEn: string[];
  recommendedDuration: string;
  recommendedDurationEn: string;
  color: string;
  icon: string;
}

export const ISOCHRONIC_PRESETS: IsochronicPreset[] = [
  {
    id: 'theta-calm',
    name: 'Theta 4.5 Hz — Rescate & Desescalada',
    nameEn: 'Theta 4.5 Hz — Deep Reset & Recovery',
    category: 'theta',
    pulseRate: 4.5,
    carrierFreq: 136.1, // Earth Om frequency, deeply grounding
    description: 'Pulsación Theta diseñada para desactivar la sobrecarga simpática (lucha/huida), aliviar estados de shutdown o burnout y guiar al sistema nervioso a descanso parasimpático profundo.',
    descriptionEn: 'Theta pulse designed to disarm sympathetic fight/flight overload, soothe shutdown/burnout states, and guide the nervous system into deep parasympathetic recovery.',
    benefits: [
      'Alivio de sobrecarga sensorial extrema',
      'Desescalada de ansiedad aguda y rumiación',
      'Facilita la recuperación post-meltdown / post-shutdown',
      'Induce calma somática profunda'
    ],
    benefitsEn: [
      'Relief from extreme sensory overload',
      'Acute anxiety and rumination de-escalation',
      'Aids post-meltdown / post-shutdown recovery',
      'Induces deep somatic calm'
    ],
    recommendedDuration: '10 – 15 min',
    recommendedDurationEn: '10 – 15 min',
    color: '#818cf8', // Indigo
    icon: '🌊'
  },
  {
    id: 'alpha-flow',
    name: 'Alpha 10.0 Hz — Calma Alerta & Enfoque',
    nameEn: 'Alpha 10.0 Hz — Calm Focus & Flow',
    category: 'alpha',
    pulseRate: 10.0,
    carrierFreq: 432.0, // Natural harmonic tuning
    description: 'Frecuencia Alpha para entrar en estado de flujo sereno ("calm alertness"). Reduce el ruido mental y la hipersensibilidad al entorno sin provocar somnolencia.',
    descriptionEn: 'Alpha frequency for entering calm flow. Quiets mental chatter and environmental hypersensitivity without drowsiness.',
    benefits: [
      'Transición suave entre tareas difíciles',
      'Filtro de hiperreactividad sensorial ambiental',
      'Enfoque sin tensión ni hiperactivación',
      'Regulación del estado de ánimo'
    ],
    benefitsEn: [
      'Smooth transition between demanding tasks',
      'Filters environmental sensory hyperreactivity',
      'Tension-free relaxed focus',
      'Mood and emotional stabilization'
    ],
    recommendedDuration: '15 – 20 min',
    recommendedDurationEn: '15 – 20 min',
    color: '#22d3ee', // Cyan
    icon: '✨'
  },
  {
    id: 'delta-sleep',
    name: 'Delta 2.5 Hz — Descompresión & Sueño',
    nameEn: 'Delta 2.5 Hz — Somatic Release & Rest',
    category: 'delta',
    pulseRate: 2.5,
    carrierFreq: 174.0, // Solfeggio frequency for somatic tension release
    description: 'Ondas Delta lentas y profundas para liberar tensión física acumulada en mandíbula, hombros y cuello, aliviar el agotamiento neuroquímico e inducir descanso reparador.',
    descriptionEn: 'Deep, slow Delta waves to release muscular tension in jaw, neck, and shoulders, soothing neurochemical fatigue and promoting restorative sleep.',
    benefits: [
      'Alivio de rigidez y tensión muscular por bruxismo',
      'Inducción al sueño profundo y siestas reparadoras',
      'Desconexión segura del hiperestado de alerta',
      'Regeneración celular y descanso neuroquímico'
    ],
    benefitsEn: [
      'Relieves muscular tension from masking and bruxism',
      'Induces deep restorative sleep and naps',
      'Safe release from chronic hypervigilance',
      'Cellular and neurochemical rejuvenation'
    ],
    recommendedDuration: '15 – 30 min',
    recommendedDurationEn: '15 – 30 min',
    color: '#a78bfa', // Purple / Lavender
    icon: '🌙'
  },
  {
    id: 'schumann-earth',
    name: 'Schumann 7.83 Hz — Anclaje & Vago Reset',
    nameEn: 'Schumann 7.83 Hz — Grounding & Vagal Reset',
    category: 'schumann',
    pulseRate: 7.83,
    carrierFreq: 194.18, // Earth Day frequency
    description: 'Frecuencia de resonancia planetaria que sincroniza los ritmos biológicos circadianos. Muy efectiva para disociación, despersonalización y anclaje somático.',
    descriptionEn: 'Planetary resonance frequency syncing biological circadian rhythms. Highly effective for dissociation, depersonalization, and somatic grounding.',
    benefits: [
      'Anclaje del cuerpo ante sensaciones de flotación o desrealización',
      'Estimulación del tono vagal y calma visceral',
      'Sensación de estabilidad y presencia',
      'Reducción del estrés electromagnético percibido'
    ],
    benefitsEn: [
      'Grounds the body against floating or derealization sensations',
      'Stimulates vagal tone and visceral calm',
      'Provides feelings of safety and stability',
      'Reduces perceived sensory hyper-arousal'
    ],
    recommendedDuration: '10 – 20 min',
    recommendedDurationEn: '10 – 20 min',
    color: '#34d399', // Emerald
    icon: '🌍'
  },
  {
    id: 'gamma-adhd',
    name: 'Gamma 40.0 Hz — Claridad TDAH & Lucidez',
    nameEn: 'Gamma 40.0 Hz — ADHD Focus & Clarity',
    category: 'gamma',
    pulseRate: 40.0,
    carrierFreq: 432.0,
    description: 'Pulsos Gamma de 40 Hz científicamente asociados a la coherencia de redes neuronales, aumento de memoria de trabajo, disolución de niebla mental (brain fog) y superación de inercia ejecutiva.',
    descriptionEn: '40 Hz Gamma pulses associated with neural binding, working memory, clearing brain fog, and initiating executive momentum.',
    benefits: [
      'Disolución de niebla mental y fatiga cognitiva',
      'Impulso para romper la parálisis ejecutiva',
      'Sincronización interhemisférica en TDAH / Autismo',
      'Agudeza mental sin agitación'
    ],
    benefitsEn: [
      'Clears mental fog and cognitive fatigue',
      'Momentum boost against executive paralysis',
      'Neural synchronization in ADHD / AuDHD',
      'Sharp mental clarity without restlessness'
    ],
    recommendedDuration: '5 – 15 min',
    recommendedDurationEn: '5 – 15 min',
    color: '#f59e0b', // Amber / Gold
    icon: '⚡'
  },
  {
    id: 'smr-calm',
    name: 'SMR 14.0 Hz — Quietud Motora & Stimming',
    nameEn: 'SMR 14.0 Hz — Motor Stillness & Calm',
    category: 'smr',
    pulseRate: 14.0,
    carrierFreq: 300.0,
    description: 'Ritmo Sensoriomotor (SMR) a 14 Hz para calmar la agitación física motora, reducir tics y canalizar el stimming hacia una autorregulación serena y estable.',
    descriptionEn: 'Sensoriomotor Rhythm (SMR) at 14 Hz to soothe physical motor restlessness, reduce tics, and channel stimming into steady calm.',
    benefits: [
      'Reducción de inquietud física involuntaria',
      'Acompañamiento en momentos de sobreestimulación táctil',
      'Calma corporal manteniendo la mente alerta',
      'Integración sensorial motora'
    ],
    benefitsEn: [
      'Reduces physical restlessness and involuntary twitching',
      'Soothes tactile overstimulation',
      'Body stillness while keeping mind alert',
      'Sensory-motor integration'
    ],
    recommendedDuration: '10 – 15 min',
    recommendedDurationEn: '10 – 15 min',
    color: '#ec4899', // Pink
    icon: '🪷'
  }
];

class IsochronicAudioEngine {
  private ctx: AudioContext | null = null;
  private carrierOsc: OscillatorNode | null = null;
  private pulseGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private isPlaying = false;
  private currentPresetId: string | null = null;
  private masterVolume = 0.5;
  private ambientVolume = 0.2;
  private isAmbientEnabled = true;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentPresetId(): string | null {
    return this.currentPresetId;
  }

  public startPreset(preset: IsochronicPreset) {
    this.stop(); // Stop any ongoing sound

    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Master Output & Analyser
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, now + 0.8);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // 1. CARRIER OSCILLATOR (Pure warm Sine wave)
    this.carrierOsc = ctx.createOscillator();
    this.carrierOsc.type = 'sine';
    this.carrierOsc.frequency.setValueAtTime(preset.carrierFreq, now);

    // 2. PULSE GAIN (Modulated by LFO)
    this.pulseGain = ctx.createGain();
    this.pulseGain.gain.setValueAtTime(0, now);

    // 3. LFO FOR ISOCHRONIC PULSATION
    // We use a sine or custom smooth wave for pulse shape to avoid harsh clicks
    this.lfo = ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.setValueAtTime(preset.pulseRate, now);

    this.lfoGain = ctx.createGain();
    // Offset and scale so gain oscillates smoothly between 0 and 1
    this.lfoGain.gain.setValueAtTime(0.5, now);

    // LFO connection: LFO -> lfoGain -> pulseGain.gain
    // Default base offset of 0.5 + LFO [-0.5, 0.5] = [0.0, 1.0]
    this.pulseGain.gain.setValueAtTime(0.5, now);
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.pulseGain.gain);

    // Connect Carrier -> PulseGain -> MasterGain
    this.carrierOsc.connect(this.pulseGain);
    this.pulseGain.connect(this.masterGain);

    // 4. OPTIONAL SOOTHING AMBIENT DRONE / WARM NOISE
    if (this.isAmbientEnabled) {
      this.startAmbientNoise(ctx, now);
    }

    // Start oscillators
    this.carrierOsc.start(now);
    this.lfo.start(now);

    this.isPlaying = true;
    this.currentPresetId = preset.id;
  }

  private startAmbientNoise(ctx: AudioContext, now: number) {
    try {
      // Create 5 seconds of soothing pink-filtered noise buffer
      const bufferSize = ctx.sampleRate * 5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      this.ambientNoiseSource = ctx.createBufferSource();
      this.ambientNoiseSource.buffer = buffer;
      this.ambientNoiseSource.loop = true;

      // Lowpass filter for warm oceanic sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.4, now);

      this.ambientNoiseSource.connect(filter);
      filter.connect(this.ambientGain);
      if (this.masterGain) {
        this.ambientGain.connect(this.masterGain);
      }

      this.ambientNoiseSource.start(now);
    } catch (e) {
      console.warn('Could not start ambient noise', e);
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 0.05);
    }
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume * 0.4, this.ctx.currentTime + 0.05);
    }
  }

  public toggleAmbient(enabled: boolean) {
    this.isAmbientEnabled = enabled;
    if (!this.isPlaying) return;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(enabled ? this.ambientVolume * 0.4 : 0, this.ctx.currentTime + 0.1);
    }
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.4);

      setTimeout(() => {
        try {
          if (this.carrierOsc) {
            this.carrierOsc.stop();
            this.carrierOsc.disconnect();
            this.carrierOsc = null;
          }
          if (this.lfo) {
            this.lfo.stop();
            this.lfo.disconnect();
            this.lfo = null;
          }
          if (this.ambientNoiseSource) {
            this.ambientNoiseSource.stop();
            this.ambientNoiseSource.disconnect();
            this.ambientNoiseSource = null;
          }
        } catch (e) {}
      }, 450);
    }

    this.isPlaying = false;
    this.currentPresetId = null;
  }
}

export const isochronicAudio = new IsochronicAudioEngine();
