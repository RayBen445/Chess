import { useState, useEffect, useRef, useCallback } from 'react';

export const useStockfish = () => {
  const [isReady, setIsReady] = useState(false);
  const [bestMove, setBestMove] = useState(null);
  const [evaluation, setEvaluation] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const engineRef = useRef(null);
  const outputBufferRef = useRef('');

  useEffect(() => {
    // Initialize Stockfish
    if (typeof window !== 'undefined' && !engineRef.current) {
      try {
        // Create a Web Worker for Stockfish
        // Try to use stockfish.js from CDN (may fail due to CORS)
        const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
        
        engineRef.current = new Worker(stockfishUrl);

        engineRef.current.onmessage = (event) => {
          const line = event.data;
          outputBufferRef.current += line + '\n';

          if (line === 'uciok') {
            setIsReady(true);
          } else if (line.startsWith('bestmove')) {
            const match = line.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
            if (match) {
              setBestMove(match[1]);
              setIsThinking(false);
            }
          } else if (line.includes('score cp')) {
            const match = line.match(/score cp (-?\d+)/);
            if (match) {
              setEvaluation(parseInt(match[1]) / 100);
            }
          } else if (line.includes('score mate')) {
            const match = line.match(/score mate (-?\d+)/);
            if (match) {
              const mateIn = parseInt(match[1]);
              setEvaluation(mateIn > 0 ? 100 : -100);
            }
          }
        };

        engineRef.current.onerror = (error) => {
          console.warn('Stockfish worker error:', error);
          setIsReady(false);
        };

        engineRef.current.postMessage('uci');
      } catch (error) {
        console.warn('Failed to initialize Stockfish (this is expected in some environments):', error);
        setIsReady(false);
      }
    }

    return () => {
      if (engineRef.current) {
        try {
          engineRef.current.terminate();
        } catch {
          // Ignore errors during cleanup
        }
        engineRef.current = null;
      }
    };
  }, []);

  const getBestMove = useCallback((fen, depth = 10) => {
    if (!isReady || !engineRef.current) {
      console.warn('Stockfish is not ready');
      return;
    }

    setIsThinking(true);
    setBestMove(null);
    
    engineRef.current.postMessage('position fen ' + fen);
    engineRef.current.postMessage(`go depth ${depth}`);
  }, [isReady]);

  const stopThinking = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.postMessage('stop');
      setIsThinking(false);
    }
  }, []);

  return {
    isReady,
    bestMove,
    evaluation,
    isThinking,
    getBestMove,
    stopThinking
  };
};
