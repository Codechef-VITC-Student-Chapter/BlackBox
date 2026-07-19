// Audio Synthesizer for Retro-SciFi sound effects inside Next.js.
// Honors the global mute state: localStorage.getItem("blackbox_audio_pref") === "unmuted".

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("blackbox_audio_pref") !== "unmuted";
}

export const synth = {
  playClick() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playScanSweep() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playPopup() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playProgress(duration = 0.6) {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playSuccess() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.03, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc1.start();
      osc1.stop(now + 0.1);
      
      // Tone 2
      setTimeout(() => {
        if (isMuted()) return;
        const ctx2 = getAudioContext();
        if (!ctx2) return;
        const osc2 = ctx2.createOscillator();
        const gain2 = ctx2.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx2.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, ctx2.currentTime); // A5
        gain2.gain.setValueAtTime(0.03, ctx2.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.15);
        osc2.start();
        osc2.stop(ctx2.currentTime + 0.15);
      }, 80);

      // Tone 3
      setTimeout(() => {
        if (isMuted()) return;
        const ctx3 = getAudioContext();
        if (!ctx3) return;
        const osc3 = ctx3.createOscillator();
        const gain3 = ctx3.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx3.destination);
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1174.66, ctx3.currentTime); // D6
        gain3.gain.setValueAtTime(0.03, ctx3.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.001, ctx3.currentTime + 0.4);
        osc3.start();
        osc3.stop(ctx3.currentTime + 0.4);
      }, 160);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playError() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playSuccessFanfare() {
    if (isMuted()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C4 to C6
      
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (isMuted()) return;
          const currentCtx = getAudioContext();
          if (!currentCtx) return;
          const osc = currentCtx.createOscillator();
          const gain = currentCtx.createGain();
          osc.connect(gain);
          gain.connect(currentCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, currentCtx.currentTime);
          gain.gain.setValueAtTime(0.02, currentCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, currentCtx.currentTime + 0.4);
          
          osc.start();
          osc.stop(currentCtx.currentTime + 0.4);
        }, idx * 100);
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }
};
