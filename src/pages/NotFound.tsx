import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground font-sans px-4 py-12">
      <div className="text-center space-y-2">
        <p className="text-5xl font-light text-white">404</p>
        <p className="text-sm text-zinc-400">La page demandée est introuvable.</p>
      </div>
      <Link to="/" className="text-sm text-zinc-300 hover:text-white">
        Retour au jeu
      </Link>
    </div>
  );
}
