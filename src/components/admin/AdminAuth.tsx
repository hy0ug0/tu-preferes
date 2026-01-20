import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface AdminAuthProps {
  pin: string;
  setPin: (pin: string) => void;
  onUnlock: () => void | Promise<void>;
  errorMessage?: string | null;
  isSubmitting?: boolean;
}

export function AdminAuth({ pin, setPin, onUnlock, errorMessage, isSubmitting }: AdminAuthProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center">
      <Card className="w-full">
        <CardHeader className="text-lg font-semibold">Accès admin</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">Entre le PIN pour gérer les questions.</p>
          <Input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
          <Button
            className="w-full"
            onClick={() => void onUnlock()}
            disabled={isSubmitting || pin.length === 0}
          >
            Déverrouiller
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
