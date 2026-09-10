// ============================================================
// IBSB — Hooks da Bíblia
// ============================================================

import { useEffect, useState, useSyncExternalStore } from 'react';
import { isBibleLoaded, loadBible } from '../data/bible';
import { getFavorites, subscribeFavorites } from '../data/bibleFavorites';

export function useBible() {
  const [state, setState] = useState(() => ({
    ready: isBibleLoaded(),
    error: null,
  }));

  useEffect(() => {
    if (state.ready) return undefined;
    let alive = true;
    loadBible()
      .then(() => {
        if (alive) setState({ ready: true, error: null });
      })
      .catch((err) => {
        if (alive) setState({ ready: false, error: err });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ready]);

  return state;
}

export function useBibleFavorites() {
  return useSyncExternalStore(subscribeFavorites, getFavorites, getFavorites);
}
