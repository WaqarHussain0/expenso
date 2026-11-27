'use client';

import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  buildCategoryTemplateCsv,
  CATEGORY_CSV_COLUMNS,
  CATEGORY_IMPORT_MAX_BYTES,
  CATEGORY_IMPORT_MAX_ROWS,
  ICategoryCsvRow,
  parseCategoryCsv,
} from '@/lib/category-csv.util';
import { downloadCsv } from '@/lib/download.util';
import { importCategoriesAction } from '@/lib/server-actions/category.server-action';
import { CategoryTypeEnum } from '@/types/category.type';

interface ICategoryImportDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ISelectedFile {
  name: string;
  text: string;
  rows: ICategoryCsvRow[];
  errors: string[];
}

const TYPE_LABELS: Record<CategoryTypeEnum, string> = {
  [CategoryTypeEnum.INCOME]: 'income',
  [CategoryTypeEnum.EXPENSE]: 'expense',
  [CategoryTypeEnum.INVESTMENT]: 'investment',
};

/** "3 created, 2 updated, 1 unchanged" — only the non-zero parts */
const describeSummary = (summary: Record<string, number>) =>
  Object.entries(summary)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${count} ${label}`)
    .join(', ');

const CategoryImportDialog: React.FC<ICategoryImportDialogProps> = ({
  open,
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<ISelectedFile | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDownloadTemplate = () =>
    downloadCsv(buildCategoryTemplateCsv(), 'expenso-categories-template.csv');

  // Read and validate the file in the browser before anything is uploaded
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files?.[0];
    event.target.value = ''; // let the same file be picked again after a fix
    if (!selected) return;

    if (!/\.csv$/i.test(selected.name)) {
      setFile({
        name: selected.name,
        text: '',
        rows: [],
        errors: [
          'Only .csv files can be imported. Download the template above.',
        ],
      });
      return;
    }

    if (selected.size > CATEGORY_IMPORT_MAX_BYTES) {
      setFile({
        name: selected.name,
        text: '',
        rows: [],
        errors: [
          `The file is too large (max ${CATEGORY_IMPORT_MAX_BYTES / 1024} KB).`,
        ],
      });
      return;
    }

    const text = await selected.text();
    const { rows, errors } = parseCategoryCsv(text);
    setFile({ name: selected.name, text, rows, errors });
  };

  const handleImport = () => {
    if (!file || file.errors.length || !file.rows.length) return;

    startTransition(async () => {
      const result = await importCategoriesAction(file.text);

      if (result.success && result.summary) {
        toast.success('Categories imported', {
          description: describeSummary({ ...result.summary }) || 'No changes',
        });
        onClose();
        return;
      }

      if (result.errors?.length) {
        setFile(prev => (prev ? { ...prev, errors: result.errors! } : prev));
      }
      toast.error('Import failed', {
        description: result.error || 'Something went wrong',
      });
    });
  };

  const counts = file?.rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.type] = (acc[row.type] ?? 0) + 1;
    return acc;
  }, {});

  const isValid = !!file && file.errors.length === 0 && file.rows.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen && !isPending) onClose();
      }}
    >
      <DialogContent className="no-scrollbar max-h-[90vh] overflow-y-auto font-sans sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import categories</DialogTitle>
          <DialogDescription>
            Add many categories at once from a CSV file. New ones are created;
            ones you already have (same name and type) are updated.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1 — template */}
        <div className="border-ink/8 rounded-xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">1. Get the template</p>
              <p className="text-ink-muted text-xs">
                Columns: {CATEGORY_CSV_COLUMNS.join(', ')} — keep exactly these.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
            >
              <Download />
              Template
            </Button>
          </div>

          <ul className="text-ink-muted mt-3 space-y-1 text-xs">
            <li>
              <span className="text-foreground font-medium">Name</span> —
              required, up to 50 characters
            </li>
            <li>
              <span className="text-foreground font-medium">Type</span> —
              required: income, expense or investment
            </li>
            <li>
              <span className="text-foreground font-medium">Color</span> —
              optional hex colour like #22C55E (blank picks one for you)
            </li>
            <li>
              No category twice in the file · up to {CATEGORY_IMPORT_MAX_ROWS}{' '}
              rows
            </li>
          </ul>
        </div>

        {/* Step 2 — file */}
        <div className="space-y-3">
          <p className="text-sm font-medium">2. Upload your file</p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="border-ink/12 hover:bg-ink/3 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors disabled:opacity-50"
          >
            {file ? (
              <FileSpreadsheet className="text-ink-muted size-6" />
            ) : (
              <Upload className="text-ink-muted size-6" />
            )}
            <span className="text-sm font-medium break-all">
              {file ? file.name : 'Choose a CSV file'}
            </span>
            <span className="text-ink-muted text-xs">
              {file ? 'Click to choose a different file' : 'Max 512 KB'}
            </span>
          </button>

          {file && file.errors.length > 0 && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm"
            >
              <p className="flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                Fix these and choose the file again
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-xs text-red-600/90 dark:text-red-400/90">
                {file.errors.map(error => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {isValid && counts && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm">
              <p className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                {file.rows.length}{' '}
                {file.rows.length === 1 ? 'category' : 'categories'} ready to
                import
              </p>
              <p className="text-ink-muted mt-1 pl-6 text-xs">
                {Object.values(CategoryTypeEnum)
                  .filter(type => counts[type])
                  .map(type => `${counts[type]} ${TYPE_LABELS[type]}`)
                  .join(' · ')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!isValid || isPending}>
            <Upload />
            {isPending ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryImportDialog;
