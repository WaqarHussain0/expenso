'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

interface UseDebouncedSearchProps {
  delay?: number;
  /** Starting value, e.g. the `search` param already in the URL */
  initialValue?: string;
  /** Called with the settled value once the user stops typing */
  onDebouncedChange?: (value: string) => void;
}

export const useDebouncedSearch = ({
  delay = 500,
  initialValue = '',
  onDebouncedChange,
}: UseDebouncedSearchProps = {}) => {
  const [searchInput, setSearchInput] = useState<string>(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialValue);

  // Always call the latest callback without re-creating the debounced fn
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  });

  // Created on first keystroke (refs are only touched outside render)
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Drop any pending call when the component unmounts
  useEffect(() => () => debouncedRef.current?.cancel(), []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedRef.current ??= debounce((settled: string) => {
        setDebouncedSearch(settled);
        onDebouncedChangeRef.current?.(settled);
      }, delay);
      debouncedRef.current(value);
    },
    [delay],
  );

  const clearSearch = useCallback(() => {
    // A pending call would otherwise restore the old value after clearing
    debouncedRef.current?.cancel();
    setSearchInput('');
    setDebouncedSearch('');
  }, []);

  return { searchInput, debouncedSearch, handleSearchChange, clearSearch };
};
