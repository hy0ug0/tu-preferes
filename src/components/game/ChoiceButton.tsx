import { Button } from "../../components/ui/button";

interface ChoiceButtonProps {
  choice: string;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
  arrowDirection: "left" | "right";
}

export function ChoiceButton({
  choice,
  isSelected,
  disabled,
  onSelect,
  arrowDirection,
}: ChoiceButtonProps) {
  return (
    <Button
      size="lg"
      variant={isSelected ? "outline" : "default"}
      disabled={disabled}
      className={`h-auto whitespace-normal py-5 px-5 sm:py-6 sm:px-6 text-left text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${
        isSelected
          ? "bg-blue-500/20 border-blue-500/50 text-blue-200 ring-2 ring-blue-500/20"
          : "bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700/50 text-zinc-100"
      }`}
      onClick={onSelect}
    >
      {arrowDirection === "left" ? (
        <>
          <span className="mr-4 hidden h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm font-medium text-zinc-400 md:inline-flex">
            ←
          </span>
          <span className="flex-1">{choice}</span>
        </>
      ) : (
        <>
          <span className="flex-1">{choice}</span>
          <span className="mr-4 hidden h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm font-medium text-zinc-400 md:inline-flex">
            →
          </span>
        </>
      )}
    </Button>
  );
}
