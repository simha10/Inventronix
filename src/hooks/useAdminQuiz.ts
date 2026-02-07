import { useState, useCallback } from 'react';
import { quizApi } from '@/services/api';

export function useAdminQuiz() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('quiz_admin_session') === 'true';
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdRoom, setCreatedRoom] = useState<any>(null);

    const verifyAdmin = useCallback(async (secret: string) => {
        setLoading(true);
        setError(null);
        try {
            await quizApi.verifyAdmin(secret);
            sessionStorage.setItem('quiz_admin_session', 'true');
            setIsAuthenticated(true);
            return { success: true };
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const createRoom = useCallback(async (quizId: string) => {
        setLoading(true);
        try {
            const { data } = await quizApi.createRoom(quizId);
            setCreatedRoom(data.room);
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
            return data.quizzes;
        } catch (err) {
            return [];
        }
    }, []);

    const getRoomStatus = useCallback(async (roomId: string) => {
        try {
            const { data } = await quizApi.getRoomStatus(roomId);
            return data;
        } catch (err) {
            return null;
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('quiz_admin_session');
        setIsAuthenticated(false);
        setCreatedRoom(null);
    }, []);

    return {
        isAuthenticated,
        loading,
        error,
        createdRoom,
        verifyAdmin,
        createRoom,
        createQuiz,
        getQuizzes,
        getRoomStatus,
        logout
    };
}
