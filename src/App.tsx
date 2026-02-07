import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileProvider } from "./contexts/mobile-context";
import Home from "./pages/Home";
import Creators from "./pages/Creators";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Quiz from "./pages/Quiz";
import QuizAdmin from "./pages/QuizAdmin";
import QuizRoom from "./pages/QuizRoom";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import { SmoothScroll } from "./components/SmoothScroll";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MobileProvider>
      <TooltipProvider>
        <SmoothScroll>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-background relative">
              <Navigation />
              <div className="relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/creators" element={<Creators />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/quiz/admin" element={<QuizAdmin />} />
                  <Route path="/quiz/room/:roomId" element={<QuizRoom />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </SmoothScroll>
      </TooltipProvider>
    </MobileProvider>
  </QueryClientProvider>
);

export default App;
