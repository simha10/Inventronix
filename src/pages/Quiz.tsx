import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Quiz() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/quiz/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Live Quiz Room</h1>
            <p className="text-muted-foreground">
              Join an existing quiz or create a new one
            </p>
          </div>

          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Quiz</TabsTrigger>
              <TabsTrigger value="admin">Admin Access</TabsTrigger>
            </TabsList>

            <TabsContent value="join" className="mt-6">
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Join a Quiz Room</h2>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input
                      id="roomCode"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Enter 6-digit code"
                      className="mt-1 uppercase font-mono tracking-widest"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the room code shared by your instructor
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={!roomCode.trim()}>
                    Join Room
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <div className="text-center">
                  <KeyRound className="w-10 h-10 mx-auto text-primary mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Admin Access</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Create and manage quiz rooms with your admin credentials
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/quiz/admin">
                      Access Admin Panel
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Need help? Check our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
