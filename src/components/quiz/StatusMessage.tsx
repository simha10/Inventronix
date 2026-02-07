import { Loader2, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  status: 'loading' | 'waiting' | 'submitted' | 'expired' | 'error';
  message?: string;
  className?: string;
}

const statusConfig = {
  loading: {
    icon: Loader2,
    iconClass: 'animate-spin text-primary',
    bgClass: 'bg-primary/5',
    textClass: 'text-primary',
    defaultMessage: 'Loading...',
  },
  waiting: {
    icon: Clock,
    iconClass: 'text-warning',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning',
    defaultMessage: 'Waiting for results...',
  },
  submitted: {
    icon: CheckCircle,
    iconClass: 'text-success',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
    defaultMessage: 'Quiz submitted successfully!',
  },
  expired: {
    icon: AlertTriangle,
    iconClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    defaultMessage: 'This quiz has ended',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive',
    defaultMessage: 'An error occurred',
  },
};

export function StatusMessage({ status, message, className }: StatusMessageProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-xl',
        config.bgClass,
        className
      )}
    >
      <Icon className={cn('w-12 h-12 mb-4', config.iconClass)} />
      <p className={cn('text-lg font-medium text-center', config.textClass)}>
        {message || config.defaultMessage}
      </p>
    </div>
  );
}
