"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

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
  separator = <BreadcrumbSeparator />,
  className,
}: CommonBreadcrumbProps) {
  return (
    <Breadcrumb className={`mb-3 ${className}`}>
      <BreadcrumbList>
        {items?.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem className="poppins">
              {item.linkTo ? (
                <BreadcrumbLink asChild>
                  <Link className="capitalize" href={item.linkTo}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="capitalize">
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
