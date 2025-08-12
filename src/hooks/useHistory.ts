'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, HistoryState } from '@/types';

const MAX_HISTORY = 50;

export function useHistory(initialState: AppState) {
  const [history, setHistory] = useState<HistoryState[]>([
    { state: initialState, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInternalChange = useRef(false);

  const pushState = useCallback((newState: AppState) => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({
        state: { ...newState },
        timestamp: Date.now(),
      });
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      isInternalChange.current = true;
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      isInternalChange.current = true;
    }
  }, [currentIndex, history.length]);

  const getCurrentState = useCallback(() => {
    return history[currentIndex]?.state || initialState;
  }, [history, currentIndex, initialState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') || 
                 ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    history,
    currentIndex,
    pushState,
    undo,
    redo,
    getCurrentState,
  };
}