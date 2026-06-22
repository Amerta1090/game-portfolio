const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusic: OscillatorNode | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.ctx = new AC();
    if (!this.ctx) return;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.15;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.masterGain);

    this.initialized = true;
  }

  private ensureInit(): void {
    if (!this.initialized) this.init();
  }

  playMusic(_type: 'title' | 'lobby' | 'identity' | 'skills' | 'projects'): void {
    this.ensureInit();
    this.stopMusic();
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 55;
    osc.connect(this.musicGain);
    osc.start();
    this.currentMusic = osc;
  }

  stopMusic(): void {
    if (this.currentMusic) {
      try { this.currentMusic.stop(); } catch {}
      this.currentMusic = null;
    }
  }

  playSfx(type: 'interact' | 'unlock' | 'door' | 'transition'): void {
    this.ensureInit();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = type === 'unlock' ? 880 : 440;
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  setMusicVolume(vol: number): void {
    if (this.musicGain) this.musicGain.gain.value = vol;
  }

  setSfxVolume(vol: number): void {
    if (this.sfxGain) this.sfxGain.gain.value = vol;
  }
}

export const audioManager = new AudioManager();
