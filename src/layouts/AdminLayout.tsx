import { Link } from "react-router-dom";
import AdminPage from "../pages/Admin";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
      <div className="mx-auto w-full max-w-5xl p-6 md:p-12 space-y-12">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <h1 className="text-3xl font-light tracking-tight text-white">Tu préfères ?</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-zinc-400 hover:text-white">
              Retour au jeu
            </Link>
          </div>
        </header>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10 rounded-[3rem]" />
          <AdminPage />
        </div>
      </div>
    </div>
  );
}
