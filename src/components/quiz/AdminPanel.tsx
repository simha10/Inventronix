import { useState, useEffect, useCallback } from 'react';
import { KeyRound, LogOut, ExternalLink, Copy, Check, RefreshCw, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminQuiz } from '@/hooks/useAdminQuiz';
import { QuizCreator } from './QuizCreator';
import { QuizTimer } from './QuizTimer';
import { Leaderboard } from './Leaderboard';

export function AdminPanel() {
  const {
    isAuthenticated,
    loading,
    error,
    createdRoom,
    verifyAdmin,
    createRoom,
    createQuiz,
    getQuizzes,
    getRoomStatus,
    logout,
  } = useAdminQuiz();

  const [secretInput, setSecretInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [roomStatus, setRoomStatus] = useState<any>(null);
  const [view, setView] = useState<'list' | 'create' | 'room'>('list');
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const shareUrl = createdRoom
    ? `${window.location.origin}/quiz/room/${createdRoom.code}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyAdmin(secretInput);
  };

  const handleCreateQuiz = async (data: any) => {
    const result = await createQuiz(data);
    if (result.success) {
        setView('list');
        fetchQuizzes();
    }
  };
  
  const fetchQuizzes = useCallback(async () => {
      const qs = await getQuizzes();
      setQuizzes(qs);
  }, [getQuizzes]);

  useEffect(() => {
      if (isAuthenticated) {
          fetchQuizzes();
      }
  }, [isAuthenticated, fetchQuizzes]);

  const refreshStatus = useCallback(async () => {
    if (createdRoom) {
      const status = await getRoomStatus(createdRoom.code);
      if (status && status.success) {
        setRoomStatus(status);
      }
    }
  }, [createdRoom, getRoomStatus]);

  useEffect(() => {
    if (createdRoom) {
      refreshStatus();
      const interval = setInterval(refreshStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [createdRoom, refreshStatus]);

  if (!isAuthenticated) {
    return (
      <div className="quiz-container max-w-md mx-auto p-4">
        <div className="quiz-card p-6 border rounded-lg bg-card shadow-sm">
          <div className="text-center mb-6">
            <KeyRound className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold">Admin Access</h2>
            <p className="text-muted-foreground mt-2">
              Enter the secret code to access admin features
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="secretCode">Secret Code</Label>
              <Input
                id="secretCode"
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Enter secret code"
                className="mt-1"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (createdRoom) {
    return (
      <div className="quiz-container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Room: {createdRoom.code}</h1>
          <div className="flex items-center gap-4">
            <QuizTimer expiresAt={createdRoom.expiresAt} />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>

        <div className="quiz-card p-6 border rounded-lg bg-card">
          <h3 className="font-semibold mb-3">Share Link</h3>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" asChild>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="quiz-card p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants ({roomStatus?.room?.participants?.length || 0})
            </h3>
            <Button variant="ghost" size="sm" onClick={refreshStatus}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {roomStatus?.room?.participants?.length > 0 ? (
            <div className="divide-y divide-border">
              {roomStatus.room.participants.map((p: any, i: number) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <span>{p.name}</span>
                  <div className="text-sm text-muted-foreground flex gap-2">
                    <span>{p.score} pts</span>
                    {p.submittedAt ? (
                      <span className="text-success text-green-600">Submitted</span>
                    ) : (
                      <span>Playing...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No participants yet
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quiz Admin</h1>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {view === 'list' && (
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Quizzes</h2>
                  <Button onClick={() => setView('create')}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Quiz
                  </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quizzes.map(quiz => (
                      <div key={quiz._id} className="border p-4 rounded-lg bg-card hover:shadow-md transition-shadow">
                          <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{quiz.questions.length} Questions</p>
                          <Button className="w-full" onClick={() => createRoom(quiz._id)}>
                              Start Live Room
                          </Button>
                      </div>
                  ))}
                  {quizzes.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                          No quizzes found. Create one to get started!
                      </div>
                  )}
              </div>
          </div>
      )}

      {view === 'create' && (
          <div>
              <Button variant="ghost" onClick={() => setView('list')} className="mb-4">
                   &larr; Back to Quizzes
              </Button>
              <QuizCreator onSubmit={handleCreateQuiz} loading={loading} />
          </div>
      )}

      {error && (
        <p className="text-sm text-destructive mt-4 text-center">{error}</p>
      )}
    </div>
  );
}
