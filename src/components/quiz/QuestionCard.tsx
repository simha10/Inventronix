import { cn } from '@/lib/utils';

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
    <div className="quiz-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="h-1 flex-1 mx-4 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            disabled={disabled}
            className={cn(
              'quiz-option flex items-center gap-3 w-full p-3 rounded-lg border transition-all hover:bg-muted/50', // Added some base styles as 'quiz-option' class might not exist in globals
              selectedAnswer === index && 'selected border-primary bg-primary/5'
            )}
          >
            <span
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all',
                selectedAnswer === index
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border'
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-left flex-1">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
