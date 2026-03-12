"use client";

import { useState, useMemo, useCallback } from "react";
import debounce from "lodash.debounce";

interface UseDebouncedSearchProps {
  delay?: number;
}

export const useDebouncedSearch = ({
  delay = 500,
}: UseDebouncedSearchProps = {}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, delay),
    [delay],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedUpdateSearch(value);
    },
    [debouncedUpdateSearch],
  );

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
  }, []);

  return { searchInput, debouncedSearch, handleSearchChange, clearSearch };
};
