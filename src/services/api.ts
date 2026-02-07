import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include admin secret if available
api.interceptors.request.use((config) => {
    const secret = sessionStorage.getItem('quiz_admin_session');
    if (secret) {
        config.headers['x-admin-secret'] = process.env.VITE_ADMIN_SECRET_KEY || 'admin123';
    }
    return config;
});

export const quizApi = {
    // Admin
    verifyAdmin: (secret: string) => api.post('/admin/verify', {}, { headers: { 'x-admin-secret': secret } }),
    createQuiz: (data: any) => api.post('/quiz/create', data),
    getQuizzes: () => api.get('/quiz'),
    createRoom: (quizId: string) => api.post('/room/create', { quizId }),
    getRoomStatus: (code: string) => api.get(`/room/${code}/status`),

    // Student
    joinRoom: (code: string, name: string) => api.post('/room/join', { code, name }),
    submitAnswer: (code: string, participantId: string, answers: any) => api.post(`/room/${code}/submit`, { participantId, answers }),
    submitQuiz: (code: string, participantId: string) => api.post(`/room/${code}/submit`, { participantId, submit: true }),
};
