import { Chip } from '@/shared/ui'
import type { ItemStatus } from '../model/types'

// Оба состояния спокойные, поэтому оба — подпись без заливки. Различает их текст,
// а точка добавляет один сигнал: азур = вещь занята в сделке, серый = просто ищем.
const STATUS_VIEW: Record<ItemStatus, { tone: 'accent' | 'neutral'; label: string } | null> = {
  reserved: { tone: 'accent', label: 'В цепочке' },
  searching: { tone: 'neutral', label: 'Поиск обмена' },
  idle: null,
}

/** Где вещь в обороте обмена: заморожена в цепочке, ищет её или лежит просто так. */
export function ItemStatusChip({ status }: { status: ItemStatus }) {
  const view = STATUS_VIEW[status]
  if (!view) return null

  return (
    <Chip tone={view.tone} dot>
      {view.label}
    </Chip>
  )
}
