import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const BackgroundMusicContext = React.createContext();

const BackgroundMusic = ({ children }) => {
  const location = useLocation();
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState('');

  const trackMap = {
    default: '/background_music.mp3',
    duma: '/background_duma.mp3',
  };

  const getTrackForRoute = (path) => {
    if (path.includes('/duma')) return 'duma';
    return 'default';
  };

  const playTrack = useCallback((track) => {
    const newSrc = trackMap[track] || trackMap.default;
    if (audioRef.current.src !== window.location.origin + newSrc) {
      audioRef.current.src = newSrc;
      audioRef.current.load();
    }
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.play().catch((e) => console.log('Play prevented:', e));
    setCurrentTrack(track);
    setIsPlaying(true);
  }, [volume]);

  const stopAllMusic = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const track = getTrackForRoute(location.pathname);
    playTrack(track);
  }, [location.pathname, playTrack]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updateVolume = (newVolume) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    audioRef.current.volume = clamped;
  };

  return (
    <BackgroundMusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        volume,
        setVolume: updateVolume,
        isMuted: volume === 0,
        currentTrack,
        playTrack,
        stopAllMusic,
      }}
    >
      {children}
    </BackgroundMusicContext.Provider>
  );
};

export default BackgroundMusic;