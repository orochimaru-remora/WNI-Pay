import chingSoundUrl from "../sounds/money-ching-ching.mp3";

const SOUND_ENABLED_KEY = "sound_effects_enabled";

class SoundManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SOUND_ENABLED_KEY);
      this.enabled = stored !== null ? stored === "true" : true;
      this.audio = new Audio(chingSoundUrl);
      this.audio.preload = "auto";
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem(SOUND_ENABLED_KEY, String(this.enabled));
    }
    return this.enabled;
  }

  public playTransactionSound() {
    if (!this.enabled || !this.audio) return;
    try {
      this.audio.currentTime = 0;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          // Prevent browser autoplay-policy block errors from crashing
          console.debug("Audio play prevented:", e);
        });
      }
    } catch (e) {
      console.debug("Audio error:", e);
    }
  }
}

export const soundManager = new SoundManager();
