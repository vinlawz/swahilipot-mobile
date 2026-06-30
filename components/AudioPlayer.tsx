import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type AudioStatus,
  setAudioModeAsync,
  useAudioPlayer as useExpoAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { Platform } from 'react-native';

type StreamTrack = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  artwork?: string;
};

type PlayerContextValue = {
  currentTrack: StreamTrack | null;
  status: AudioStatus | null;
  isLoading: boolean;
  isPlaying: boolean;
  play: (track?: StreamTrack) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlayback: (track?: StreamTrack) => Promise<void>;
};

export const FM_STREAM: StreamTrack = {
  id: 'swahilipot-fm',
  title: 'Swahilipot FM',
  subtitle: 'Live coastal stories, music, and culture.',
  description: '24/7 stream direct from Swahilipot FM studios.',
  url: 'https://swahilipotfm.out.airtime.pro/swahilipotfm_a?_ga=2.140975346.1118176404.1720613685-1678527295.1702105127',
};

const noop = async () => {};

const defaultPlayerContext: PlayerContextValue = {
  currentTrack: null,
  status: null,
  isLoading: false,
  isPlaying: false,
  play: noop,
  pause: noop,
  stop: noop,
  togglePlayback: noop,
};

const AudioPlayerContext = createContext<PlayerContextValue>(defaultPlayerContext);

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioConfiguredRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState<StreamTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize player with the FM stream URL
  const player = useExpoAudioPlayer(
    { uri: FM_STREAM.url },
    { updateInterval: 1000, keepAudioSessionActive: true }
  );
  const status = useAudioPlayerStatus(player);

  const ensureAudioMode = useCallback(async () => {
    if (Platform.OS === 'web' || audioConfiguredRef.current) {
      return;
    }
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        interruptionMode: 'mixWithOthers',
        interruptionModeAndroid: 'doNotMix',
        shouldPlayInBackground: true,
        shouldRouteThroughEarpiece: false,
      });
      audioConfiguredRef.current = true;
      console.log('[AudioPlayer] Audio mode configured');
    } catch (error) {
      console.warn('[AudioPlayer] Unable to configure audio mode', error);
    }
  }, []);

  useEffect(() => {
    void ensureAudioMode();
  }, [ensureAudioMode]);

  useEffect(() => {
    if (status?.isLoaded) {
      setIsLoading(false);
      console.log('[AudioPlayer] Stream loaded and ready');
    }
  }, [status?.isLoaded]);

  const play = useCallback(
    async (track?: StreamTrack) => {
      const targetTrack = track ?? currentTrack ?? FM_STREAM;
      setCurrentTrack(targetTrack);
      setIsLoading(true);

      try {
        console.log('[AudioPlayer] Starting playback:', targetTrack.title);
        await ensureAudioMode();

        // Always ensure the source is set correctly
        if (targetTrack.id !== currentTrack?.id) {
          console.log('[AudioPlayer] Changing stream source');
          try {
            // Replace the source and reload
            await player.replace({ uri: targetTrack.url });
            console.log('[AudioPlayer] Stream source updated');
          } catch (replaceError) {
            console.error('[AudioPlayer] Failed to replace stream:', replaceError);
            throw new Error(`Stream replace failed: ${replaceError}`);
          }
        }

        // Check if already playing
        if (!status?.playing) {
          console.log('[AudioPlayer] Starting playback...');
          try {
            await player.play();
            console.log('[AudioPlayer] ✅ Playback started successfully');
          } catch (playError) {
            console.error('[AudioPlayer] Play failed:', playError);
            throw new Error(`Play failed: ${playError}`);
          }
        } else {
          console.log('[AudioPlayer] Already playing');
        }
      } catch (error) {
        console.error('[AudioPlayer] ❌ Playback error:', error);
        setIsLoading(false);
        setCurrentTrack(null);
      }
    },
    [currentTrack, ensureAudioMode, player, status?.playing],
  );

  const pause = useCallback(async () => {
    try {
      console.log('[AudioPlayer] Pausing...');
      await player.pause();
      console.log('[AudioPlayer] ✅ Paused');
    } catch (error) {
      console.error('[AudioPlayer] Pause error:', error);
    }
  }, [player]);

  const stop = useCallback(async () => {
    try {
      console.log('[AudioPlayer] Stopping...');
      await player.pause();
      await player.seekTo(0);
      setCurrentTrack(null);
      setIsLoading(false);
      console.log('[AudioPlayer] ✅ Stopped');
    } catch (error) {
      console.warn('[AudioPlayer] Stop error:', error);
    }
  }, [player]);

  const togglePlayback = useCallback(
    async (track?: StreamTrack) => {
      try {
        if (status?.playing) {
          await pause();
        } else {
          await play(track);
        }
      } catch (error) {
        console.error('[AudioPlayer] Toggle error:', error);
      }
    },
    [pause, play, status?.playing],
  );

  const contextValue = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      status,
      isLoading,
      isPlaying: !!status?.playing,
      play,
      pause,
      stop,
      togglePlayback,
    }),
    [currentTrack, status, isLoading, play, pause, stop, togglePlayback],
  );

  return <AudioPlayerContext.Provider value={contextValue}>{children}</AudioPlayerContext.Provider>;
}

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === defaultPlayerContext) {
    throw new Error('useAudioPlayer must be used inside PlayerProvider');
  }
  return context;
};
  
