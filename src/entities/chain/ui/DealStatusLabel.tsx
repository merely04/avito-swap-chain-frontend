import { Status } from '@/shared/ui'
import { countConfirmed, needsMyAction } from '../lib/participants'
import type { Chain } from '../model/types'

// Оранжевый достаётся только тем состояниям, где цепочка ждёт самого пользователя, —
// так же, как у Авито «Ждёт отправки» в списке заказов. Распад — красный, закрытая
// сделка — серая запись в истории.
const STATUS_VIEW = {
  active: { tone: 'neutral', label: 'Идёт передача' },
  completed: { tone: 'muted', label: 'Обмен завершён' },
  dissolved: { tone: 'stop', label: 'Распалась' },
  // Отмена — не провал: вещь просто ушла в другой обмен, поэтому серый, а не красный.
  cancelled: { tone: 'muted', label: 'Отменилось' },
} as const

/** Статус сделки человеческим языком: домен знает смысл, `shared/ui/Status` — вид. */
export function DealStatusLabel({ chain }: { chain: Chain }) {
  const mine = needsMyAction(chain)

  if (chain.status === 'formed') {
    return (
      <Status tone={mine ? 'attention' : 'neutral'}>
        {countConfirmed(chain)} из {chain.participants.length}
      </Status>
    )
  }

  const view = STATUS_VIEW[chain.status]
  return <Status tone={mine ? 'attention' : view.tone}>{view.label}</Status>
}
