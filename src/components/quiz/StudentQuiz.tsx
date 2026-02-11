import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

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
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    await submitQuiz();
    setShowSubmitConfirm(false);
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
              <div className="text-center mt-6 space-y-3">
                 <Button asChild size="lg" className="w-full max-w-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg">
                    <Link to="/">
                       Quiz Completed - Go to Home
                       <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                 </Button>
                 
                 <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetchLeaderboard}
                  disabled={leaderboardLoading}
                  className="text-muted-foreground hover:text-primary transition-colors block mx-auto"
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
               <Button asChild size="lg" className="mt-4">
                    <Link to="/">Go to Home</Link>
               </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  } 


  // Waiting for host to start
  if (roomInfo?.status === 'waiting' && participantId) {
    return (
      <div className="quiz-container p-4 flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-2xl border shadow-xl"
        >
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
              <RefreshCw className="w-10 h-10 text-white animate-spin duration-3000" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Waiting for Host
            </h2>
            <p className="text-muted-foreground">
              Sit tight! The quiz will start soon.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Participants Joined
            </p>
            <p className="text-3xl font-bold text-foreground">
              {roomInfo.participantCount || 1}
            </p>
          </div>

          <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Connected as <span className="font-semibold text-foreground">{participantName}</span>
          </div>
        </motion.div>
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
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Time Remaining</span>
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
              <div className="text-center mt-6 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground max-w-md mx-auto">
                    Your rank can be modified till the last second of the quiz. Refresh for updates.
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetchLeaderboard}
                  disabled={leaderboardLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                  Refresh Leaderboard
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
               <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                 Great job! Sit tight while other participants finish.
               </p>
               <p className="text-sm text-yellow-600 bg-yellow-500/10 px-4 py-2 rounded-lg inline-block mb-8">
                  Your rank can be modified till the last second of the quiz.
               </p>
               
               <div>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={refetchLeaderboard}
                   disabled={leaderboardLoading}
                   className="gap-2"
                 >
                   <RefreshCw className={`w-4 h-4 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                   {leaderboardLoading ? 'Checking...' : 'Check Leaderboard'}
                 </Button>
               </div>
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

      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
