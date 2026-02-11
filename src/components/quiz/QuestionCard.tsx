import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Update interface if needed, relying on props passed from StudentQuiz
interface QuestionCardProps {
  question: {
      id: string;
      question: string;
      options: string[];
  };
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  onSelectAnswer: (answer: number) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div className="quiz-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="h-1 flex-1 mx-4 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6 leading-relaxed"
      >
        {question.question}
      </motion.h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectAnswer(index)}
            disabled={disabled}
            className={cn(
              'quiz-option flex items-center gap-3 w-full p-4 rounded-xl border transition-all text-left relative overflow-hidden group',
              selectedAnswer === index 
                ? 'selected border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                : 'bg-card/50 hover:border-primary/50'
            )}
          >
            {selectedAnswer === index && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shrink-0 z-10',
                selectedAnswer === index
                  ? 'bg-primary text-primary-foreground border-primary scale-110'
                  : 'bg-background border-muted-foreground/30 group-hover:border-primary/50 group-hover:text-primary'
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className={cn(
              "flex-1 transition-colors z-10",
              selectedAnswer === index ? "text-primary font-medium" : "text-foreground"
            )}>
              {option}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
