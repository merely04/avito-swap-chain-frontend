import { Chip } from '../../../shared/ui'
import { countConfirmed } from '../lib/participants'
import type { Chain } from '../model/types'

const STATUS_VIEW = {
  active: { status: 'brand', label: 'Идёт передача' },
  completed: { status: 'ok', label: 'Обмен завершён' },
  dissolved: { status: 'stop', label: 'Распалась' },
} as const

/** Статус сделки человеческим языком: домен знает смысл, `shared/ui/Chip` — вид. */
export function DealStatusChip({ chain }: { chain: Chain }) {
  if (chain.status === 'formed') {
    return (
      <Chip status="wait" dot>
        {countConfirmed(chain)} из {chain.participants.length}
      </Chip>
    )
  }

  const view = STATUS_VIEW[chain.status]
  return (
    <Chip status={view.status} dot>
      {view.label}
    </Chip>
  )
}
