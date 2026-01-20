import { useAdminAuth } from "../hooks/useAdminAuth";
import { useQuestionForm } from "../hooks/useQuestionForm";
import { useQuestionCRUD } from "../hooks/useQuestionCRUD";
import { NewQuestionForm } from "../components/admin/NewQuestionForm";
import { QuestionList } from "../components/admin/QuestionList";
import { AdminAuth } from "../components/admin/AdminAuth";
import { Button } from "../components/ui/button";

export default function AdminPage() {
  const {
    inputPin,
    setInputPin,
    isAuthenticated,
    adminToken,
    unlock,
    lock,
    errorMessage,
    isAuthenticating,
  } = useAdminAuth();
  const {
    formMethods,
    editingId,
    editingForm,
    handleEditingChange,
    resetForm,
    startEdit,
    cancelEdit,
  } = useQuestionForm();
  const { questions, createQuestion, updateQuestion, deleteQuestion, isBusy } = useQuestionCRUD();

  const handleUnlock = async () => {
    await unlock();
  };

  const handleSubmit = formMethods.handleSubmit(async (values) => {
    if (isBusy) return;
    await createQuestion({ ...values, adminToken });
    resetForm();
  });

  const handleUpdate = async () => {
    if (!editingId || isBusy) return;
    await updateQuestion({ questionId: editingId as any, ...editingForm, adminToken });
    cancelEdit();
  };

  const handleDelete = async (questionId: string) => {
    if (isBusy) return;
    await deleteQuestion({ questionId: questionId as any, adminToken });
  };

  if (!isAuthenticated) {
    return (
      <AdminAuth
        pin={inputPin}
        setPin={setInputPin}
        onUnlock={handleUnlock}
        errorMessage={errorMessage}
        isSubmitting={isAuthenticating}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gestion des questions</h2>
          <p className="text-sm text-muted">
            Crée, modifie et archive les choix en quelques secondes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => void lock()}>
            Quitter
          </Button>
        </div>
      </div>

      <NewQuestionForm onSubmit={handleSubmit} formMethods={formMethods} isSubmitting={isBusy} />

      <QuestionList
        questions={questions}
        editingId={editingId}
        editingForm={editingForm}
        onEdit={(questionId) => {
          const question = questions.find((q) => q._id === questionId);
          if (question) {
            startEdit(questionId, {
              prompt: question.prompt,
              choiceA: question.choiceA,
              choiceB: question.choiceB,
              isActive: question.isActive,
            });
          }
        }}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCancelEdit={cancelEdit}
        onEditChange={handleEditingChange}
        isSubmitting={isBusy}
      />
    </div>
  );
}
