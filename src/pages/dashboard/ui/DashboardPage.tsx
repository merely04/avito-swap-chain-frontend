import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandMark, Button } from '@/shared/ui'
import { cx } from '@/shared/lib'
import { DealsList, PendingDealBanner } from '@/widgets/deals-list'
import { ItemsList } from '@/widgets/items-list'

type Tab = 'items' | 'wishes' | 'exchanges'

const TABS: { key: Tab; label: string }[] = [
  { key: 'items', label: 'Мои вещи' },
  { key: 'wishes', label: 'Желания' },
  { key: 'exchanges', label: 'Обмены' },
]

export function DashboardPage() {
  const [tab, setTab] = useState<Tab>('items')
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-card">
      <header className="flex items-center justify-between border-b border-line-2 px-4 py-3.5">
        <BrandMark />
        <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </span>
      </header>

      <div className="flex flex-col gap-3.5 p-4">
        <nav className="flex gap-6 border-b border-line-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cx(
                'relative pb-2.5 text-sm font-semibold rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand',
                tab === t.key ? 'text-ink' : 'text-ink-2',
              )}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-0 -bottom-px h-[2.5px] rounded bg-brand" />
              )}
            </button>
          ))}
        </nav>

        {tab === 'items' && (
          <>
            <PendingDealBanner />
            <ItemsList />
          </>
        )}
        {tab === 'exchanges' && <DealsList />}
        {tab === 'wishes' && <p className="py-10 text-center text-sm text-ink-3">Скоро</p>}
      </div>

      <div className="mt-auto p-4">
        <Button fullWidth onClick={() => navigate('/items/new')}>
          Добавить вещь
        </Button>
      </div>
    </div>
  )
}
