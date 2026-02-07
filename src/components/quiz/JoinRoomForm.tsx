import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JoinRoomFormProps {
  onJoin: (name: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
  roomName?: string;
  participantCount?: number;
  maxParticipants?: number;
}

export function JoinRoomForm({
  onJoin,
  loading,
  roomName,
  participantCount = 0,
  maxParticipants = 100,
}: JoinRoomFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    setError(null);
    const result = await onJoin(name.trim());
    
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="quiz-card max-w-md mx-auto p-4 border rounded-lg bg-card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{roomName || 'Join Quiz'}</h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {participantCount} / {maxParticipants} participants
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="participantName">Your Display Name</Label>
          <Input
            id="participantName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-1"
            maxLength={50}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This name will appear on the leaderboard
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Joining...' : 'Join Quiz'}
        </Button>
      </form>
    </div>
  );
}
