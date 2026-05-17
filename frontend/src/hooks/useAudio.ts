'use client';

import { useState, useRef, useEffect } from 'react';

export type SoundType = 'rain' | 'binaural' | 'ocean' | 'none';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>('none');
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<any[]>([]); // Tracks oscillators or buffer sources

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    
    // Resume context if suspended (browser security block)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Helper to create brownian/rain noise buffer
  const createRainBuffer = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian noise filter formula
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain multiplier
    }
    return noiseBuffer;
  };

  const playRain = (ctx: AudioContext, destination: AudioNode) => {
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = createRainBuffer(ctx);
    bufferSource.loop = true;

    // Filter rain to sound warmer (lowpass filter)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600; // Muffled low rain

    bufferSource.connect(filter);
    filter.connect(destination);
    bufferSource.start(0);

    sourcesRef.current.push(bufferSource);
  };

  const playBinaural = (ctx: AudioContext, destination: AudioNode) => {
    // Left ear oscillator (Deep alpha waves, e.g. 100Hz)
    const oscLeft = ctx.createOscillator();
    const pannerLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    
    oscLeft.type = 'sine';
    oscLeft.frequency.value = 100;

    // Right ear oscillator (108Hz, creating a relaxing 8Hz alpha binaural beat!)
    const oscRight = ctx.createOscillator();
    const pannerRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    
    oscRight.type = 'sine';
    oscRight.frequency.value = 108;

    if (pannerLeft && pannerRight) {
      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;
      
      oscLeft.connect(pannerLeft);
      pannerLeft.connect(destination);

      oscRight.connect(pannerRight);
      pannerRight.connect(destination);
    } else {
      oscLeft.connect(destination);
      oscRight.connect(destination);
    }

    oscLeft.start(0);
    oscRight.start(0);

    sourcesRef.current.push(oscLeft, oscRight);
  };

  const playOcean = (ctx: AudioContext, destination: AudioNode) => {
    // Generate waves by modulating noise gain with a very slow LFO (low freq oscillator)
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createRainBuffer(ctx);
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;

    // LFO modulator
    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.3;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // Ocean wave cycles every 8 seconds

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(waveGain);
    waveGain.connect(destination);

    lfo.start(0);
    noiseSource.start(0);

    sourcesRef.current.push(noiseSource, lfo);
  };

  const stopAll = () => {
    sourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    sourcesRef.current = [];
    setIsPlaying(false);
  };

  const startSound = (type: SoundType) => {
    initAudio();
    stopAll();

    if (type === 'none' || !audioCtxRef.current || !gainNodeRef.current) {
      setSoundType('none');
      return;
    }

    setSoundType(type);
    setIsPlaying(true);

    if (type === 'rain') {
      playRain(audioCtxRef.current, gainNodeRef.current);
    } else if (type === 'binaural') {
      playBinaural(audioCtxRef.current, gainNodeRef.current);
    } else if (type === 'ocean') {
      playOcean(audioCtxRef.current, gainNodeRef.current);
    }
  };

  // Keep volume nodes in sync
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  return {
    isPlaying,
    soundType,
    volume,
    setVolume,
    startSound,
    stopSound: () => startSound('none'),
  };
}
