import type { ReactNode } from 'react'
import { Card, IconImage } from '@/shared/ui'
import { CONDITION_LABEL } from '../model/dictionaries'
import type { Item } from '../model/types'
import { ItemStatusChip } from './ItemStatusChip'

interface ItemCardProps {
  item: Item
  /** Слот действия: сущность не знает про фичи, поэтому кнопку передаёт виджет. */
  action?: ReactNode
}

export function ItemCard({ item, action }: ItemCardProps) {
  return (
    <Card className="flex items-center gap-3 p-3">
      {item.photoUrl ? (
        <img
          src={item.photoUrl}
          alt=""
          className="size-13 shrink-0 rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <div className="grid size-13 shrink-0 place-items-center rounded-xl bg-line-2 text-ink-3">
          <IconImage size={24} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <b className="block truncate text-[14.5px] font-bold">{item.title}</b>
        <span className="text-[12.5px] text-ink-2">
          {item.category} · {CONDITION_LABEL[item.condition]}
        </span>
      </div>

      {action ?? <ItemStatusChip status={item.status} />}
    </Card>
  )
}
