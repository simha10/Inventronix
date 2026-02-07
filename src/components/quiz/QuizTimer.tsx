import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';

interface QuizTimerProps {
  expiresAt: number | string | null;
  onExpire?: () => void;
  className?: string;
}

export function QuizTimer({ expiresAt, onExpire, className }: QuizTimerProps) {
  const { formattedTime, status } = useTimer({ expiresAt, onExpire });

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border',
        className
      )}
    >
      <Clock
        className={cn(
          'w-5 h-5',
          status === 'normal' && 'text-primary',
          status === 'warning' && 'text-warning',
          status === 'critical' && 'text-destructive animate-pulse',
          status === 'expired' && 'text-muted-foreground'
        )}
      />
      <span
        className={cn(
          'font-mono text-xl font-bold tabular-nums',
          status === 'normal' && 'text-primary',
          status === 'warning' && 'text-warning',
          status === 'critical' && 'text-destructive animate-countdown',
          status === 'expired' && 'text-muted-foreground'
        )}
      >
        {status === 'expired' ? 'Time Up!' : formattedTime}
      </span>
    </div>
  );
}
