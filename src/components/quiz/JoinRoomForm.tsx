import { useState } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="quiz-card max-w-md mx-auto p-6 border rounded-xl bg-card/80 backdrop-blur-md shadow-2xl"
    >
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
        >
          {roomName || 'Join Quiz'}
        </motion.h2>
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-muted-foreground bg-secondary/30 py-1.5 px-3 rounded-full w-fit mx-auto"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {participantCount} / {maxParticipants} participants
          </span>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="participantName" className="text-base">Your Display Name</Label>
          <div className="relative group mt-2">
            <Input
              id="participantName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your name"
              className="h-12 border-input bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50 text-lg"
              maxLength={50}
              autoFocus
            />
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This name will appear on the leaderboard
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, x: -10 }}
              animate={{ opacity: 1, height: 'auto', x: [0, -5, 5, -5, 5, 0] }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mr-2"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            </motion.div>
          ) : 'Join Quiz'}
        </Button>
      </form>
    </motion.div>
  );
}
