import { Chip } from '@/shared/ui'
import { countConfirmed } from '../lib/participants'
import type { Chain } from '../model/types'

// Заливка только у распада: это единственный статус, мимо которого нельзя пройти.
// Живая передача помечена азурной точкой, завершённый обмен — нейтральная запись в истории.
const STATUS_VIEW = {
  active: { tone: 'accent', label: 'Идёт передача' },
  completed: { tone: 'neutral', label: 'Обмен завершён' },
  dissolved: { tone: 'stop', label: 'Распалась' },
} as const

/** Статус сделки человеческим языком: домен знает смысл, `shared/ui/Chip` — вид. */
export function DealStatusChip({ chain }: { chain: Chain }) {
  if (chain.status === 'formed') {
    return (
      <Chip dot>
        {countConfirmed(chain)} из {chain.participants.length}
      </Chip>
    )
  }

  const view = STATUS_VIEW[chain.status]
  return (
    <Chip tone={view.tone} dot={chain.status !== 'dissolved'} filled={chain.status === 'dissolved'}>
      {view.label}
    </Chip>
  )
}
