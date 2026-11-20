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
    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f6f7f5] text-[#8b93a1] ring-1 ring-[#0d1117]/[0.05]">
      <Icon className="size-5" />
    </span>
    <div>
      <p className="inter text-sm font-semibold text-[#0d1117]">{title}</p>
      {description && (
        <p className="inter mt-1 max-w-xs text-xs text-[#8b93a1]">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
