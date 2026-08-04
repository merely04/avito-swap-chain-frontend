import { Card, Chip } from '../../../shared/ui'
import type { Item, ItemStatus } from '../model/types'

const CONDITION_LABEL: Record<Item['condition'], string> = {
  new: 'новое',
  good: 'хорошее',
  used: 'б/у',
}

const STATUS_CHIP: Record<ItemStatus, { status: 'frozen' | 'wait'; label: string } | null> = {
  reserved: { status: 'frozen', label: 'В цепочке' },
  searching: { status: 'wait', label: 'Поиск обмена' },
  idle: null,
}

export function ItemCard({ item }: { item: Item }) {
  const chip = STATUS_CHIP[item.status]

  return (
    <Card className="flex items-center gap-3 p-3">
      <div className="grid size-13 shrink-0 place-items-center rounded-xl bg-line-2 text-ink-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M3 16l5-4 4 3 3-2 6 5" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <b className="block truncate text-[14.5px] font-bold">{item.title}</b>
        <span className="text-[12.5px] text-ink-2">
          {item.category} · {CONDITION_LABEL[item.condition]}
        </span>
      </div>

      {chip && (
        <Chip status={chip.status} dot>
          {chip.label}
        </Chip>
      )}
    </Card>
  )
}
