import { useState, useCallback } from 'react';

export function useVideoPlayer() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const openVideoPlayer = useCallback((movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeVideoPlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setSelectedMovie(null);
    document.body.style.overflow = 'unset';
  }, []);

  return { selectedMovie, isPlayerOpen, openVideoPlayer, closeVideoPlayer };
}