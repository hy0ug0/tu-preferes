import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  defaultQuestionFormValues,
  questionFormSchema,
  type QuestionFormValues,
} from "../lib/questionForm";

interface UseQuestionFormReturn {
  formMethods: UseFormReturn<QuestionFormValues>;
  editingId: string | null;
  editingForm: QuestionFormValues;
  handleEditingChange: (field: keyof QuestionFormValues) => (value: string | boolean) => void;
  resetForm: () => void;
  startEdit: (questionId: string, values: QuestionFormValues) => void;
  cancelEdit: () => void;
}

export function useQuestionForm(): UseQuestionFormReturn {
  const formMethods = useForm<QuestionFormValues>({
    defaultValues: defaultQuestionFormValues,
    resolver: zodResolver(questionFormSchema),
    mode: "onChange",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<QuestionFormValues>(defaultQuestionFormValues);

  const handleEditingChange = (field: keyof QuestionFormValues) => (value: string | boolean) => {
    setEditingForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    formMethods.reset(defaultQuestionFormValues);
  };

  const startEdit = (questionId: string, values: QuestionFormValues) => {
    setEditingId(questionId);
    setEditingForm(values);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingForm(defaultQuestionFormValues);
  };

  return {
    formMethods,
    editingId,
    editingForm,
    handleEditingChange,
    resetForm,
    startEdit,
    cancelEdit,
  };
}
