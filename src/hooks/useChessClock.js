import { useState, useEffect, useCallback, useRef } from 'react';

export const useChessClock = (initialTime = 600000) => { // 10 minutes in milliseconds
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState('w'); // 'w' for white, 'b' for black
  const intervalRef = useRef(null);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        lastTickRef.current = now;

        if (activePlayer === 'w') {
          setWhiteTime(prev => Math.max(0, prev - elapsed));
        } else {
          setBlackTime(prev => Math.max(0, prev - elapsed));
        }
      }, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, activePlayer]);

  const start = useCallback(() => {
    setIsRunning(true);
    lastTickRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const switchPlayer = useCallback(() => {
    setActivePlayer(prev => prev === 'w' ? 'b' : 'w');
    lastTickRef.current = Date.now();
  }, []);

  const reset = useCallback((time = initialTime) => {
    pause();
    setWhiteTime(time);
    setBlackTime(time);
    setActivePlayer('w');
  }, [initialTime, pause]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    whiteTime,
    blackTime,
    isRunning,
    activePlayer,
    start,
    pause,
    switchPlayer,
    reset,
    formatTime
  };
};
