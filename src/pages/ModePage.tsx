import { useNavigate, useParams } from 'react-router-dom'
import type { Sport, TrainingMode } from '../types'

const modes: { mode: TrainingMode; title: string; description: string; icon: string }[] = [
  {
    mode: 'preparacio',
    title: 'Preparació Física',
    description: "Força, condicionament i exercicis complementaris",
    icon: '⚡',
  },
  {
    mode: 'directe',
    title: "Entrenament Directe",
    description: "Tècnica i pràctica de l'esport",
    icon: '🎯',
  },
]

const sportNames: Record<Sport, string> = {
  halterofilia: 'Halterofília',
  atletisme: 'Atletisme',
  calisthenia: 'Calistènia',
}

export function ModePage() {
  const { sport } = useParams<{ sport: Sport }>()
  const navigate = useNavigate()

  if (!sport) {
    navigate('/')
    return null
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <header className="mb-10">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Enrere
        </button>
        <h1 className="text-2xl font-bold text-white">{sportNames[sport]}</h1>
        <p className="mt-1 text-sm text-slate-500">Trieu el tipus d&apos;entrenament</p>
      </header>
      <nav className="flex flex-col gap-4">
        {modes.map((m) => (
          <button
            key={m.mode}
            onClick={() => navigate(`/${sport}/${m.mode}`)}
            className="group flex w-full items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-200 hover:border-slate-700 hover:scale-[1.02] cursor-pointer"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-3xl">
              {m.icon}
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-white">{m.title}</h2>
              <p className="mt-0.5 text-sm text-slate-400">{m.description}</p>
            </div>
            <span className="ml-auto text-2xl text-slate-600 transition-colors group-hover:text-slate-400">
              &rarr;
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
