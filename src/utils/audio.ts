const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

type MusicType = 'title' | 'lobby' | 'identity' | 'skills' | 'projects' | 'career' | 'achievements';

const MUSIC_CONFIG: Record<MusicType, { baseFreq: number; type: OscillatorType; detune?: number; lfoRate?: number; lfoDepth?: number }> = {
  title: { baseFreq: 55, type: 'sawtooth', lfoRate: 0.3, lfoDepth: 5 },
  lobby: { baseFreq: 65.41, type: 'sine', lfoRate: 0.1, lfoDepth: 2 },
  identity: { baseFreq: 49, type: 'triangle', lfoRate: 0.2, lfoDepth: 3 },
  skills: { baseFreq: 58.27, type: 'sawtooth', lfoRate: 0.15, lfoDepth: 4 },
  projects: { baseFreq: 73.42, type: 'square', lfoRate: 0.25, lfoDepth: 2 },
  career: { baseFreq: 61.74, type: 'triangle', lfoRate: 0.08, lfoDepth: 3 },
  achievements: { baseFreq: 82.41, type: 'sine', lfoRate: 0.12, lfoDepth: 1 },
};

const SFX_CONFIG: Record<string, { freq: number; duration: number; type: OscillatorType; slide?: number }> = {
  interact: { freq: 660, duration: 0.08, type: 'square' },
  unlock: { freq: 880, duration: 0.4, type: 'sine', slide: 1320 },
  door: { freq: 220, duration: 0.2, type: 'sawtooth', slide: 110 },
  transition: { freq: 440, duration: 0.3, type: 'triangle', slide: 660 },
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentOscs: OscillatorNode[] = [];
  private currentLfo: OscillatorNode | null = null;
  private currentLfoGain: GainNode | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.ctx = new AC();
    if (!this.ctx) return;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.12;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.4;
    this.sfxGain.connect(this.masterGain);

    this.initialized = true;
  }

  private ensureInit(): void {
    if (!this.initialized) this.init();
  }

  playMusic(type: MusicType): void {
    this.ensureInit();
    this.stopMusic();
    if (!this.ctx || !this.musicGain) return;

    const config = MUSIC_CONFIG[type];
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    osc1.type = config.type;
    osc1.frequency.setValueAtTime(config.baseFreq, now);
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.5, now);
    osc1.connect(gain1);
    gain1.connect(this.musicGain);
    osc1.start();
    this.currentOscs.push(osc1);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(config.baseFreq * 2, now);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.15, now);
    osc2.connect(gain2);
    gain2.connect(this.musicGain);
    osc2.start();
    this.currentOscs.push(osc2);

    if (config.lfoRate) {
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(config.lfoRate, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(config.lfoDepth ?? 2, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfo.start();
      this.currentLfo = lfo;
      this.currentLfoGain = lfoGain;
    }
  }

  stopMusic(): void {
    this.currentOscs.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    this.currentOscs = [];
    if (this.currentLfo) {
      try { this.currentLfo.stop(); } catch {}
      this.currentLfo = null;
    }
    if (this.currentLfoGain) {
      this.currentLfoGain.disconnect();
      this.currentLfoGain = null;
    }
  }

  playSfx(type: 'interact' | 'unlock' | 'door' | 'transition'): void {
    this.ensureInit();
    if (!this.ctx || !this.sfxGain) return;
    const config = SFX_CONFIG[type];
    if (!config) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = config.type;
    osc.frequency.setValueAtTime(config.freq, now);
    if (config.slide) {
      osc.frequency.exponentialRampToValueAtTime(config.slide, now + config.duration);
    }
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + config.duration);
  }

  setMusicVolume(vol: number): void {
    if (this.musicGain) this.musicGain.gain.value = vol;
  }

  setSfxVolume(vol: number): void {
    if (this.sfxGain) this.sfxGain.gain.value = vol;
  }
}

export const audioManager = new AudioManager();
