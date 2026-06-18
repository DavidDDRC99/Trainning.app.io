import type { Sport } from '../types'

interface SportCardProps {
  sport: Sport
  name: string
  icon: string
  description: string
  onClick: () => void
}

const sportColors: Record<Sport, { bg: string; border: string; shadow: string }> = {
  halterofilia: { bg: 'bg-amber-900/20', border: 'border-amber-600/40', shadow: 'shadow-amber-900/20' },
  atletisme: { bg: 'bg-emerald-900/20', border: 'border-emerald-600/40', shadow: 'shadow-emerald-900/20' },
  calisthenia: { bg: 'bg-cyan-900/20', border: 'border-cyan-600/40', shadow: 'shadow-cyan-900/20' },
}

export function SportCard({ sport, name, icon, description, onClick }: SportCardProps) {
  const colors = sportColors[sport]

  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-5 rounded-2xl border ${colors.border} ${colors.bg} p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${colors.shadow} cursor-pointer`}
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-3xl">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-white">{name}</h2>
        <p className="mt-0.5 text-sm text-slate-400">{description}</p>
      </div>
      <span className="ml-auto text-2xl text-slate-600 transition-colors group-hover:text-slate-400">
        &rarr;
      </span>
    </button>
  )
}
