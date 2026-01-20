import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  onLeftArrow?: () => void;
  onRightArrow?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onLeftArrow,
  onRightArrow,
  enabled = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key === "ArrowLeft" && onLeftArrow) {
        e.preventDefault();
        onLeftArrow();
      } else if (e.key === "ArrowRight" && onRightArrow) {
        e.preventDefault();
        onRightArrow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onLeftArrow, onRightArrow, enabled]);
}
