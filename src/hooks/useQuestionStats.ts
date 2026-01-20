import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { getChoicePercentages } from "../lib/stats";

interface UseQuestionStatsProps {
  questionId: Id<"questions"> | null | undefined;
}

interface UseQuestionStatsReturn {
  percentA: number;
  percentB: number;
  total: number;
  isLoading: boolean;
}

export function useQuestionStats({ questionId }: UseQuestionStatsProps): UseQuestionStatsReturn {
  const stats = useQuery(api.questions.getQuestionStats, questionId ? { questionId } : "skip");

  const { percentA, percentB, total } = useMemo(() => {
    if (!stats) {
      return { percentA: 0, percentB: 0, total: 0 };
    }
    return getChoicePercentages(stats.countA, stats.countB);
  }, [stats]);

  return { percentA, percentB, total, isLoading: !stats };
}
