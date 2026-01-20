import type { Doc } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

type Question = Doc<"questions">;

interface QuestionListProps {
  questions: Array<Question>;
  editingId: string | null;
  editingForm: {
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
  };
  onEdit: (questionId: string) => void;
  onUpdate: () => void;
  onDelete: (questionId: string) => void;
  onCancelEdit: () => void;
  onEditChange: (
    field: "prompt" | "choiceA" | "choiceB" | "isActive",
  ) => (value: string | boolean) => void;
  isSubmitting: boolean;
}

export function QuestionList({
  questions,
  editingId,
  editingForm,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  onEditChange,
  isSubmitting,
}: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionItem
          key={question._id}
          question={question}
          isEditing={editingId === question._id}
          editingForm={editingForm}
          onEdit={() => onEdit(question._id)}
          onUpdate={onUpdate}
          onDelete={() => onDelete(question._id)}
          onCancelEdit={onCancelEdit}
          onEditChange={onEditChange}
          isSubmitting={isSubmitting}
        />
      ))}
    </div>
  );
}

function QuestionItem({
  question,
  isEditing,
  editingForm,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  onEditChange,
  isSubmitting,
}: {
  question: Question;
  isEditing: boolean;
  editingForm: {
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
  };
  onEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  onEditChange: (
    field: "prompt" | "choiceA" | "choiceB" | "isActive",
  ) => (value: string | boolean) => void;
  isSubmitting: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-muted">
          {question.isActive ? "Active" : "Inactive"} • {question.countA + question.countB} réponses
        </div>
        {isEditing ? (
          <Textarea
            value={editingForm.prompt}
            onChange={(event) => onEditChange("prompt")(event.target.value)}
          />
        ) : (
          <p className="text-base font-medium">{question.prompt}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={editingForm.choiceA}
              onChange={(event) => onEditChange("choiceA")(event.target.value)}
            />
            <Input
              value={editingForm.choiceB}
              onChange={(event) => onEditChange("choiceB")(event.target.value)}
            />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border p-3 text-sm">{question.choiceA}</div>
            <div className="rounded-md border border-border p-3 text-sm">{question.choiceB}</div>
          </div>
        )}
        <QuestionActions
          isEditing={isEditing}
          editingForm={editingForm}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
          onEditChange={onEditChange}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

function QuestionActions({
  isEditing,
  editingForm,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  onEditChange,
  isSubmitting,
}: {
  isEditing: boolean;
  editingForm: {
    prompt: string;
    choiceA: string;
    choiceB: string;
    isActive: boolean;
  };
  onEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  onEditChange: (
    field: "prompt" | "choiceA" | "choiceB" | "isActive",
  ) => (value: string | boolean) => void;
  isSubmitting: boolean;
}) {
  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={editingForm.isActive}
            onChange={(event) => onEditChange("isActive")(event.target.checked)}
          />
          Active
        </label>
        <Button onClick={onUpdate} disabled={isSubmitting}>
          Enregistrer
        </Button>
        <Button variant="ghost" onClick={onCancelEdit}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={onEdit}>
        Modifier
      </Button>
      <Button variant="ghost" onClick={onDelete} disabled={isSubmitting}>
        Supprimer
      </Button>
    </div>
  );
}
