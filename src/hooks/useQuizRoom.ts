import { useState, useEffect, useCallback, useRef } from 'react';
import { quizApi } from '@/services/api';

const STORAGE_KEY_PREFIX = 'quiz_participant_';

export function useQuizRoom(roomCode: string | null) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [participantName, setParticipantName] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [roomInfo, setRoomInfo] = useState<any | null>(null);
    const initializedRef = useRef(false);

    const [status, setStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');

    // Get stored participant data
    const getStoredData = useCallback(() => {
        if (!roomCode) return null;
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${roomCode}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return null;
            }
        }
        return null;
    }, [roomCode]);

    // Store participant data
    const storeData = useCallback((data: any) => {
        if (!roomCode) return;
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${roomCode}`, JSON.stringify(data));
    }, [roomCode]);

    // Fetch public room info
    const fetchRoomInfo = useCallback(async () => {
        if (!roomCode) return;

        setLoading(true);
        try {
            const { data } = await quizApi.getRoomInfo(roomCode);
            setRoomInfo(data);
            setExpiresAt(data.expiresAt);
            setStatus(data.status || 'active'); // Default to active if field missing (backward compat)
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Room not found. Please check the code and try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [roomCode]);

    // Join room
    const joinRoom = useCallback(async (name: string) => {
        if (!roomCode) return { success: false, error: 'No room code' };

        setLoading(true);
        setError(null);

        try {
            const { data } = await quizApi.joinRoom(roomCode, name);

            setParticipantId(data.participantId);
            setParticipantName(name);
            setQuestions(data.questions);
            setExpiresAt(data.expiresAt);
            setIsSubmitted(data.isSubmitted || false);
            // Don't set status here? Join response might not have it. 
            // Actually, join response doesn't consistently return status in my route update? 
            // I should double check. But polling will fix it.
            // Let's assume polling handles status updates.

            // If re-joining, restore answers
            const restoredAnswers: Record<string, number> = {};
            if (data.answers) {
                for (const [key, val] of Object.entries(data.answers)) {
                    restoredAnswers[key] = typeof val === 'string' ? parseInt(val as string) : (val as number);
                }
            }
            setAnswers(restoredAnswers);

            if (data.roomName) {
                setRoomInfo(prev => ({ ...prev, name: data.roomName }));
            }

            storeData({
                participantId: data.participantId,
                name,
                answers: restoredAnswers,
                submitted: data.isSubmitted || false,
            });

            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Failed to join room';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, [roomCode, storeData]);

    // Save answer
    const saveAnswer = useCallback(async (questionId: string, answer: number) => {
        if (!participantId || !roomCode) return;

        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        storeData({
            participantId,
            name: participantName,
            answers: newAnswers,
            submitted: isSubmitted,
        });

        try {
            await quizApi.submitAnswer(roomCode, participantId, { [questionId]: answer });
        } catch (err) {
            console.error('Failed to sync answer:', err);
        }
    }, [participantId, roomCode, answers, participantName, isSubmitted, storeData]);

    // Submit quiz
    const submitQuiz = useCallback(async () => {
        if (!participantId || !roomCode) return { success: false };

        try {
            const { data } = await quizApi.submitQuiz(roomCode, participantId);

            setIsSubmitted(true);
            storeData({
                participantId,
                name: participantName,
                answers,
                submitted: true,
            });
            return { success: true, score: data.score };
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Failed to submit';
            setError(msg);
            return { success: false, error: msg };
        }
    }, [participantId, roomCode, participantName, answers, storeData]);

    // Re-hydrate from storage & re-join on mount
    useEffect(() => {
        if (!roomCode || initializedRef.current) return;
        initializedRef.current = true;

        const stored = getStoredData();
        if (stored && stored.participantId && stored.name) {
            // Attempt to re-join (backend handles dedup by name)
            (async () => {
                setLoading(true);
                try {
                    const { data } = await quizApi.joinRoom(roomCode, stored.name);
                    setParticipantId(data.participantId);
                    setParticipantName(stored.name);
                    setQuestions(data.questions);
                    setExpiresAt(data.expiresAt);
                    setIsSubmitted(data.isSubmitted || false);

                    const restoredAnswers: Record<string, number> = {};
                    if (data.answers) {
                        for (const [key, val] of Object.entries(data.answers)) {
                            restoredAnswers[key] = typeof val === 'string' ? parseInt(val as string) : (val as number);
                        }
                    }
                    setAnswers(restoredAnswers);

                    if (data.roomName) {
                        setRoomInfo(prev => ({ ...prev, name: data.roomName }));
                    }
                } catch {
                    // If re-join fails (expired, etc), clear stored data
                    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${roomCode}`);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            fetchRoomInfo();
        }
    }, [roomCode, getStoredData, fetchRoomInfo]);

    // Poll for status/cancellation
    useEffect(() => {
        if (!roomCode) return;

        const checkStatus = async () => {
            try {
                const { data } = await quizApi.getRoomInfo(roomCode);

                // Update cancellation
                if (data.isCancelled) setIsCancelled(true);

                // Update status (e.g. waiting -> active)
                if (data.status) setStatus(data.status);

                // Update expiry if it changed (e.g. quiz started)
                if (data.expiresAt && data.expiresAt !== expiresAt) {
                    setExpiresAt(data.expiresAt);
                }

                // Update roomInfo (for participant count)
                setRoomInfo(prev => ({
                    ...prev,
                    ...data,
                }));
            } catch {
                // Ignore polling errors
            }
        };

        // Poll more frequently if waiting (2s), less if active (5s)
        const intervalMs = status === 'waiting' ? 2000 : 5000;
        const interval = setInterval(checkStatus, intervalMs);
        return () => clearInterval(interval);
    }, [roomCode, expiresAt, status]);

    return {
        loading,
        error,
        roomInfo,
        questions,
        answers,
        participantId,
        participantName,
        isSubmitted,
        isCancelled,
        expiresAt,
        status,
        joinRoom,
        saveAnswer,
        submitQuiz,
        refetch: fetchRoomInfo,
    };
}

export function useLeaderboard(roomCode: string | null) {
    const [loading, setLoading] = useState(false);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [roomName, setRoomName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        if (!roomCode) return;

        setLoading(true);
        try {
            const { data } = await quizApi.getLeaderboard(roomCode);
            setLeaderboard(data.leaderboard || []);
            setRoomName(data.roomName || '');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Leaderboard not available yet');
        } finally {
            setLoading(false);
        }
    }, [roomCode]);

    useEffect(() => {
        if (roomCode) {
            fetchLeaderboard();
        }
    }, [roomCode, fetchLeaderboard]);

    return { loading, leaderboard, roomName, error, refetch: fetchLeaderboard };
}
