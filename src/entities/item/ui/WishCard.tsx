import { Card, Chip } from '@/shared/ui'
import type { Item } from '../model/types'
import { ItemStatusChip } from './ItemStatusChip'

/**
 * Желание — это поле вещи, поэтому карточка показывает обе стороны сделки:
 * что пользователь отдаёт и что готов принять взамен. Вариантов может быть несколько —
 * каждый чип это отдельное ребро графа, и подойдёт любой из них.
 */
export function WishCard({ item }: { item: Item }) {
  if (item.wish.length === 0) return null

  return (
    <Card className="flex flex-col gap-2.5 p-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <b className="block truncate text-[14.5px] font-bold">{item.title}</b>
          <span className="block truncate text-[12.5px] text-ink-2">
            {item.category} · отдаю в обмен
          </span>
        </div>

        <ItemStatusChip status={item.status} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[12.5px] text-ink-2">
          {item.wish.length > 1 ? 'Подойдёт любое:' : 'Хочу:'}
        </span>
        {item.wish.map((variant) => (
          <Chip key={variant.description} filled>
            {variant.description}
          </Chip>
        ))}
      </div>
    </Card>
  )
}
