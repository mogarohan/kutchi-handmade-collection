import { toast as sonnerToast, ExternalToast } from "sonner";

export const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Modern clean "ding" sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.05); 
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); 

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export const toast = {
  ...sonnerToast,
  success: (message: string | React.ReactNode, data?: ExternalToast) => {
    playNotificationSound();
    return sonnerToast.success(message, data);
  },
  error: (message: string | React.ReactNode, data?: ExternalToast) => {
    playNotificationSound();
    return sonnerToast.error(message, data);
  },
  info: (message: string | React.ReactNode, data?: ExternalToast) => {
    playNotificationSound();
    return sonnerToast.info(message, data);
  },
  warning: (message: string | React.ReactNode, data?: ExternalToast) => {
    playNotificationSound();
    return sonnerToast.warning(message, data);
  },
};
