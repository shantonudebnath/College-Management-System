import { useEffect, useRef } from 'react';

export function useAutoRefetch(refetch: () => void | Promise<void>, intervalMs = 30_000) {
  const hiddenAt = useRef(0);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt.current = Date.now();
      } else if (Date.now() - hiddenAt.current > 5_000) {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [refetch]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refetch();
    }, intervalMs);
    return () => clearInterval(id);
  }, [refetch, intervalMs]);
}
