import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound, LogOut, ExternalLink, Copy, Check, RefreshCw,
  Users, Plus, ArrowLeft, Clock, Eye, Trophy, BookOpen,
  Radio, History, ChevronRight, Zap, Shield, StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminQuiz } from '@/hooks/useAdminQuiz';
import { useLeaderboard } from '@/hooks/useQuizRoom';
import { QuizCreator } from './QuizCreator';
import { QuizTimer } from './QuizTimer';
import { Leaderboard } from './Leaderboard';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: { scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
};

type AdminTab = 'quizzes' | 'ongoing' | 'recent';
type RoomView = 'participants' | 'leaderboard';

export function AdminPanel() {
  const {
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
    logout,
  } = useAdminQuiz();

  const [secretInput, setSecretInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [roomStatus, setRoomStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('quizzes');
  const [showCreate, setShowCreate] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [ongoingRooms, setOngoingRooms] = useState<any[]>([]);
  const [recentRooms, setRecentRooms] = useState<any[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [roomView, setRoomView] = useState<RoomView>('participants');

  // For leaderboard in recent rooms
  const [viewingRecentRoom, setViewingRecentRoom] = useState<string | null>(null);
  const { leaderboard, roomName: lbRoomName, loading: lbLoading, refetch: refetchLb } = useLeaderboard(viewingRecentRoom);

  // For leaderboard in active room (after completion)
  const activeRoomExpired = activeRoom && roomStatus?.room?.expiresAt
    ? new Date() > new Date(roomStatus.room.expiresAt)
    : false;
  const { leaderboard: activeRoomLb, loading: activeRoomLbLoading, refetch: refetchActiveRoomLb } = useLeaderboard(
    (activeRoom && (activeRoomExpired || roomView === 'leaderboard')) ? activeRoom.code : null
  );

  const shareUrl = activeRoom
    ? `${window.location.origin}/quiz/room/${activeRoom.code}`
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
      setShowCreate(false);
      fetchQuizzes();
    }
  };

  const handleStartRoom = (quizId: string) => {
    setSelectedQuizId(quizId);
    setShowDurationPicker(true);
  };

  const handleConfirmStartRoom = async () => {
    if (!selectedQuizId) return;
    await createRoom(selectedQuizId, durationMinutes);
    setShowDurationPicker(false);
    setSelectedQuizId(null);
    setDurationMinutes(60);
    setRoomView('participants');
  };

  const handleCancelRoom = async () => {
    if (!activeRoom) return;
    if (confirm('Are you sure you want to stop this quiz? All participants will be notified and the room will be closed.')) {
      await cancelRoom(activeRoom.code);
      fetchOngoingRooms();
      fetchRecentRooms();
    }
  };

  const fetchQuizzes = useCallback(async () => {
    const qs = await getQuizzes();
    setQuizzes(qs);
  }, [getQuizzes]);

  const fetchOngoingRooms = useCallback(async () => {
    const rooms = await getActiveRooms();
    setOngoingRooms(rooms);
  }, [getActiveRooms]);

  const fetchRecentRooms = useCallback(async () => {
    const rooms = await getRecentRooms();
    setRecentRooms(rooms);
  }, [getRecentRooms]);

  useEffect(() => {
    if (isAuthenticated && !activeRoom) {
      fetchQuizzes();
      fetchOngoingRooms();
      fetchRecentRooms();
    }
  }, [isAuthenticated, activeRoom, fetchQuizzes, fetchOngoingRooms, fetchRecentRooms]);

  const refreshStatus = useCallback(async () => {
    if (activeRoom) {
      const status = await getRoomStatus(activeRoom.code);
      if (status && status.success) {
        setRoomStatus(status);
      }
    }
  }, [activeRoom, getRoomStatus]);

  useEffect(() => {
    if (activeRoom) {
      refreshStatus();
      const interval = setInterval(refreshStatus, 5000);
      return () => clearInterval(interval);
    } else {
      setRoomStatus(null);
    }
  }, [activeRoom, refreshStatus]);

  // ─── AUTH SCREEN ──────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          {...fadeIn}
          className="w-full max-w-md"
        >
          <div className="relative p-8 rounded-2xl border bg-card shadow-xl overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

            <div className="relative text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Access
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your secret code to manage quizzes
              </p>
            </div>

            <form onSubmit={handleVerify} className="relative space-y-5">
              <div>
                <Label htmlFor="secretCode" className="text-sm font-medium">Secret Code</Label>
                <Input
                  id="secretCode"
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 h-11 bg-muted/50 border-muted-foreground/20 focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {error && (
                <motion.p {...fadeIn} className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading || !secretInput}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Verifying...' : 'Access Admin Panel'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── VIEWING RECENT ROOM LEADERBOARD ──────
  if (viewingRecentRoom) {
    return (
      <motion.div {...fadeIn} className="max-w-4xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => setViewingRecentRoom(null)}
          className="mb-4 hover:bg-violet-500/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {lbLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-violet-500 mb-4" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <Leaderboard entries={leaderboard} roomName={lbRoomName} />
        ) : (
          <div className="text-center py-12 border rounded-xl bg-card">
            <Trophy className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No results available for this room.</p>
            <Button variant="outline" size="sm" onClick={refetchLb} className="mt-3">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        )}
      </motion.div>
    );
  }

  // ─── ACTIVE ROOM VIEW ────────────────────
  if (activeRoom) {
    const participants = roomStatus?.room?.participants || [];
    const submitted = participants.filter((p: any) => p.submittedAt).length;
    const total = participants.length;

    return (
      <motion.div {...fadeIn} className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { exitRoom(); setRoomView('participants'); }}
              className="hover:bg-violet-500/10">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                Room: <span className="font-mono text-violet-600">{activeRoom.code}</span>
              </h1>
              <p className="text-xs text-muted-foreground">{activeRoom.quizTitle || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelRoom}
              disabled={loading}
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <StopCircle className="w-4 h-4 mr-1.5" />
              Stop Quiz
            </Button>
            <QuizTimer expiresAt={activeRoom.expiresAt} />
          </div>
        </div>

        {/* Share Card */}
        <motion.div {...fadeIn} className="p-5 rounded-xl border bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Share Link</h3>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm bg-background/80" />
            <Button variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" asChild className="shrink-0">
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Room Code: <span className="font-mono font-bold text-base text-violet-600">{activeRoom.code}</span>
          </p>
        </motion.div>

        {/* Room View Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border">
          {[
            { id: 'participants' as RoomView, label: 'Participants', icon: Users },
            { id: 'leaderboard' as RoomView, label: 'Leaderboard', icon: Trophy },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setRoomView(tab.id);
                if (tab.id === 'leaderboard') refetchActiveRoomLb();
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                roomView === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'participants' && (
                <span className="ml-1 text-xs bg-violet-500/10 text-violet-600 px-1.5 py-0.5 rounded-full">{total}</span>
              )}
            </button>
          ))}
        </div>

        {/* Participants View */}
        <AnimatePresence mode="wait">
          {roomView === 'participants' && (
            <motion.div key="participants" {...fadeIn} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-500" />
                  Live Participants
                  <span className="text-xs text-muted-foreground">({submitted}/{total} submitted)</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={refreshStatus} className="hover:bg-violet-500/10">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {total > 0 ? (
                <motion.div variants={staggerChildren} initial="initial" animate="animate" className="divide-y divide-border">
                  {participants.map((p: any, i: number) => (
                    <motion.div
                      key={i}
                      variants={fadeIn}
                      className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          p.submittedAt
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold">{p.score} pts</span>
                        {p.submittedAt ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                            Submitted
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                            Playing
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Waiting for participants to join...</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Leaderboard View */}
          {roomView === 'leaderboard' && (
            <motion.div key="leaderboard" {...fadeIn}>
              {activeRoomLbLoading ? (
                <div className="text-center py-12 rounded-xl border bg-card">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-violet-500 mb-4" />
                  <p className="text-muted-foreground">Loading leaderboard...</p>
                </div>
              ) : activeRoomLb.length > 0 ? (
                <>
                  <Leaderboard entries={activeRoomLb} roomName={activeRoom.quizTitle || ''} />
                  <div className="text-center mt-3">
                    <Button variant="ghost" size="sm" onClick={refetchActiveRoomLb} className="text-muted-foreground">
                      <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 rounded-xl border bg-card">
                  <Trophy className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-1">Leaderboard not available yet</p>
                  <p className="text-xs text-muted-foreground">Available after quiz ends or all participants submit</p>
                  <Button variant="outline" size="sm" onClick={refetchActiveRoomLb} className="mt-4">
                    <RefreshCw className="w-4 h-4 mr-2" /> Check Again
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ─── DURATION PICKER MODAL ────────────────
  const durationModal = showDurationPicker && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => { setShowDurationPicker(false); setSelectedQuizId(null); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-card border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-violet-500/25">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">Set Quiz Duration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How long should the quiz room stay open?
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min={5}
            max={480}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Math.max(5, parseInt(e.target.value) || 5))}
            className="text-center text-lg font-mono h-12"
          />
          <div className="flex gap-2 flex-wrap">
            {[15, 30, 45, 60, 90, 120].map(mins => (
              <button
                key={mins}
                onClick={() => setDurationMinutes(mins)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  durationMinutes === mins
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                    : 'bg-muted hover:bg-muted/80 border-transparent hover:border-violet-300'
                }`}
              >
                {mins < 60 ? `${mins}m` : `${mins / 60}h`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { setShowDurationPicker(false); setSelectedQuizId(null); }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/20"
            onClick={handleConfirmStartRoom}
            disabled={loading}
          >
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            {loading ? 'Creating...' : 'Start Room'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  // ─── TABS CONFIG ──────────────────────────
  const tabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'quizzes', label: 'Your Quizzes', icon: BookOpen, count: quizzes.length },
    { id: 'ongoing', label: 'Ongoing', icon: Radio, count: ongoingRooms.length },
    { id: 'recent', label: 'Recent', icon: History, count: recentRooms.length },
  ];

  // ─── MAIN DASHBOARD ──────────────────────
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <AnimatePresence>{durationModal}</AnimatePresence>

      {/* Header */}
      <motion.div {...fadeIn} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Quiz Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage quizzes, monitor rooms, view results</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>

      {/* Tab Bar */}
      <motion.div {...fadeIn} className="flex gap-1 p-1.5 rounded-xl bg-muted/50 border mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-500' : ''}`} />
            <span className="hidden sm:inline">{tab.label}</span>
            {(tab.count ?? 0) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-violet-500/10 text-violet-600'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ─── YOUR QUIZZES TAB ── */}
        {activeTab === 'quizzes' && !showCreate && (
          <motion.div key="quizzes" {...fadeIn} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Quizzes</h2>
              <Button onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/20">
                <Plus className="mr-2 h-4 w-4" /> Create Quiz
              </Button>
            </div>

            <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map(quiz => (
                <motion.div
                  key={quiz._id}
                  variants={fadeIn}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div
                    variants={cardHover}
                    className="border p-5 rounded-xl bg-card cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full" />
                    <div className="relative">
                      <h3 className="font-bold text-lg mb-1">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {quiz.questions.length} Questions
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all duration-200"
                        onClick={() => handleStartRoom(quiz._id)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Start Live Room
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              {quizzes.length === 0 && (
                <div className="col-span-full text-center py-12 border rounded-xl bg-muted/30">
                  <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No quizzes yet. Create one to get started!</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ─── CREATE QUIZ VIEW ── */}
        {activeTab === 'quizzes' && showCreate && (
          <motion.div key="create" {...fadeIn}>
            <Button variant="ghost" onClick={() => setShowCreate(false)} className="mb-4 hover:bg-violet-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quizzes
            </Button>
            <QuizCreator onSubmit={handleCreateQuiz} loading={loading} />
          </motion.div>
        )}

        {/* ─── ONGOING ROOMS TAB ── */}
        {activeTab === 'ongoing' && (
          <motion.div key="ongoing" {...fadeIn}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Ongoing Rooms
                {ongoingRooms.length > 0 && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </h2>
              <Button variant="ghost" size="sm" onClick={fetchOngoingRooms} className="hover:bg-violet-500/10">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>

            {ongoingRooms.length > 0 ? (
              <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ongoingRooms.map(room => {
                  const timeLeftMs = new Date(room.expiresAt).getTime() - Date.now();
                  const timeLeftMins = Math.max(0, Math.ceil(timeLeftMs / 60000));

                  return (
                    <motion.div key={room._id} variants={fadeIn} whileHover="hover" initial="rest" animate="rest">
                      <motion.div
                        variants={cardHover}
                        className="border rounded-xl p-5 bg-card cursor-pointer group relative overflow-hidden"
                        onClick={() => enterRoom(room)}
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold">{room.quizTitle}</h3>
                          <span className="font-mono text-xs bg-violet-500/10 text-violet-600 px-2 py-0.5 rounded-md font-bold">
                            {room.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {room.submittedCount}/{room.participantCount}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {timeLeftMins}m left
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-violet-600 font-medium group-hover:translate-x-1 transition-transform">
                          <Eye className="w-4 h-4 mr-1.5" />
                          View Room
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-12 border rounded-xl bg-muted/30">
                <Radio className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No ongoing rooms right now</p>
                <p className="text-xs text-muted-foreground mt-1">Start a live room from the "Your Quizzes" tab</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── RECENT QUIZZES TAB ── */}
        {activeTab === 'recent' && (
          <motion.div key="recent" {...fadeIn}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Quizzes</h2>
              <Button variant="ghost" size="sm" onClick={fetchRecentRooms} className="hover:bg-violet-500/10">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>

            {recentRooms.length > 0 ? (
              <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentRooms.map(room => {
                  const dateStr = new Date(room.expiresAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  });
                  const timeStr = new Date(room.expiresAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit',
                  });

                  return (
                    <motion.div key={room._id} variants={fadeIn} whileHover="hover" initial="rest" animate="rest">
                      <motion.div
                        variants={cardHover}
                        className="border rounded-xl p-5 bg-card cursor-pointer group relative overflow-hidden"
                        onClick={() => setViewingRecentRoom(room.code)}
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-indigo-500" />
                        <h3 className="font-bold mb-1">{room.quizTitle}</h3>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {dateStr} at {timeStr}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.participantCount} players
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                            Top: {room.topScore}/{room.totalQuestions}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-violet-600 font-medium group-hover:translate-x-1 transition-transform">
                          <Trophy className="w-4 h-4 mr-1.5" />
                          View Leaderboard
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-12 border rounded-xl bg-muted/30">
                <History className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No completed quizzes yet</p>
                <p className="text-xs text-muted-foreground mt-1">Completed quiz rooms will appear here</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p {...fadeIn} className="text-sm text-destructive mt-4 text-center bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </motion.p>
      )}
    </div>
  );
}
