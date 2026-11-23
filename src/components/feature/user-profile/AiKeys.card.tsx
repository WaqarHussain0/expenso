'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Trash2,
} from 'lucide-react';
import {
  AI_PROVIDER_ORDER,
  AI_PROVIDERS,
  AiProviderEnum,
  IAiKeySummary,
} from '@/app/constants/ai-providers.constant';
import {
  deleteMyAiKeyAction,
  saveMyAiKeyAction,
} from '@/lib/server-actions/ai-key.server-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IProviderKeyRowProps {
  provider: AiProviderEnum;
  saved?: IAiKeySummary;
}

const ProviderKeyRow: React.FC<IProviderKeyRowProps> = ({
  provider,
  saved,
}) => {
  const meta = AI_PROVIDERS[provider];

  const [editing, setEditing] = useState(!saved);
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isRemoving, startRemoving] = useTransition();

  const showForm = editing || !saved;

  const handleSave = () => {
    setError(null);
    startSaving(async () => {
      const result = await saveMyAiKeyAction(provider, value);
      if (result.success) {
        toast.success(`${meta.label} key saved`, {
          description: 'Verified with the provider and stored encrypted.',
        });
        setValue('');
        setReveal(false);
        setEditing(false);
      } else {
        setError(result.error || 'Could not save this key.');
      }
    });
  };

  const handleRemove = () => {
    startRemoving(async () => {
      const result = await deleteMyAiKeyAction(provider);
      if (result.success) {
        toast.success(`${meta.label} key removed`);
        setConfirmRemove(false);
        setEditing(true);
      } else {
        toast.error('Could not remove this key', {
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start">
      {/* Provider */}
      <div className="flex min-w-0 items-center gap-3 md:w-56 md:shrink-0">
        <span
          className="manrope flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-[0_4px_12px_-4px_rgba(13,17,23,0.35)]"
          style={{ background: meta.color }}
          aria-hidden
        >
          {meta.label.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="inter text-ink text-sm font-semibold">{meta.label}</p>
          <a
            href={meta.keyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inter text-ink-subtle hover:text-brand-fg inline-flex items-center gap-0.5 text-[11px] transition-colors"
          >
            Get a {meta.vendor} key
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>

      {/* Key */}
      <div className="min-w-0 flex-1">
        {showForm ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (value.trim()) handleSave();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <KeyRound className="text-ink-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type={reveal ? 'text' : 'password'}
                value={value}
                onChange={e => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder={`Paste your ${meta.label} API key (${meta.placeholder})`}
                aria-label={`${meta.label} API key`}
                aria-invalid={!!error}
                autoComplete="off"
                spellCheck={false}
                disabled={isSaving}
                className="bg-surface-2 focus-visible:bg-surface h-10 pr-10 pl-9 font-mono text-[13px] focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
              />
              <button
                type="button"
                onClick={() => setReveal(r => !r)}
                aria-label={reveal ? 'Hide key' : 'Show key'}
                className="text-ink-subtle hover:text-ink absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors"
              >
                {reveal ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <div className="flex gap-2">
              {saved && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  disabled={isSaving}
                  onClick={() => {
                    setEditing(false);
                    setValue('');
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="h-10 min-w-24 px-4"
                disabled={isSaving || !value.trim()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  'Save key'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inter bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium">
                <span className="bg-success size-1.5 rounded-full" />
                Active
              </span>
              <span className="text-ink font-mono text-sm tracking-wider">
                ••••••••{saved?.last4}
              </span>
              {saved?.updatedAt && (
                <span className="inter text-ink-subtle hidden text-xs sm:inline">
                  Updated{' '}
                  {new Date(saved.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-9"
                onClick={() => setEditing(true)}
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9"
                onClick={() => setConfirmRemove(true)}
                aria-label={`Remove ${meta.label} key`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="inter mt-2 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {meta.label} key?</AlertDialogTitle>
            <AlertDialogDescription>
              The assistant will stop using this key. You can add it again at
              any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface IAiKeysCardProps {
  keys: IAiKeySummary[];
}

/** Lets users bring their own AI provider keys for the assistant. */
const AiKeysCard: React.FC<IAiKeysCardProps> = ({ keys }) => {
  const byProvider = new Map(keys.map(k => [k.provider, k]));
  const usingOwnKeys = keys.length > 0;

  return (
    <section
      id="ai-keys"
      className="bg-surface ring-ink/[0.06] scroll-mt-24 overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1"
    >
      <div className="border-ink/[0.06] flex flex-col gap-3 border-b px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inter text-ink text-sm font-semibold">
            AI provider keys
          </p>
          <p className="inter text-ink-subtle mt-0.5 max-w-xl text-xs">
            Use your own API keys for the assistant. Without any, Expenso&apos;s
            shared keys are used.
          </p>
        </div>
        <span
          className={`inter inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            usingOwnKeys
              ? 'text-brand-fg bg-[#1a7f5a]/10'
              : 'bg-ink/[0.05] text-ink-muted'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              usingOwnKeys ? 'bg-[#1a7f5a]' : 'bg-ink-subtle'
            }`}
          />
          {usingOwnKeys ? 'Using your keys' : "Using Expenso's shared keys"}
        </span>
      </div>

      <div className="divide-ink/[0.05] divide-y">
        {AI_PROVIDER_ORDER.map(provider => (
          <ProviderKeyRow
            key={`${provider}-${byProvider.get(provider)?.updatedAt ?? 'none'}`}
            provider={provider}
            saved={byProvider.get(provider)}
          />
        ))}
      </div>

      <div className="border-ink/[0.06] bg-surface-2 flex gap-3 border-t px-6 py-4">
        <Lock className="text-brand-fg mt-0.5 size-4 shrink-0" />
        <p className="inter text-ink-muted text-xs leading-relaxed">
          Keys are verified with the provider, encrypted (AES-256-GCM) before
          they&apos;re stored, and never shown again — only the last four
          characters. When you save any key, the assistant uses{' '}
          <strong className="text-ink font-semibold">only your keys</strong>,
          trying {AI_PROVIDER_ORDER.map(p => AI_PROVIDERS[p].label).join(' → ')}{' '}
          and falling back automatically if one fails.
        </p>
      </div>
    </section>
  );
};

export default AiKeysCard;
