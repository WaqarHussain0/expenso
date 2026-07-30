'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Send, Sparkles } from 'lucide-react';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MessageSkeleton from '@/components/skeletons/Message.skeleton';
import { useAskAssistantMutation } from '@/lib/rtk/services/assistant.rtk.service';
import { CustomBreadcrumb } from '@/components/common/CustomBreadcrumb';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { Input } from '@/components/ui/input';

// The backend sanitizes this HTML (DOMPurify, restricted tag allowlist) before it ever
// reaches the client — rendering it via dangerouslySetInnerHTML here is safe as a result.
const ASSISTANT_HTML_CLASSES =
  '[&_p]:mb-2 [&_p:last-child]:mb-0 ' +
  '[&_strong]:font-semibold ' +
  '[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-0.5 [&_ul]:pl-4 ' +
  '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-0.5 [&_ol]:pl-4 ' +
  '[&_table]:mb-2 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-md [&_table]:border [&_table]:text-sm ' +
  '[&_th]:border-b [&_th]:p-2 [&_th]:text-left [&_th]:font-medium ' +
  '[&_td]:border-b [&_td]:p-2 [&_tr:last-child_td]:border-0';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AssistantWrapper: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  const [askAssistant, { isLoading }] = useAskAssistantMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

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
    }
  };

  return (
    <div className="no-scrollbar w-full space-y-2">
      <Row className="flex-col items-start">
        <TextElement as="h3" className="">
          Financial Assistant
        </TextElement>
        <TextElement as="p" className="text-[#5a6070]">
          Ask questions about your income, expenses, and investments. I can only
          read your data — I can&apos;t add, edit, or delete anything.
        </TextElement>
      </Row>

      <CustomBreadcrumb
        items={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Financial Assistant' },
        ]}
      />

      {messages.length !== 0 && (
        <div className="max-h-[65vh] w-full flex-1 space-y-3 overflow-y-auto rounded-md bg-white p-4">
          {messages.map((message, index) => (
            <Row
              key={index}
              className={`items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Sparkles className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`rounded-md px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary/5 text-primary-foreground max-w-[75%]'
                    : `bg-muted text-foreground max-w-[90%] ${ASSISTANT_HTML_CLASSES}`
                }`}
              >
                <TextElement>

                {message.role === 'assistant' ? (
                  <div
                  dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                ) : (
                  message.content
                )}
                </TextElement>
              </div>
            </Row>
          ))}

          {isLoading && <MessageSkeleton />}

          <div ref={scrollRef} />
        </div>
      )}

      <Row className="w-full items-end gap-2 pb-3">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk(input);
            }
          }}
          placeholder="Ask about your finances..."
          className="h-12 w-full bg-white"
        />

        <Button
          onClick={() => handleAsk(input)}
          disabled={isLoading || !input.trim()}
        >
          <Send className="size-4" />
        </Button>
      </Row>
    </div>
  );
};

export default AssistantWrapper;
