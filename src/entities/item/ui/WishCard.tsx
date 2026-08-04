import { Card } from '@/shared/ui'
import type { Item } from '../model/types'
import { ItemStatusChip } from './ItemStatusChip'

/**
 * Желание — это поле вещи, поэтому карточка показывает обе стороны сделки:
 * что пользователь ищет и что готов отдать взамен.
 */
export function WishCard({ item }: { item: Item }) {
  if (!item.wish) return null

  return (
    <Card className="flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <b className="block truncate text-[14.5px] font-bold">
          {item.wish.description || item.wish.category}
        </b>
        <span className="block truncate text-[12.5px] text-ink-2">
          {item.wish.category} · взамен: {item.title}
        </span>
      </div>

      <ItemStatusChip status={item.status} />
    </Card>
  )
}
