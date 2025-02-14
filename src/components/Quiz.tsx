import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface QuizProps {
  settings: {
    questionCount: number;
    difficulty: number;
    timeLimit: boolean;
    timeLimitSeconds: number;
  };
  onComplete: () => void;
  onBack: () => void;
}

export const Quiz = ({ settings, onComplete, onBack }: QuizProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.timeLimitSeconds);
  const [results, setResults] = useState<{ question: string; correct: boolean; userAnswer: string; actualAnswer: string }[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Clear previous results when starting new session
    localStorage.removeItem("quizResults");
    
    const storedQuestions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");
    const validQuestions = storedQuestions.filter((q: any) => {
      const isValid = q.question && q.answer && q.difficulty === settings.difficulty;
      if (!isValid) {
        console.warn("Invalid question found:", q);
      }
      return isValid;
    });
    
    if (validQuestions.length === 0) {
      setErrorMessage("No valid questions found for the selected difficulty!");
      setShowError(true);
      return;
    }

    if (validQuestions.length < settings.questionCount) {
      toast.warning(`Only ${validQuestions.length} valid questions available. Adjusting quiz length.`);
    }

    const shuffled = [...validQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(settings.questionCount, validQuestions.length)));
  }, []);

  useEffect(() => {
    if (settings.timeLimit && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, settings.timeLimit]);

  const handleAnswer = () => {
    const currentQuestion = questions[currentIndex];
    
    if (!currentQuestion || !currentQuestion.answer) {
      setErrorMessage("Question or answer is missing!");
      setShowError(true);
      return;
    }

    const userAnswer = answer.toLowerCase().trim();
    const correctAnswer = currentQuestion.answer.toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("Correct answer!");
    } else {
      document.body.classList.add("shake");
      document.body.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
      toast.error(`Wrong answer! The correct answer is: ${currentQuestion.answer}`);
      setTimeout(() => {
        document.body.classList.remove("shake");
        document.body.style.backgroundColor = "";
      }, 820);
    }

    setResults(prev => [...prev, {
      question: currentQuestion.question,
      correct: isCorrect,
      userAnswer: answer,
      actualAnswer: currentQuestion.answer
    }]);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setAnswer("");
        setTimeLeft(settings.timeLimitSeconds);
      }, 1000);
    } else {
      localStorage.setItem("quizResults", JSON.stringify([...results, {
        question: currentQuestion.question,
        correct: isCorrect,
        userAnswer: answer,
        actualAnswer: currentQuestion.answer
      }]));
      onComplete();
    }
  };

  if (questions.length === 0 && !showError) return <div>Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <AlertDialog open={showError} onOpenChange={(open) => {
        setShowError(open);
        if (!open) onBack();
      }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-destructive">
              {errorMessage}
            </AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <span>Question {currentIndex + 1}/{questions.length}</span>
        </div>
        {settings.timeLimit && <span>Time: {timeLeft}s</span>}
      </div>

      <Card className="p-6 min-h-[200px]">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{questions[currentIndex]?.question}</h3>
          {questions[currentIndex]?.imageRef && (
            <img 
              src={questions[currentIndex].imageRef} 
              alt="Question reference"
              className="max-w-full h-auto rounded-md"
            />
          )}
          <div className="space-y-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Type your answer..."
            />
            <Button 
              onClick={handleAnswer}
              className="w-full"
              disabled={!answer.trim()}
            >
              Submit Answer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};