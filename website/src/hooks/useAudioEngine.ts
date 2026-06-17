'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

// Global singletons for audio to prevent multiple contexts across components
let globalCtx: AudioContext | null = null;
let globalAmbientGain: GainNode | null = null;
let globalAmbientSource: AudioBufferSourceNode | null = null;

let globalClickBuffer: AudioBuffer | null = null;
let globalAmbientBuffer: AudioBuffer | null = null;
let globalSuccessBuffer: AudioBuffer | null = null;

let isInitialized = false;
let globalShouldPlayAmbient = false;
let globalBuffersLoaded = false;
let globalIsAmbientMuted = false;
let globalAmbientRetryTimers: number[] = [];

// Simple pub/sub to sync mute state across UI components
const muteListeners = new Set<() => void>();
function notifyMute() {
  muteListeners.forEach(l => l());
}

function scheduleAmbientStartupRetries(attemptStart: () => void) {
  if (typeof window === 'undefined' || globalAmbientRetryTimers.length > 0) return;

  globalAmbientRetryTimers = [250, 1000, 2500, 5000].map((delay) => {
    const timer = window.setTimeout(() => {
      globalAmbientRetryTimers = globalAmbientRetryTimers.filter((activeTimer) => activeTimer !== timer);
      if (!globalShouldPlayAmbient || globalAmbientGain) return;

      if (globalCtx?.state === 'suspended') {
        globalCtx.resume().catch(() => {});
      }

      attemptStart();
    }, delay);

    return timer;
  });
}

type BrowserAudioContext = typeof AudioContext;
type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: BrowserAudioContext;
};

const getAudioContextClass = (): BrowserAudioContext | undefined =>
  window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;

export function useAudioEngine() {
  const [isAmbientMuted, setIsAmbientMuted] = useState(globalIsAmbientMuted);
  const startAmbientRef = useRef<() => void>(() => {});

  // Sync mute state
  useEffect(() => {
    const listener = () => setIsAmbientMuted(globalIsAmbientMuted);
    muteListeners.add(listener);
    return () => { muteListeners.delete(listener); };
  }, []);

  // Initialize audio context only after user interaction
  const initAudio = useCallback(() => {
    if (isInitialized) return;

    if (!globalCtx) {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) return;
      globalCtx = new AudioContextClass();
    }

    if (globalCtx.state === 'suspended') {
      globalCtx.resume().catch(() => {});
    }

    isInitialized = true;
  }, []);

  const startAmbient = useCallback(() => {
    globalShouldPlayAmbient = true;
    initAudio();
    scheduleAmbientStartupRetries(() => startAmbientRef.current());
    if (!globalCtx || !globalAmbientBuffer) return;

    if (globalCtx.state === 'suspended') {
      globalCtx.resume().catch(() => {});
    }

    // Prevent multiple ambient drones
    if (globalAmbientGain) return;

    const ctx = globalCtx;

    const source = ctx.createBufferSource();
    source.buffer = globalAmbientBuffer;
    source.loop = true;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Start silent

    source.connect(masterGain);
    masterGain.connect(ctx.destination);

    source.start();

    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    const targetVolume = globalIsAmbientMuted ? 0 : 0.4;
    masterGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 10);

    globalAmbientGain = masterGain;
    globalAmbientSource = source;
  }, [initAudio]);

  useEffect(() => {
    startAmbientRef.current = startAmbient;
  }, [startAmbient]);

  // Load the audio files globally once
  useEffect(() => {
    if (globalBuffersLoaded) return;

    const loadSounds = async () => {
      try {
        const [clickRes, ambientRes, successRes] = await Promise.all([
          fetch('/assets/audio/click.aac'),
          fetch('/assets/audio/ambient.aac'),
          fetch('/assets/audio/success.aac')
        ]);

        const clickArrayBuffer = await clickRes.arrayBuffer();
        const ambientArrayBuffer = await ambientRes.arrayBuffer();
        const successArrayBuffer = await successRes.arrayBuffer();

        // Ensure context exists before decoding
        if (!globalCtx) {
          const AudioContextClass = getAudioContextClass();
          if (AudioContextClass) {
            globalCtx = new AudioContextClass();
          }
        }

        if (globalCtx) {
          const [clickBuf, ambientBuf, successBuf] = await Promise.all([
            globalCtx.decodeAudioData(clickArrayBuffer),
            globalCtx.decodeAudioData(ambientArrayBuffer),
            globalCtx.decodeAudioData(successArrayBuffer)
          ]);
          globalClickBuffer = clickBuf;
          globalAmbientBuffer = ambientBuf;
          globalSuccessBuffer = successBuf;
          globalBuffersLoaded = true;

          // Re-trigger ambient if it was requested before buffers loaded
          if (globalShouldPlayAmbient && !globalAmbientGain) {
            startAmbient();
          }
        }
      } catch (err) {
        console.error('Failed to load audio files:', err);
      }
    };

    void loadSounds();
  }, [startAmbient]);

  const stopAmbient = useCallback(() => {
    if (!globalCtx || !globalAmbientGain || !globalAmbientSource) return;
    const ctx = globalCtx;

    // Fade out safely
    const currentGain = globalAmbientGain.gain.value;
    globalAmbientGain.gain.setValueAtTime(currentGain, ctx.currentTime);
    globalAmbientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5);

    const sourceToStop = globalAmbientSource;
    const gainToStop = globalAmbientGain;

    globalAmbientGain = null;
    globalAmbientSource = null;

    setTimeout(() => {
      sourceToStop.stop();
      gainToStop.disconnect();
    }, 5000);
  }, []);

  const playClick = useCallback(() => {
    startAmbient();
    initAudio();
    if (!globalCtx || !globalClickBuffer) return;
    const ctx = globalCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const source = ctx.createBufferSource();
    source.buffer = globalClickBuffer;

    const gain = ctx.createGain();
    gain.gain.value = 0.5; // Adjust volume if needed

    source.connect(gain);
    gain.connect(ctx.destination);

    source.start(0);
  }, [initAudio, startAmbient]);


  const playSuccess = useCallback(() => {
    startAmbient();
    initAudio();
    if (!globalCtx || !globalSuccessBuffer) return;
    const ctx = globalCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const source = ctx.createBufferSource();
    source.buffer = globalSuccessBuffer;

    const gain = ctx.createGain();
    gain.gain.value = 0.8; // A bit louder for completion

    source.connect(gain);
    gain.connect(ctx.destination);

    source.start(0);
  }, [initAudio, startAmbient]);

  const toggleAmbientMute = useCallback(() => {
    globalIsAmbientMuted = !globalIsAmbientMuted;
    if (globalAmbientGain && globalCtx) {
      const currentTime = globalCtx.currentTime;
      const currentGain = globalAmbientGain.gain.value;

      // Cancel scheduled ramps and anchor current value
      globalAmbientGain.gain.cancelScheduledValues(currentTime);
      globalAmbientGain.gain.setValueAtTime(currentGain, currentTime);

      // Linear ramp over 1 second to avoid popping
      globalAmbientGain.gain.linearRampToValueAtTime(
        globalIsAmbientMuted ? 0 : 0.4,
        currentTime + 1.0
      );
    }
    notifyMute();
  }, []);

  return {
    initAudio,
    startAmbient,
    stopAmbient,
    playClick,
    playSuccess,
    isAmbientMuted,
    toggleAmbientMute
  };
}
