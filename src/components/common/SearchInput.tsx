'use client';

import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Search box with leading icon and a clear button. */
const SearchInput: React.FC<ISearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}) => (
  <form
    role="search"
    className={`relative ${className}`}
    onSubmit={e => e.preventDefault()}
  >
    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8b93a1]" />
    <Input
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border-[#0d1117]/[0.08] bg-[#fafbfa] pr-8 pl-9 focus-visible:border-[#1a7f5a] focus-visible:bg-white focus-visible:ring-[#1a7f5a]/15"
    />
    {value && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => onChange('')}
        className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#8b93a1] transition-colors hover:bg-[#0d1117]/[0.06] hover:text-[#0d1117]"
      >
        <X className="size-3" />
      </button>
    )}
  </form>
);

export default SearchInput;
