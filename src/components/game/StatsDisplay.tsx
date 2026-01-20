export function StatsDisplay({
  percentA,
  percentB,
  total,
}: {
  percentA: number;
  percentB: number;
  total: number;
}) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400">
        <span className="text-zinc-500">Total</span>
        <span className="text-white">{total}</span>
      </div>
      <div className="h-4 w-px bg-white/10" />
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <div className="flex items-center gap-1.5">
          ← <span className="text-zinc-200">{percentA}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-200">{percentB}%</span> →
        </div>
      </div>
    </div>
  );
}
