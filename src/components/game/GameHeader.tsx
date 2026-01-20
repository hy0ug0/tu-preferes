import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface GameHeaderProps {
  showAdmin?: boolean;
}

export function GameHeader({ showAdmin = true }: GameHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white">
        Tu préfères ?
      </h1>
      {showAdmin && (
        <Button
          variant="ghost"
          asChild
          className="rounded-full hover:bg-white/5 text-zinc-400 hover:text-white"
        >
          <Link to="/admin">Admin</Link>
        </Button>
      )}
    </header>
  );
}
