import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { ChoiceButton } from "./ChoiceButton";
import { StatsDisplay } from "./StatsDisplay";
import type { Doc } from "../../../convex/_generated/dataModel";

type Question = Doc<"questions">;

interface QuestionCardProps {
  question: Question;
  lastChoice: "A" | "B" | null;
  isSubmitting: boolean;
  percentA: number;
  percentB: number;
  total: number;
  onSelect: (choice: "A" | "B") => void;
}

export function QuestionCard({
  question,
  lastChoice,
  isSubmitting,
  percentA,
  percentB,
  total,
  onSelect,
}: QuestionCardProps) {
  return (
    <Card className="min-h-[26rem] sm:min-h-[28rem] lg:min-h-[30rem] flex flex-col overflow-hidden border-zinc-800/50 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10">
      <CardHeader className="space-y-4 pb-6 sm:pb-8 px-5 sm:px-6">
        <h2 className="min-h-[4.5rem] sm:min-h-[5rem] text-2xl sm:text-3xl md:text-4xl font-medium leading-tight text-white">
          {question.prompt}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-8 px-5 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ChoiceButton
            choice={question.choiceA}
            isSelected={lastChoice === "A"}
            disabled={isSubmitting}
            onSelect={() => onSelect("A")}
            arrowDirection="left"
          />
          <ChoiceButton
            choice={question.choiceB}
            isSelected={lastChoice === "B"}
            disabled={isSubmitting}
            onSelect={() => onSelect("B")}
            arrowDirection="right"
          />
        </div>

        <StatsDisplay percentA={percentA} percentB={percentB} total={total} />
      </CardContent>
    </Card>
  );
}
