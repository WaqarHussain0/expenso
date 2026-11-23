'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItemType {
  label: string;
  linkTo?: string; // If no href, render as current page
}

interface CommonBreadcrumbProps {
  className?: string;
  items: BreadcrumbItemType[];
  separator?: React.ReactNode; // Custom separator if needed
}

export function CustomBreadcrumb({
  items,
  separator = (
    <BreadcrumbSeparator className="text-ink-faint [&>svg]:size-3">
      <ChevronRight />
    </BreadcrumbSeparator>
  ),
  className = 'mb-3',
}: CommonBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="gap-1 text-xs sm:gap-1.5">
        {items?.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem className="inter">
              {item.linkTo ? (
                <BreadcrumbLink asChild>
                  <Link
                    className="text-ink-subtle hover:text-brand-fg capitalize transition-colors"
                    href={item.linkTo}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-ink-muted font-medium capitalize">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {/* Render separator BETWEEN items (outside li) */}
            {index < items?.length - 1 && separator}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
