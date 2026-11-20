'use client';

import { LucideIcon, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import React from 'react';

export interface IRowAction {
  label: string;
  icon?: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  show?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
}

/** "⋯" menu used at the end of list rows and cards. */
const RowActions: React.FC<{ actions: IRowAction[]; label?: string }> = ({
  actions,
  label = 'Open actions',
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label={label}
        onClick={e => e.stopPropagation()}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#8b93a1] transition-all duration-200 outline-none hover:bg-[#0d1117]/[0.05] hover:text-[#0d1117] focus-visible:ring-3 focus-visible:ring-[#1a7f5a]/20 data-[state=open]:bg-[#0d1117]/[0.05] data-[state=open]:text-[#0d1117] pointer-fine:opacity-0 pointer-fine:group-focus-within/row:opacity-100 pointer-fine:group-hover/row:opacity-100 pointer-fine:focus-visible:opacity-100 pointer-fine:data-[state=open]:opacity-100"
      >
        <MoreHorizontal className="size-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-36">
      {actions
        .filter(action => action.show !== false)
        .map(action => (
          <React.Fragment key={action.label}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              className={`cursor-pointer gap-2 ${
                action.destructive
                  ? 'text-destructive focus:text-destructive'
                  : ''
              }`}
            >
              {action.icon && <action.icon className="size-4" />}
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default RowActions;
