import { cx } from '@/shared/lib'
import { Card } from '@/shared/ui'
import { findMe, findNeighbours, needsMyAction } from '../lib/participants'
import type { Chain } from '../model/types'
import { DealStatusChip } from './DealStatusChip'

/** Что происходит с цепочкой — одной строкой, языком пользователя. */
function hintFor(chain: Chain): string {
  switch (chain.status) {
    case 'formed':
      return needsMyAction(chain) ? 'ждём вашего решения' : 'ждём остальных участников'
    case 'active':
      return 'передача вещей'
    case 'completed':
      return 'обмен завершён'
    case 'dissolved':
      return 'цепочка распалась'
  }
}

/** Строка списка «Мои обмены»: что отдаю, что получаю и на каком этапе цепочка. */
export function ChainCard({ chain }: { chain: Chain }) {
  const me = findMe(chain)
  const neighbours = findNeighbours(chain)
  if (!me || !neighbours) return null

  return (
    <Card className="flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <b className="block truncate text-[14.5px] font-bold">
          {me.givesItem.title} → {neighbours.giver.givesItem.title}
        </b>
        <span
          className={cx(
            'text-[12.5px]',
            needsMyAction(chain) ? 'font-semibold text-brand' : 'text-ink-2',
          )}
        >
          Участников: {chain.participants.length} · {hintFor(chain)}
        </span>
      </div>

      <DealStatusChip chain={chain} />
    </Card>
  )
}
