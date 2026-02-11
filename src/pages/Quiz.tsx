import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, KeyRound, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
            >
              <Play className="w-8 h-8 text-primary fill-primary/20" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Live Quiz Room
            </h1>
            <p className="text-muted-foreground">
              Join an existing quiz or create a new one
            </p>
          </div>

          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="join" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">Join Quiz</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">Admin Access</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="join" className="mt-6 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-shadow duration-500"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 rounded-full bg-primary" />
                    Join a Quiz Room
                  </h2>
                  <form onSubmit={handleJoinRoom} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="roomCode" className="text-sm font-medium">Room Code</Label>
                      <div className="relative group">
                        <Input
                          id="roomCode"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE"
                          className="h-12 uppercase font-mono tracking-[0.2em] text-center text-lg bg-background/50 border-input transition-all duration-300 focus:ring-2 focus:ring-primary/20 group-hover:border-primary/50"
                          maxLength={6}
                        />
                        <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-transparent group-hover:ring-primary/10 pointer-events-none transition-all duration-300" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Enter the 6-character code shared by your host
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" 
                      disabled={!roomCode.trim()}
                    >
                      Join Room
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>

              <TabsContent value="admin" className="mt-6 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 border rounded-xl bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5"
                >
                  <div className="text-center">
                    <motion.div 
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mx-auto bg-secondary/30 rounded-full flex items-center justify-center mb-6"
                    >
                      <KeyRound className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-3">Admin Access</h2>
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                      Create quizzes, manage rooms, and view live results with your admin credentials
                    </p>
                    <Button asChild className="w-full h-11" variant="outline">
                      <Link to="/quiz/admin" className="group">
                        Access Admin Panel
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>Need help? Check our <Link to="/faq" className="text-primary hover:underline hover:text-primary-glow transition-colors">FAQ page</Link></p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
