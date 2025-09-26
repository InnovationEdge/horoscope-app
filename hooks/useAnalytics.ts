import { useCallback } from 'react';
import { track, setUserProps } from '../services/analytics';

export function useAnalytics() {
  return {
    track: useCallback(track, []),
    setUserProps: useCallback(setUserProps, []),
  };
}