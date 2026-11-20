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
          <p className="inter text-sm font-semibold text-[#0d1117]">
            {meta.label}
          </p>
          <a
            href={meta.keyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inter inline-flex items-center gap-0.5 text-[11px] text-[#8b93a1] transition-colors hover:text-[#1a7f5a]"
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
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8b93a1]" />
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
                className="h-10 bg-[#fafbfa] pr-10 pl-9 font-mono text-[13px] focus-visible:border-[#1a7f5a] focus-visible:bg-white focus-visible:ring-[#1a7f5a]/15"
              />
              <button
                type="button"
                onClick={() => setReveal(r => !r)}
                aria-label={reveal ? 'Hide key' : 'Show key'}
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#8b93a1] transition-colors hover:text-[#0d1117]"
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
              <span className="inter inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 px-2 py-0.5 text-[11px] font-medium text-[#059669]">
                <span className="size-1.5 rounded-full bg-[#059669]" />
                Active
              </span>
              <span className="font-mono text-sm tracking-wider text-[#0d1117]">
                ••••••••{saved?.last4}
              </span>
              {saved?.updatedAt && (
                <span className="inter hidden text-xs text-[#8b93a1] sm:inline">
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
      className="scroll-mt-24 overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1 ring-[#0d1117]/[0.06]"
    >
      <div className="flex flex-col gap-3 border-b border-[#0d1117]/[0.06] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inter text-sm font-semibold text-[#0d1117]">
            AI provider keys
          </p>
          <p className="inter mt-0.5 max-w-xl text-xs text-[#8b93a1]">
            Use your own API keys for the assistant. Without any, Expenso&apos;s
            shared keys are used.
          </p>
        </div>
        <span
          className={`inter inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            usingOwnKeys
              ? 'bg-[#1a7f5a]/10 text-[#1a7f5a]'
              : 'bg-[#0d1117]/[0.05] text-[#5a6070]'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              usingOwnKeys ? 'bg-[#1a7f5a]' : 'bg-[#8b93a1]'
            }`}
          />
          {usingOwnKeys ? 'Using your keys' : "Using Expenso's shared keys"}
        </span>
      </div>

      <div className="divide-y divide-[#0d1117]/[0.05]">
        {AI_PROVIDER_ORDER.map(provider => (
          <ProviderKeyRow
            key={`${provider}-${byProvider.get(provider)?.updatedAt ?? 'none'}`}
            provider={provider}
            saved={byProvider.get(provider)}
          />
        ))}
      </div>

      <div className="flex gap-3 border-t border-[#0d1117]/[0.06] bg-[#fafbfa] px-6 py-4">
        <Lock className="mt-0.5 size-4 shrink-0 text-[#1a7f5a]" />
        <p className="inter text-xs leading-relaxed text-[#5a6070]">
          Keys are verified with the provider, encrypted (AES-256-GCM) before
          they&apos;re stored, and never shown again — only the last four
          characters. When you save any key, the assistant uses{' '}
          <strong className="font-semibold text-[#0d1117]">
            only your keys
          </strong>
          , trying{' '}
          {AI_PROVIDER_ORDER.map(p => AI_PROVIDERS[p].label).join(' → ')} and
          falling back automatically if one fails.
        </p>
      </div>
    </section>
  );
};

export default AiKeysCard;
