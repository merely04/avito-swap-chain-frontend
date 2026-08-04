import { Chip } from '@/shared/ui'
import type { ItemStatus } from '../model/types'

const STATUS_VIEW: Record<ItemStatus, { status: 'frozen' | 'wait'; label: string } | null> = {
  reserved: { status: 'frozen', label: 'В цепочке' },
  searching: { status: 'wait', label: 'Поиск обмена' },
  idle: null,
}

/** Где вещь в обороте обмена: заморожена в цепочке, ищет её или лежит просто так. */
export function ItemStatusChip({ status }: { status: ItemStatus }) {
  const view = STATUS_VIEW[status]
  if (!view) return null

  return (
    <Chip status={view.status} dot>
      {view.label}
    </Chip>
  )
}
