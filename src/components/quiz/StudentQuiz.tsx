import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizRoom, useLeaderboard } from '@/hooks/useQuizRoom';
import { useTimer } from '@/hooks/useTimer';
import { QuizTimer } from './QuizTimer';
import { QuestionCard } from './QuestionCard';
import { JoinRoomForm } from './JoinRoomForm';
import { StatusMessage } from './StatusMessage';
import { Leaderboard } from './Leaderboard';

export function StudentQuiz() {
  const { roomId } = useParams<{ roomId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    loading,
    error,
    roomInfo,
    questions,
    answers,
    participantId,
    participantName,
    isSubmitted,
    expiresAt,
    joinRoom,
    saveAnswer,
    submitQuiz,
  } = useQuizRoom(roomId || null);

  const { isExpired } = useTimer({
    expiresAt: expiresAt || null,
    onExpire: () => {
      if (participantId && !isSubmitted) {
        submitQuiz();
      }
    },
  });

  const { leaderboard, roomName: leaderboardRoomName } = useLeaderboard(
    isExpired ? roomId || null : null
  );

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  // const allAnswered = answeredCount === questions.length;
  // answers keys might be different from question count if we skip.
  
  const handleSelectAnswer = (answer: number) => {
    if (currentQ) {
      saveAnswer(currentQ.id, answer);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      await submitQuiz();
    }
  };

  // Loading state
  if (loading && !participantId && !roomInfo) {
    return (
      <div className="quiz-container p-4">
        <StatusMessage status="loading" message="Loading quiz..." />
      </div>
    );
  }

  // Error state
  if (error && !roomInfo && !participantId) {
    return (
      <div className="quiz-container p-4">
        <StatusMessage status="error" message={error} />
        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/quiz">Back to Quiz Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Room expired - show leaderboard
  if ((isExpired || roomInfo?.isExpired) && participantId) {
    return (
      <div className="quiz-container p-4">
        {leaderboard.length > 0 ? (
          <Leaderboard
            entries={leaderboard}
            roomName={leaderboardRoomName || roomInfo?.name}
            currentParticipant={participantName || undefined}
          />
        ) : (
          <div className="text-center">
             <StatusMessage
                status="expired"
                message="This quiz has ended. Loading results..."
             />
             <p className="text-muted-foreground mt-4">If leaderboard doesn't load, the room might be closed.</p>
          </div>
        )}
        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/quiz">Back to Quiz Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Join room form
  if (!participantId) {
    return (
      <div className="quiz-container p-4">
        <div className="mb-6 flex justify-center">
             {/* Timer logic here might be tricky if we don't have expiresAt yet */}
        </div>
        <JoinRoomForm
          onJoin={joinRoom}
          loading={loading}
          roomName={roomInfo?.name}
          participantCount={roomInfo?.participantCount}
        />
      </div>
    );
  }

  // Quiz submitted - waiting for results
  if (isSubmitted) {
    return (
      <div className="quiz-container p-4">
        <div className="mb-6 flex justify-center">
          <QuizTimer expiresAt={expiresAt} />
        </div>
        <StatusMessage
          status="waiting"
          message="Quiz submitted! Waiting for results..."
        />
        <p className="text-center text-muted-foreground mt-4">
          The leaderboard will be available when the timer ends
        </p>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="quiz-container max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{roomInfo?.name || 'Quiz'}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {participantName}
          </p>
        </div>
        <QuizTimer expiresAt={expiresAt} />
      </div>

      {currentQ && (
        <QuestionCard
          question={currentQ}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQ.id]}
          onSelectAnswer={handleSelectAnswer}
        />
      )}

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2 overflow-auto max-w-[200px] md:max-w-md px-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors border shrink-0 ${
                index === currentQuestion
                  ? 'bg-primary text-primary-foreground'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {answeredCount} of {questions.length} questions answered
      </p>
    </div>
  );
}
