import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    isCancelled,
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

  // Activate leaderboard when expired OR submitted
  const showLeaderboard = isExpired || isSubmitted;
  const {
    leaderboard,
    roomName: leaderboardRoomName,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useLeaderboard(showLeaderboard ? (roomId || null) : null);

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  
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
      <div className="quiz-container p-4 min-h-[50vh] flex items-center justify-center">
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

  // Room cancelled by admin
  if (isCancelled) {
    return (
      <div className="quiz-container p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-12"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-destructive mb-2">Room Cancelled</h2>
            <p className="text-muted-foreground">
              The admin has cancelled this quiz room.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/quiz">Back to Quiz Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  // Room expired - show leaderboard
  if ((isExpired || roomInfo?.isExpired) && participantId) {
    return (
      <div className="quiz-container p-4">
        <AnimatePresence>
          {leaderboard.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Leaderboard
                entries={leaderboard}
                roomName={leaderboardRoomName || roomInfo?.name}
                currentParticipant={participantName || undefined}
              />
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetchLeaderboard}
                  disabled={leaderboardLoading}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                  Refresh Results
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center space-y-4 py-8">
               <StatusMessage
                  status="expired"
                  message="This quiz has ended. Loading results..."
               />
               {leaderboardError && (
                 <p className="text-sm text-muted-foreground">{leaderboardError}</p>
               )}
               <Button
                 variant="outline"
                 onClick={refetchLeaderboard}
                 disabled={leaderboardLoading}
               >
                 <RefreshCw className={`w-4 h-4 mr-2 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                 {leaderboardLoading ? 'Loading...' : 'Load Leaderboard'}
               </Button>
            </div>
          )}
        </AnimatePresence>
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
      <div className="quiz-container p-4 pt-12">
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

        <AnimatePresence mode="wait">
          {leaderboard.length > 0 ? (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Leaderboard
                entries={leaderboard}
                roomName={leaderboardRoomName || roomInfo?.name}
                currentParticipant={participantName || undefined}
              />
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetchLeaderboard}
                  disabled={leaderboardLoading}
                  className="text-muted-foreground"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                  Refresh Results
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-xl border"
            >
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                 className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
               >
                 <CheckCircle className="w-10 h-10 text-green-500" />
               </motion.div>
               <h2 className="text-2xl font-bold mb-2">Quiz Submitted!</h2>
               <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                 Great job! Sit tight while other participants finish. The leaderboard will appear shortly.
               </p>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={refetchLeaderboard}
                 disabled={leaderboardLoading}
                 className="animate-pulse hover:animate-none"
               >
                 <RefreshCw className={`w-4 h-4 mr-2 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                 {leaderboardLoading ? 'Checking...' : 'Check Leaderboard'}
               </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="quiz-container max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6 bg-card/50 p-4 rounded-xl border backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            {roomInfo?.name || 'Quiz Session'}
          </h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Player: <span className="text-foreground">{participantName}</span>
          </p>
        </div>
        <QuizTimer expiresAt={expiresAt} />
      </div>

      <AnimatePresence mode="wait">
        {currentQ && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQ}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQ.id]}
              onSelectAnswer={handleSelectAnswer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {/* Question Navigation Dots */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-md px-4 pb-2 scrollbar-hide">
          {questions.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentQuestion(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentQuestion
                  ? 'bg-primary ring-4 ring-primary/20 scale-125'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-primary/50 hover:bg-primary/70'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Submit Quiz
            <Send className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="transition-transform active:scale-95"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
