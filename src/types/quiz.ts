export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface QuizRoom {
    id: string;
    name: string;
    questions: QuizQuestion[];
    createdAt: number; // or Date string if from API
    expiresAt: number | string;
    isActive: boolean;
}

export interface QuizRoomInfo {
    id: string;
    name: string;
    questionCount: number;
    expiresAt: string | number;
    isExpired: boolean;
    canJoin: boolean;
    participantCount: number;
    isFull: boolean;
}

export interface Participant {
    id: string;
    name: string;
    roomId: string;
    answers: Record<string, string>; // answers as value, not index? Models says String. Logic in BE says check vs correctAnswer.
    // Frontend QuestionCard uses index (number). Backend `submit`/`save-answer` logic:
    // In `useQuizRoom` I used `saveAnswer(currentQ.id, answer)`. `answer` from `handleSelectAnswer` is index (number).
    // But `useQuizRoom` line 205 sends `answers[currentQ.id]`.
    // Wait, `saveAnswer` signature in `useQuizRoom`: `(questionId: string, answer: string)`.
    // `handleSelectAnswer` in `StudentQuiz` passes `answer: number`. 
    // I should align types. `QuestionCard` returns index. Backend stores answer. 
    // If `Quiz` model `correctAnswer` is string ("A", or "Option Text"?), then we map index to value.
    // If `Quiz` model `correctAnswer` is index (0-3), then we store number.
    // `live-quiz-spark` `QuizCreator` sets `correctAnswer` as number (index).
    // `live-quiz-spark` `QuestionCard` passes index.
    // `live-quiz-spark` `useQuizRoom` -> `answers` state is `Record<string, number>`.
    // My `Room.js` model says `answers: { type: Map, of: String }`. Map values in Mongoose are usually strings if undefined, but can be Number.
    // I should update `types/quiz.ts` to use `number` for answers to match `live-quiz-spark` logic.
    // And update `useQuizRoom` to use `number`.
    submittedAt: number | null;
    startedAt: number;
    score: number;
    timeTaken: number;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    timeTaken: number;
    totalQuestions: number;
}
