import { useState, useCallback } from 'react';
import { quizApi } from '@/services/api';

export function useAdminQuiz() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem('quiz_admin_secret');
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeRoom, setActiveRoom] = useState<any>(null);

    const verifyAdmin = useCallback(async (secret: string) => {
        setLoading(true);
        setError(null);
        try {
            await quizApi.verifyAdmin(secret);
            sessionStorage.setItem('quiz_admin_secret', secret);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const createRoom = useCallback(async (quizId: string, durationMinutes?: number) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await quizApi.createRoom(quizId, durationMinutes);
            setActiveRoom(data.room);
            return { success: true, room: data.room };
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create room');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const createQuiz = useCallback(async (quizData: any) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await quizApi.createQuiz(quizData);
            return { success: true, quiz: data.quiz };
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create quiz');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuizzes = useCallback(async () => {
        try {
            const { data } = await quizApi.getQuizzes();
            return data.quizzes || [];
        } catch (err) {
            return [];
        }
    }, []);

    const getActiveRooms = useCallback(async () => {
        try {
            const { data } = await quizApi.getActiveRooms();
            return data.rooms || [];
        } catch (err) {
            return [];
        }
    }, []);

    const getRecentRooms = useCallback(async () => {
        try {
            const { data } = await quizApi.getRecentRooms();
            return data.rooms || [];
        } catch (err) {
            return [];
        }
    }, []);

    const getRoomStatus = useCallback(async (roomCode: string) => {
        try {
            const { data } = await quizApi.getRoomStatus(roomCode);
            return data;
        } catch (err) {
            return null;
        }
    }, []);

    // Enter an existing room (from "Ongoing Rooms" list)
    const enterRoom = useCallback((room: any) => {
        setActiveRoom(room);
    }, []);

    // Exit room view (go back to list, NOT logout)
    const exitRoom = useCallback(() => {
        setActiveRoom(null);
    }, []);

    // Cancel an active room (admin stops the quiz)
    const cancelRoom = useCallback(async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            await quizApi.cancelRoom(code);
            setActiveRoom(null);
            return { success: true };
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to cancel room');
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('quiz_admin_secret');
        setIsAuthenticated(false);
        setActiveRoom(null);
    }, []);

    return {
        isAuthenticated,
        loading,
        error,
        activeRoom,
        verifyAdmin,
        createRoom,
        createQuiz,
        getQuizzes,
        getActiveRooms,
        getRecentRooms,
        getRoomStatus,
        enterRoom,
        exitRoom,
        cancelRoom,
        logout
    };
}
