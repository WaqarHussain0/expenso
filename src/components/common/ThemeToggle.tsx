'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemePreference } from '@/app/constants/theme.constant';
import { useTheme } from '../providers/Theme.provider';

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

interface IThemeToggleProps {
  /** `onDark` styles it for dark backgrounds (marketing nav, sidebar) */
  tone?: 'default' | 'onDark';
  className?: string;
}

/** Three-way Light / Dark / System switch. */
const ThemeToggle: React.FC<IThemeToggleProps> = ({
  tone = 'default',
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const onDark = tone === 'onDark';

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 ${
        onDark ? 'bg-white/[0.06]' : 'bg-ink/[0.05]'
      } ${className}`}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={`flex size-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
              active
                ? onDark
                  ? 'bg-white/[0.12] text-white'
                  : 'bg-surface text-ink shadow-[0_1px_3px_rgba(13,17,23,0.15)]'
                : onDark
                  ? 'text-white/45 hover:text-white'
                  : 'text-ink-subtle hover:text-ink'
            }`}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
