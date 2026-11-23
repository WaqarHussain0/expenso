import { Inbox, LucideIcon } from 'lucide-react';

interface IEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<IEmptyStateProps> = ({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 px-6 py-14 text-center ${className}`}
  >
    <span className="bg-canvas text-ink-subtle ring-ink/[0.05] flex size-12 items-center justify-center rounded-2xl ring-1">
      <Icon className="size-5" />
    </span>
    <div>
      <p className="inter text-ink text-sm font-semibold">{title}</p>
      {description && (
        <p className="inter text-ink-subtle mt-1 max-w-xs text-xs">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
