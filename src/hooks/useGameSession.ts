import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface UseGameSessionProps {
  queueLength: number;
}

interface UseGameSessionReturn {
  deviceId: string;
  lastChoice: "A" | "B" | null;
  isSubmitting: boolean;
  isResetting: boolean;
  setLastChoice: (choice: "A" | "B" | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsResetting: (isResetting: boolean) => void;
}

export function useGameSession({ queueLength }: UseGameSessionProps): UseGameSessionReturn {
  const [deviceIdSeed] = useState(() => crypto.randomUUID());
  const [deviceId] = useLocalStorage("tu-preferes-device-id", deviceIdSeed);
  const [lastChoice, setLastChoice] = useState<"A" | "B" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setLastChoice(null);
  }, [queueLength]);

  return {
    deviceId,
    lastChoice,
    isSubmitting,
    isResetting,
    setLastChoice,
    setIsSubmitting,
    setIsResetting,
  };
}
