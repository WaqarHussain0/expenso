import React from 'react';
import { BreadcrumbItemType, CustomBreadcrumb } from './CustomBreadcrumb';

interface IPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItemType[];
  /** Buttons or other controls shown on the right */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page heading for authenticated pages:
 * breadcrumb → serif title → description, with optional actions on the right.
 */
const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <CustomBreadcrumb items={breadcrumbs} className="mb-2" />
        )}
        <h1
          className="text-ink text-[26px] leading-tight font-bold tracking-tight md:text-[30px]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {title}
        </h1>
        {description && (
          <p className="inter text-ink-muted mt-1 max-w-2xl text-sm">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
