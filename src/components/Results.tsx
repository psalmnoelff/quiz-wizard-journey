import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ResultsProps {
  onRestart: () => void;
}

export const Results = ({ onRestart }: ResultsProps) => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
    setResults(storedResults);
  }, []);

  const correctCount = results.filter(r => r.correct).length;
  const percentage = (correctCount / results.length) * 100;

  const downloadWorksheet = () => {
    const content = `
      <html>
        <head>
          <title>Quiz Worksheet</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .question { margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #eee; }
            .correct { color: green; }
            .incorrect { color: red; }
          </style>
        </head>
        <body>
          <h1>Quiz Results - ${percentage.toFixed(1)}%</h1>
          <p>Score: ${correctCount} out of ${results.length}</p>
          ${results.map((r, i) => `
            <div class="question">
              <h3>Question ${i + 1}: ${r.question}</h3>
              <p>Your Answer: ${r.userAnswer}</p>
              <p class="${r.correct ? 'correct' : 'incorrect'}">
                ${r.correct ? '✓ Correct' : `✗ Incorrect - Correct answer: ${r.actualAnswer}`}
              </p>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 500);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center">Quiz Results</h2>
      
      <div className="text-center space-y-2">
        <p className="text-4xl font-bold text-primary">{percentage.toFixed(1)}%</p>
        <p className="text-muted-foreground">
          {correctCount} correct out of {results.length} questions
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.correct ? "bg-success/10" : "bg-destructive/10"
            }`}
          >
            <p className="font-medium">Question {index + 1}</p>
            <p className="text-muted-foreground">{result.question}</p>
            <p className="mt-2">
              Your answer: <span className="font-medium">{result.userAnswer}</span>
            </p>
            {!result.correct && (
              <p className="text-success mt-1">
                Correct answer: <span className="font-medium">{result.actualAnswer}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <Button onClick={onRestart}>Try Again</Button>
        <Button variant="outline" onClick={downloadWorksheet}>
          Print Worksheet
        </Button>
      </div>
    </div>
  );
};