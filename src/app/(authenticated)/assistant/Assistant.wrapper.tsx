'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ArrowUp, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAskAssistantMutation } from '@/lib/rtk/services/assistant.rtk.service';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';

// The backend sanitizes this HTML (DOMPurify, restricted tag allowlist) before it ever
// reaches the client — rendering it via dangerouslySetInnerHTML here is safe as a result.
const ASSISTANT_HTML_CLASSES =
  '[&_p]:mb-2 [&_p:last-child]:mb-0 ' +
  '[&_strong]:font-semibold [&_strong]:text-[#0d1117] ' +
  '[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4 ' +
  '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-0.5 [&_ol]:pl-4 ' +
  '[&_table]:my-2 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-[#0d1117]/[0.08] [&_table]:bg-white [&_table]:text-sm ' +
  '[&_th]:border-b [&_th]:border-[#0d1117]/[0.08] [&_th]:bg-[#fafbfa] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-[#5a6070] ' +
  '[&_td]:border-b [&_td]:border-[#0d1117]/[0.05] [&_td]:px-3 [&_td]:py-2 [&_td]:tabular-nums [&_tr:last-child_td]:border-0';

const SUGGESTIONS = [
  'How much did I spend this month?',
  'Break down my expenses by category',
  'What was my biggest expense this year?',
  'How much have I invested so far?',
];

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AssistantAvatar = () => (
  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#0d1117] text-[#34d399] shadow-[0_4px_12px_-4px_rgba(13,17,23,0.4)]">
    <Sparkles className="size-4" />
  </span>
);

const TypingIndicator = () => (
  <div className="flex items-start gap-3">
    <AssistantAvatar />
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-[#f6f7f5] px-4 py-3.5 ring-1 ring-[#0d1117]/[0.05]">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-[#8b93a1]"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
      <span className="sr-only">Assistant is typing</span>
    </div>
  </div>
);

const AssistantWrapper: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0];

  const [askAssistant, { isLoading }] = useAskAssistantMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAsk = async (question: string) => {
    const trimmed = question.trim();

    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    try {
      const result = await askAssistant({ question: trimmed }).unwrap();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: result.response },
      ]);
    } catch (error) {
      const message =
        (error as { data?: { error?: string } })?.data?.error ||
        'Something went wrong, please try again.';

      toast.error(message);
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
    } finally {
      inputRef.current?.focus();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    // Fill the viewport below the top bar: 4rem top bar + content padding
    <div className="page-fade flex h-[calc(100dvh-11rem)] w-full flex-col gap-5 md:h-[calc(100dvh-11.5rem)] lg:h-[calc(100dvh-7.5rem)]">
      <PageHeader
        title="Assistant"
        description="Ask about your income, expenses, and investments in plain language."
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Assistant' },
        ]}
        actions={
          hasMessages && (
            <Button
              variant="outline"
              className="h-9"
              onClick={() => setMessages([])}
              disabled={isLoading}
            >
              <RotateCcw className="size-3.5" />
              New chat
            </Button>
          )
        }
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1 ring-[#0d1117]/[0.06]">
        {/* Conversation */}
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {hasMessages ? (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {messages.map((message, index) =>
                message.role === 'user' ? (
                  <div key={index} className="flex justify-end">
                    <div className="inter max-w-[80%] rounded-2xl rounded-tr-md bg-[#1a7f5a] px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_4px_12px_-6px_rgba(26,127,90,0.5)]">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start gap-3">
                    <AssistantAvatar />
                    <div
                      className={`inter max-w-[88%] min-w-0 overflow-x-auto rounded-2xl rounded-tl-md bg-[#f6f7f5] px-4 py-3 text-sm leading-relaxed text-[#2b313b] ring-1 ring-[#0d1117]/[0.05] ${ASSISTANT_HTML_CLASSES}`}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                ),
              )}

              {isLoading && <TypingIndicator />}

              <div ref={scrollRef} />
            </div>
          ) : (
            /* Empty state */
            <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
              <span className="relative mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#0d1117] text-[#34d399] shadow-[0_12px_30px_-10px_rgba(13,17,23,0.5)]">
                <Sparkles className="size-6" />
                <span className="absolute -inset-3 -z-10 rounded-3xl bg-[#34d399]/10 blur-xl" />
              </span>
              <h2
                className="text-2xl font-bold text-[#0d1117] md:text-[28px]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {firstName ? `Hi ${firstName}, ask` : 'Ask'}{' '}
                <em
                  className="text-gradient-green"
                  style={{ fontStyle: 'italic' }}
                >
                  anything
                </em>
              </h2>
              <p className="inter mt-2 text-sm text-[#5a6070]">
                I read your transactions and answer in seconds — no filters or
                date pickers needed.
              </p>

              <div className="mt-7 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAsk(suggestion)}
                    className="inter group flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-[#0d1117]/[0.08] bg-white px-4 py-3 text-left text-sm text-[#2b313b] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1a7f5a]/40 hover:shadow-[0_8px_20px_-12px_rgba(13,17,23,0.25)]"
                  >
                    {suggestion}
                    <ArrowUp className="size-3.5 shrink-0 rotate-45 text-[#c4c9d0] transition-colors group-hover:text-[#1a7f5a]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[#0d1117]/[0.06] bg-[#fbfbfa] px-3 pt-3 pb-2 md:px-6">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAsk(input);
            }}
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-[#0d1117]/[0.08] bg-white p-1.5 pl-4 shadow-[0_1px_2px_rgba(13,17,23,0.04)] transition-all focus-within:border-[#1a7f5a] focus-within:ring-3 focus-within:ring-[#1a7f5a]/15"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk(input);
                }
              }}
              placeholder="Ask about your finances…"
              aria-label="Ask the assistant"
              className="inter [field-sizing:content] max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-[#0d1117] outline-none placeholder:text-[#8b93a1]"
            />

            <Button
              type="submit"
              aria-label="Send"
              disabled={isLoading || !input.trim()}
              className="size-9 shrink-0 rounded-lg p-0"
            >
              <ArrowUp className="size-4" />
            </Button>
          </form>

          <p className="inter mx-auto mt-2 flex max-w-3xl items-center justify-center gap-1.5 text-[11px] text-[#8b93a1]">
            <Lock className="size-3" />
            Read-only — the assistant can&apos;t add, edit, or delete anything.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantWrapper;
