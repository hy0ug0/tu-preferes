import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLocalStorage } from "./useLocalStorage";

const ADMIN_SESSION_STORAGE_KEY = "adminSession";

type AdminSession = {
  token: string;
  expiresAt: number;
};

const isAdminSession = (value: unknown): value is AdminSession => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as AdminSession;
  return typeof candidate.token === "string" && typeof candidate.expiresAt === "number";
};

const isActiveAdminSession = (value: unknown): value is AdminSession => {
  return isAdminSession(value) && value.expiresAt > Date.now();
};

interface UseAdminAuthReturn {
  inputPin: string;
  setInputPin: (pin: string) => void;
  isAuthenticated: boolean;
  adminToken: string;
  unlock: () => Promise<boolean>;
  lock: () => Promise<void>;
  errorMessage: string | null;
  isAuthenticating: boolean;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const loginAdmin = useMutation(api.questions.loginAdmin);
  const logoutAdmin = useMutation(api.questions.logoutAdmin);

  const [inputPin, setInputPin] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storedSession, setStoredSession] = useLocalStorage<AdminSession | null>(
    ADMIN_SESSION_STORAGE_KEY,
    null,
  );

  const activeSession = isActiveAdminSession(storedSession) ? storedSession : null;
  const isAuthenticated = !!activeSession;

  useEffect(() => {
    if (storedSession === null) return;
    if (!isActiveAdminSession(storedSession)) {
      setStoredSession(null);
    }
  }, [storedSession, setStoredSession]);

  const unlock = useCallback(async () => {
    if (!inputPin) return false;
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await loginAdmin({ pin: inputPin });
      const session = { token: result.token, expiresAt: result.expiresAt };
      setStoredSession(session);
      setInputPin("");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "PIN invalide";
      setErrorMessage(message);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [inputPin, loginAdmin, setStoredSession]);

  const lock = useCallback(async () => {
    const token = activeSession?.token;
    setStoredSession(null);
    setInputPin("");
    setErrorMessage(null);
    if (token) {
      try {
        await logoutAdmin({ token });
      } catch {
        // Ignore logout errors; local session is already cleared.
      }
    }
  }, [logoutAdmin, activeSession, setStoredSession]);

  return {
    inputPin,
    setInputPin,
    isAuthenticated,
    adminToken: activeSession?.token ?? "",
    unlock,
    lock,
    errorMessage,
    isAuthenticating,
  };
}
