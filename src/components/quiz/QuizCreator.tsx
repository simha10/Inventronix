import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCreatorProps {
  onSubmit: (data: { title: string; questions: Question[] }) => void;
  loading?: boolean;
}

export function QuizCreator({ onSubmit, loading }: QuizCreatorProps) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validQuestions = questions.filter(
      (q) => q.question.trim() && q.options.every((o) => o.trim())
    );
    
    if (validQuestions.length === 0) {
      alert('Please add at least one complete question');
      return;
    }
    
    onSubmit({ title: title || 'New Quiz', questions: validQuestions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="quiz-card p-4 border rounded-lg bg-card">
        <Label htmlFor="quizTitle" className="text-lg font-semibold">
          Quiz Title
        </Label>
        <Input
          id="quizTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="mt-2"
        />
      </div>

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="quiz-card p-4 border rounded-lg bg-card animate-fade-in relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
            {questions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIndex)}
                className="text-destructive hover:text-destructive absolute top-4 right-4"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
              <Textarea
                id={`question-${qIndex}`}
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                placeholder="Enter your question"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="mb-2 block">Answer Options</Label>
              <RadioGroup
                value={question.correctAnswer.toString()}
                onValueChange={(value) =>
                  updateQuestion(qIndex, 'correctAnswer', parseInt(value))
                }
              >
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={oIndex.toString()}
                        id={`q${qIndex}-o${oIndex}`}
                        className="shrink-0"
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        className="flex-1"
                      />
                      {question.correctAnswer === oIndex && (
                        <span className="text-xs text-success font-medium shrink-0 text-green-600">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                Select the radio button next to the correct answer
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  );
}
