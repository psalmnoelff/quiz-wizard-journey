import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "@/components/Settings";
import { Quiz } from "@/components/Quiz";
import { Results } from "@/components/Results";

const Index = () => {
  const [gameState, setGameState] = useState<"start" | "settings" | "quiz" | "results">("start");
  const [settings, setSettings] = useState({
    questionCount: 10,
    difficulty: 1,
    timeLimit: false,
    timeLimitSeconds: 30,
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {gameState === "start" && (
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold text-primary">Quiz Bee Trainer</h1>
            <p className="text-lg text-muted-foreground">Test your knowledge and track your progress!</p>
            <Button 
              size="lg"
              onClick={() => setGameState("settings")}
              className="animate-bounce"
            >
              Start Quiz
            </Button>
          </div>
        )}

        {gameState === "settings" && (
          <Settings
            settings={settings}
            setSettings={setSettings}
            onStart={() => setGameState("quiz")}
          />
        )}

        {gameState === "quiz" && (
          <Quiz
            settings={settings}
            onComplete={() => setGameState("results")}
            onBack={() => setGameState("settings")}
          />
        )}

        {gameState === "results" && (
          <Results
            onRestart={() => setGameState("start")}
          />
        )}
      </div>
    </div>
  );
};

export default Index;