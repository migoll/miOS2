import type { SoundName } from "../types/index.js";

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isEnabled = true;
  private volume = 0.7;
  private lastPlayTimes: Map<string, number> = new Map();
  private debounceTime = 100; // ms

  constructor() {
    this.loadSounds();
  }

  private async loadSounds() {
    const soundUrls: Record<SoundName, string> = {
      click: this.generateTone(800, 0.1, "sine"),
      open: this.generateTone(600, 0.2, "triangle"),
      close: this.generateTone(400, 0.15, "triangle"),
      minimize: this.generateTone(500, 0.1, "sawtooth"),
      error: this.generateTone(300, 0.3, "square"),
      hover: this.generateTone(1000, 0.05, "sine"),
      drop: this.generateTone(700, 0.2, "triangle"),
      select: this.generateTone(900, 0.05, "sine"),
      menu_open: this.generateTone(750, 0.1, "triangle"),
      menu_close: this.generateTone(650, 0.08, "triangle"),
    };

    for (const [name, url] of Object.entries(soundUrls)) {
      try {
        const audio = new Audio(url);
        audio.volume = this.volume * 0.3; // Keep sounds subtle
        audio.preload = "auto";
        this.sounds.set(name, audio);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    }
  }

  private generateTone(
    frequency: number,
    duration: number,
    waveType: OscillatorType
  ): string {
    // Create a simple synthetic tone using Web Audio API and convert to data URL
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    const buffer = new ArrayBuffer(samples * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (waveType) {
        case "sine":
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case "triangle":
          sample = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
          break;
        case "sawtooth":
          sample = 2 * ((frequency * t) % 1) - 1;
          break;
        case "square":
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(t / 0.01, (duration - t) / 0.05, 1);
      sample *= envelope * 0.1; // Keep volume low

      // Convert to 16-bit PCM
      const pcmSample = Math.max(-32768, Math.min(32767, sample * 32767));
      view.setInt16(i * 2, pcmSample, true);
    }

    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const headerView = new DataView(wavHeader);

    // WAV file header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        headerView.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    headerView.setUint32(4, 36 + samples * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    headerView.setUint32(16, 16, true);
    headerView.setUint16(20, 1, true); // PCM
    headerView.setUint16(22, 1, true); // Mono
    headerView.setUint32(24, sampleRate, true);
    headerView.setUint32(28, sampleRate * 2, true);
    headerView.setUint16(32, 2, true);
    headerView.setUint16(34, 16, true);
    writeString(36, "data");
    headerView.setUint32(40, samples * 2, true);

    // Combine header and data
    const fullBuffer = new Uint8Array(44 + samples * 2);
    fullBuffer.set(new Uint8Array(wavHeader), 0);
    fullBuffer.set(new Uint8Array(buffer), 44);

    // Create blob and data URL
    const blob = new Blob([fullBuffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  }

  play(soundName: SoundName): void {
    if (!this.isEnabled) return;

    const now = Date.now();
    const lastPlayTime = this.lastPlayTimes.get(soundName) || 0;

    // Debounce rapid plays of the same sound
    if (now - lastPlayTime < this.debounceTime) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play().catch(() => {
          // Silently handle play failures (e.g., user hasn't interacted with page)
        });
        this.lastPlayTimes.set(soundName, now);
      } catch (error) {
        // Silently handle errors
      }
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      sound.volume = this.volume * 0.3;
    });
  }

  isLoaded(): boolean {
    return this.sounds.size > 0;
  }
}

export const soundManager = new SoundManager();
