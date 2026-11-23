'use client';

interface ISegmentedOption {
  value: string;
  label: string;
  /** Optional dot colour shown before the label */
  color?: string;
}

interface ISegmentedControlProps {
  options: ISegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

/** Pill-style single-select filter. */
const SegmentedControl: React.FC<ISegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
  ariaLabel,
}) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className={`bg-ink/[0.04] inline-flex items-center gap-0.5 overflow-x-auto rounded-lg p-0.5 ${className}`}
  >
    {options.map(option => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(option.value)}
          className={`inter inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium whitespace-nowrap capitalize transition-all duration-300 ${
            active
              ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(13,17,23,0.1)]'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          {option.color && (
            <span
              className="size-1.5 rounded-full"
              style={{ background: option.color }}
            />
          )}
          {option.label}
        </button>
      );
    })}
  </div>
);

export default SegmentedControl;
