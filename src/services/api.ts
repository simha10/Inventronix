import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include admin secret when authenticated
api.interceptors.request.use((config) => {
    const adminSecret = sessionStorage.getItem('quiz_admin_secret');
    if (adminSecret) {
        config.headers['x-admin-secret'] = adminSecret;
    }
    return config;
});

export const quizApi = {
    // Admin
    verifyAdmin: (secret: string) => api.post('/admin/verify', {}, { headers: { 'x-admin-secret': secret } }),
    createQuiz: (data: any) => api.post('/quiz/create', data),
    getQuizzes: () => api.get('/quiz'),
    createRoom: (quizId: string, durationMinutes?: number) =>
        api.post('/room/create', { quizId, durationMinutes }),
    getActiveRooms: () => api.get('/room/active'),
    getRecentRooms: () => api.get('/room/recent'),
    getRoomStatus: (code: string) => api.get(`/room/${code}/status`),
    cancelRoom: (code: string) => api.post(`/room/${code}/cancel`),
    startRoom: (code: string) => api.post(`/room/${code}/start`),
    deleteRoom: (code: string) => api.delete(`/room/${code}`),

    // Student / Public
    getRoomInfo: (code: string) => api.get(`/room/${code}/info`),
    joinRoom: (code: string, name: string) => api.post('/room/join', { code, name }),
    submitAnswer: (code: string, participantId: string, answers: any) =>
        api.post(`/room/${code}/submit`, { participantId, answers }),
    submitQuiz: (code: string, participantId: string) =>
        api.post(`/room/${code}/submit`, { participantId, submit: true }),
    getLeaderboard: (code: string) => api.get(`/room/${code}/leaderboard`),
};
