import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { runWithBusyState } from "../lib/asyncState";
import { useState } from "react";

type Question = Doc<"questions">;

interface UseQuestionCRUDReturn {
  questions: Array<Question>;
  createQuestion: (data: {
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
    adminToken: string;
  }) => Promise<void>;
  updateQuestion: (data: {
    questionId: Id<"questions">;
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
    adminToken: string;
  }) => Promise<void>;
  deleteQuestion: (data: { questionId: Id<"questions">; adminToken: string }) => Promise<void>;
  isBusy: boolean;
}

export function useQuestionCRUD(): UseQuestionCRUDReturn {
  const questions = useQuery(api.questions.listQuestions);
  const createQuestion = useMutation(api.questions.createQuestion);
  const updateQuestion = useMutation(api.questions.updateQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);

  const [isBusy, setIsBusy] = useState(false);

  const create = async (data: {
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
    adminToken: string;
  }) => {
    await runWithBusyState(setIsBusy, async () => {
      await createQuestion(data);
    });
  };

  const update = async (data: {
    questionId: Id<"questions">;
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
    adminToken: string;
  }) => {
    await runWithBusyState(setIsBusy, async () => {
      await updateQuestion(data);
    });
  };

  const remove = async (data: { questionId: Id<"questions">; adminToken: string }) => {
    await runWithBusyState(setIsBusy, async () => {
      await deleteQuestion(data);
    });
  };

  return {
    questions: questions ?? [],
    createQuestion: create,
    updateQuestion: update,
    deleteQuestion: remove,
    isBusy,
  };
}
