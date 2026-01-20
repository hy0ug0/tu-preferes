import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import type { QuestionFormValues } from "../../lib/questionForm";
import type { BaseSyntheticEvent } from "react";

interface NewQuestionFormProps {
  formMethods: UseFormReturn<QuestionFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

export function NewQuestionForm({ formMethods, onSubmit, isSubmitting }: NewQuestionFormProps) {
  const {
    register,
    formState: { errors, isValid },
  } = formMethods;

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Nouvelle question</CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea placeholder="Prompt" {...register("prompt")} />
            {errors.prompt ? <p className="text-xs text-red-500">{errors.prompt.message}</p> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Input placeholder="Choix A" {...register("choiceA")} />
              {errors.choiceA ? (
                <p className="text-xs text-red-500">{errors.choiceA.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Input placeholder="Choix B" {...register("choiceB")} />
              {errors.choiceB ? (
                <p className="text-xs text-red-500">{errors.choiceB.message}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <input id="active" type="checkbox" {...register("isActive")} />
            <label htmlFor="active">Question active</label>
          </div>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Ajouter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
