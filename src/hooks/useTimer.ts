'use client';

import { useEffect, useRef } from 'react';
import { CircleAction } from '@/types';

export function useTimer(
  dispatch: React.Dispatch<CircleAction>,
  timerRunning: boolean
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!timerRunning) return;

    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning, dispatch]);

  const start = (seconds: number) => {
    dispatch({ type: 'SET_TIMER', seconds });
    dispatch({ type: 'SET_TIMER_RUNNING', running: true });
  };

  const pause = () => dispatch({ type: 'SET_TIMER_RUNNING', running: false });

  const reset = () => {
    dispatch({ type: 'SET_TIMER_RUNNING', running: false });
    dispatch({ type: 'SET_TIMER', seconds: 0 });
  };

  return { start, pause, reset };
}
