import { z } from "zod";

export const questionFormSchema = z.object({
  prompt: z.string().min(1, "Le prompt est requis."),
  choiceA: z.string().min(1, "Le choix A est requis."),
  choiceB: z.string().min(1, "Le choix B est requis."),
  isActive: z.boolean(),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export const defaultQuestionFormValues: QuestionFormValues = {
  prompt: "",
  choiceA: "",
  choiceB: "",
  isActive: true,
};
