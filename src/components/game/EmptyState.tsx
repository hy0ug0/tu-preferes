import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { EMPTY_STATE_TYPES, type EmptyStateType } from "../../constants/emptyState";

interface EmptyStateProps {
  type: EmptyStateType;
  onResetHistory?: () => void;
  isResetting?: boolean;
}

export function EmptyState({ type, onResetHistory, isResetting }: EmptyStateProps) {
  if (type === EMPTY_STATE_TYPES.NO_QUESTIONS) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <CardHeader className="text-lg font-medium text-white">Aucune question active</CardHeader>
        <CardContent className="text-sm text-zinc-400">
          Ajoute des questions depuis l&apos;admin pour démarrer.
        </CardContent>
      </Card>
    );
  }

  if (type === EMPTY_STATE_TYPES.ALL_ANSWERED) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <CardHeader className="text-lg font-medium text-white">Vous avez tout vu !</CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-400">
          <p>
            Vous avez répondu à toutes les questions disponibles. De nouvelles questions seront
            ajoutées prochainement.
          </p>
          <Button
            variant="outline"
            onClick={onResetHistory}
            disabled={isResetting}
            className="mt-4"
          >
            Réinitialiser l&apos;historique
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
      <CardHeader className="text-lg font-medium text-white">Chargement...</CardHeader>
      <CardContent className="text-sm text-zinc-400">Préparation des questions...</CardContent>
    </Card>
  );
}
