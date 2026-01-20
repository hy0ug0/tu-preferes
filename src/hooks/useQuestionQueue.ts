import { useState } from "react";
import { shuffleQuestions } from "../lib/questionQueue";
import type { Doc } from "../../convex/_generated/dataModel";

type Question = Doc<"questions">;

interface UseQuestionQueueReturn {
  queue: Array<Question>;
  currentIndex: number;
  currentQuestion: Question | undefined;
  setQuestions: (questions: Array<Question>) => void;
}

export function useQuestionQueue(): UseQuestionQueueReturn {
  const [queue, setQueue] = useState<Array<Question>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = queue[currentIndex];

  const setQuestions = (questions: Array<Question>) => {
    const shuffled = shuffleQuestions(questions);
    setQueue(shuffled);
    setCurrentIndex(0);
  };

  return { queue, currentIndex, currentQuestion, setQuestions };
}
