import Skeleton from 'react-loading-skeleton';
import Row from '@/components/common/Row';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';

const MessageSkeleton = () => (
  <Row className="items-start gap-2">
    <Avatar size="lg">
      <AvatarFallback className="bg-primary/20 text-primary">
        <Sparkles className="size-3.5" />
      </AvatarFallback>
    </Avatar>

    <div className="max-w-[75%] rounded-xl bg-muted px-3 py-2">
      <Skeleton width={180} height={14} />
    </div>
  </Row>
);

export default MessageSkeleton;
