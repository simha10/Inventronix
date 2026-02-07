import { Trophy, Medal, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/quiz';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  roomName?: string;
  currentParticipant?: string;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function Leaderboard({ entries, roomName, currentParticipant }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="quiz-card text-center py-12">
        <Medal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No results yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Results will appear here after the quiz ends
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      {roomName && (
        <div className="text-center mb-6">
          <Trophy className="w-10 h-10 mx-auto text-warning mb-2" />
          <h2 className="text-2xl font-bold">{roomName}</h2>
          <p className="text-muted-foreground">Final Leaderboard</p>
        </div>
      )}

      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <div
            key={`${entry.name}-${entry.rank}`}
            className={cn(
              'leaderboard-row py-3 flex items-center justify-between', // added explicit flex
              currentParticipant === entry.name && 'bg-primary/5 rounded-lg px-2'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'leaderboard-rank w-8 h-8 flex items-center justify-center font-bold rounded-full', // Added styles
                  entry.rank === 1 && 'bg-yellow-100 text-yellow-700',
                  entry.rank === 2 && 'bg-gray-100 text-gray-700',
                  entry.rank === 3 && 'bg-orange-100 text-orange-700',
                  entry.rank > 3 && 'bg-muted text-muted-foreground'
                )}
              >
                {entry.rank === 1 && <Trophy className="w-4 h-4" />}
                {entry.rank === 2 && <Medal className="w-4 h-4" />}
                {entry.rank === 3 && <Medal className="w-4 h-4" />}
                {entry.rank > 3 && entry.rank}
              </div>
              <div>
                <p className="font-medium">
                  {entry.name}
                  {currentParticipant === entry.name && (
                    <span className="ml-2 text-xs text-primary">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(entry.timeTaken)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {entry.score}/{entry.totalQuestions}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round((entry.score / entry.totalQuestions) * 100)}% correct
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
