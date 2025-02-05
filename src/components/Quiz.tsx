import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import confetti from "canvas-confetti";

interface QuizProps {
  settings: {
    questionCount: number;
    difficulty: number;
    timeLimit: boolean;
    timeLimitSeconds: number;
  };
  onComplete: () => void;
}

export const Quiz = ({ settings, onComplete }: QuizProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimitSeconds);
  const [results, setResults] = useState<{ question: string; correct: boolean; userAnswer: string; actualAnswer: string }[]>([]);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");
    const filteredQuestions = storedQuestions.filter((q: any) => q.difficulty === settings.difficulty);
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, settings.questionCount));
  }, []);

  useEffect(() => {
    if (settings.timeLimit && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, settings.timeLimit]);

  const handleAnswer = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      document.body.classList.add("shake");
      document.body.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
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
      setIsFlipped(true);
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setAnswer("");
        setIsFlipped(false);
        setTimeLeft(settings.timeLimitSeconds);
      }, 1000);
    } else {
      localStorage.setItem("quizResults", JSON.stringify(results));
      onComplete();
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <span>Question {currentIndex + 1}/{questions.length}</span>
        {settings.timeLimit && <span>Time: {timeLeft}s</span>}
      </div>

      <Card className={`p-6 min-h-[200px] card-flip ${isFlipped ? "flipped" : ""}`}>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
          {currentQuestion.imageRef && (
            <img 
              src={currentQuestion.imageRef} 
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