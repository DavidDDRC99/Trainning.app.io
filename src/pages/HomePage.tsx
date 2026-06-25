import { useNavigate } from 'react-router-dom'
import { SportCard } from '../components/SportCard'
import type { Sport } from '../types'

const sports: { sport: Sport; name: string; icon: string; description: string; onlyDirecte?: boolean }[] = [
  {
    sport: 'halterofilia',
    name: 'Halterofília',
    icon: '🏋️',
    description: 'Arrancada, clean & jerk, i preparació física',
  },
  {
    sport: 'atletisme',
    name: 'Atletisme',
    icon: '🏃',
    description: 'Velocitat, salts, llançaments, i preparació física',
  },
  {
    sport: 'calisthenia',
    name: 'Calistènia',
    icon: '💪',
    description: "Exercicis amb el pes corporal",
    onlyDirecte: true,
  },
]

export function HomePage() {
  const navigate = useNavigate()

  const handleClick = (sport: Sport) => {
    navigate(`/${sport}`)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Entrenament</h1>
            <p className="mt-1 text-sm text-slate-500">Escull un esport per comen&ccedil;ar</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Configuració"
          >
            &#9881;
          </button>
        </div>
      </header>
      <nav className="flex flex-col gap-4">
        {sports.map((s) => (
          <SportCard
            key={s.sport}
            sport={s.sport}
            name={s.name}
            icon={s.icon}
            description={s.description}
            onClick={() => handleClick(s.sport)}
          />
        ))}
      </nav>
    </div>
  )
}
