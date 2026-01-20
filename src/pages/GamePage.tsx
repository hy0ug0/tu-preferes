import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { GameHeader } from "../components/game/GameHeader";
import { EmptyState } from "../components/game/EmptyState";
import { QuestionCard } from "../components/game/QuestionCard";
import { EMPTY_STATE_TYPES } from "../constants/emptyState";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useQuestionStats } from "../hooks/useQuestionStats";
import { nextIndex, shuffleQuestions } from "../lib/questionQueue";

type Question = Doc<"questions">;

export default function GamePage() {
  const [queue, setQueue] = useState<Array<Question>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [defaultDeviceId] = useState(() => crypto.randomUUID());
  const lastQuestionsKeyRef = useRef("");

  const [deviceId] = useLocalStorage("tu-preferes-device-id", defaultDeviceId);
  const availableQuestionsData = useQuery(api.questions.listAvailableQuestions, {
    deviceId,
  });
  const submitResponse = useMutation(api.questions.submitResponse);
  const resetHistory = useMutation(api.questions.resetHistory);

  const [lastChoice, setLastChoice] = useState<"A" | "B" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const currentQuestion = queue[currentIndex];
  const { percentA, percentB, total } = useQuestionStats({ questionId: currentQuestion?._id });

  useKeyboardNavigation({
    onLeftArrow: () => {
      if (currentQuestion) {
        handleAnswer("A");
      }
    },
    onRightArrow: () => {
      if (currentQuestion) {
        handleAnswer("B");
      }
    },
    enabled: !!currentQuestion,
  });

  useEffect(() => {
    if (!availableQuestionsData?.questions) {
      return;
    }

    const questionsKey = availableQuestionsData.questions.map((question) => question._id).join("|");
    if (questionsKey === lastQuestionsKeyRef.current) {
      return;
    }

    lastQuestionsKeyRef.current = questionsKey;
    setQueue(shuffleQuestions(availableQuestionsData.questions));
    setCurrentIndex(0);
  }, [availableQuestionsData?.questions]);

  useEffect(() => {
    setLastChoice(null);
  }, [currentQuestion?._id]);

  const handleAnswer = useCallback(
    async (choice: "A" | "B") => {
      if (!currentQuestion || isSubmitting) return;

      setIsSubmitting(true);
      await submitResponse({ questionId: currentQuestion._id, choice, deviceId });
      setLastChoice(choice);
      setCurrentIndex((index) => nextIndex(index, queue.length));
      setIsSubmitting(false);
    },
    [
      currentQuestion,
      isSubmitting,
      submitResponse,
      deviceId,
      queue.length,
      setLastChoice,
      setIsSubmitting,
    ],
  );

  const handleResetHistory = useCallback(async () => {
    if (isResetting) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir réinitialiser votre historique ? Cette action supprimera toutes vos données d'historique et vous permettra de revoir toutes les questions.",
    );
    if (!confirmed) return;

    setIsResetting(true);
    await resetHistory({ deviceId });
    setIsResetting(false);
  }, [isResetting, resetHistory, deviceId, setIsResetting]);

  const activeCount = availableQuestionsData?.activeCount ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center bg-background text-foreground font-sans selection:bg-blue-500/30 px-4 py-8 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6 sm:space-y-8">
        <GameHeader />

        {activeCount === 0 ? (
          <EmptyState type={EMPTY_STATE_TYPES.NO_QUESTIONS} />
        ) : availableQuestionsData &&
          activeCount > 0 &&
          availableQuestionsData.questions.length === 0 ? (
          <EmptyState
            type={EMPTY_STATE_TYPES.ALL_ANSWERED}
            onResetHistory={handleResetHistory}
            isResetting={isResetting}
          />
        ) : !currentQuestion ? (
          <EmptyState type={EMPTY_STATE_TYPES.LOADING} />
        ) : (
          <QuestionCard
            question={currentQuestion}
            lastChoice={lastChoice}
            isSubmitting={isSubmitting}
            percentA={percentA}
            percentB={percentB}
            total={total}
            onSelect={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}
