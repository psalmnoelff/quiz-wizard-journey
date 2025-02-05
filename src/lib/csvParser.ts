interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  imageRef: string;
  difficulty: number;
}

export const parseCSV = async (file: File): Promise<QuizQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      // Skip header row and parse content
      const questions = lines.slice(1).map((line, index) => {
        const [question, answer, imageRef, difficulty] = line.split(',').map(item => item.trim());
        
        return {
          id: `q${index + 1}`,
          question,
          answer,
          imageRef,
          difficulty: parseInt(difficulty) || 1,
        };
      });
      
      resolve(questions);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};