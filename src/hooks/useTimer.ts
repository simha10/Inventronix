import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
    expiresAt: string | number | Date | null;
    onExpire?: () => void;
}

export function useTimer({ expiresAt, onExpire }: UseTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);

    const calculateTimeRemaining = useCallback(() => {
        if (!expiresAt) return 0;
        const expiry = new Date(expiresAt).getTime();
        const remaining = Math.max(0, expiry - Date.now());
        return Math.floor(remaining / 1000);
    }, [expiresAt]);

    useEffect(() => {
        if (!expiresAt) return;

        const updateTimer = () => {
            const remaining = calculateTimeRemaining();
            setTimeRemaining(remaining);

            if (remaining <= 0 && !isExpired) {
                setIsExpired(true);
                if (onExpire) onExpire();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, calculateTimeRemaining, isExpired, onExpire]);

    const formatTime = useCallback((seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const getTimerStatus = useCallback(() => {
        if (isExpired) return 'expired';
        if (timeRemaining <= 60) return 'critical';
        if (timeRemaining <= 300) return 'warning';
        return 'normal';
    }, [timeRemaining, isExpired]);

    return {
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        isExpired,
        status: getTimerStatus(),
    };
}
