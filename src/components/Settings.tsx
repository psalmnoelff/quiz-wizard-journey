import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseCSV } from "@/lib/csvParser";

interface SettingsProps {
  settings: {
    questionCount: number;
    difficulty: number;
    timeLimit: boolean;
    timeLimitSeconds: number;
  };
  setSettings: (settings: any) => void;
  onStart: () => void;
}

export const Settings = ({ settings, setSettings, onStart }: SettingsProps) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFile(file);
    const questions = await parseCSV(file);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    onStart();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Quiz Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                value={settings.questionCount}
                onChange={(e) =>
                  setSettings({ ...settings, questionCount: parseInt(e.target.value) })
                }
                min={1}
                max={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={settings.difficulty.toString()}
                onValueChange={(value) =>
                  setSettings({ ...settings, difficulty: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Easy</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="timeLimit">Enable Time Limit</Label>
              <Switch
                id="timeLimit"
                checked={settings.timeLimit}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, timeLimit: checked })
                }
              />
            </div>

            {settings.timeLimit && (
              <div className="space-y-2">
                <Label htmlFor="timeLimitSeconds">Time Limit (seconds)</Label>
                <Input
                  id="timeLimitSeconds"
                  type="number"
                  value={settings.timeLimitSeconds}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeLimitSeconds: parseInt(e.target.value),
                    })
                  }
                  min={5}
                  max={300}
                />
              </div>
            )}

            <Button
              className="w-full mt-6"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Upload Questions</h2>
          <p className="text-muted-foreground">
            Upload a CSV file with your questions. Format: Question, Answer, Image Reference, Difficulty
          </p>
          <div className="flex flex-col items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-xs"
            />
            <Button
              variant="outline"
              onClick={() => setStep(1)}
            >
              Back to Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};