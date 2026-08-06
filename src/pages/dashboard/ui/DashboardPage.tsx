import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Screen } from '@/shared/ui'
import { cx } from '@/shared/lib'
import { DealsList, PendingDealBanner } from '@/widgets/deals-list'
import { ItemsList } from '@/widgets/items-list'
import { WishesList } from '@/widgets/wishes-list'

type Tab = 'items' | 'wishes' | 'exchanges'

const TABS: { key: Tab; label: string }[] = [
  { key: 'items', label: 'Мои объявления' },
  { key: 'wishes', label: 'Желания' },
  { key: 'exchanges', label: 'Мои обмены' },
]

export function DashboardPage() {
  // Вкладка живёт в адресе: на неё ведёт меню кабинета, и ссылкой можно открыть сразу обмены.
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: Tab = TABS.some((t) => t.key === requested) ? (requested as Tab) : 'items'
  const navigate = useNavigate()

  return (
    <Screen>
      <div className="flex flex-col gap-3.5 p-4">
        <nav aria-label="Разделы кабинета" className="flex gap-6 border-b border-line-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setParams(t.key === 'items' ? {} : { tab: t.key }, { replace: true })}
              aria-pressed={tab === t.key}
              className={cx(
                'relative rounded-sm pb-2.5 text-sm font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand',
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
        {tab === 'wishes' && <WishesList />}
        {tab === 'exchanges' && <DealsList />}
      </div>

      <div className="mt-auto p-4">
        <Button fullWidth onClick={() => navigate('/items/new')}>
          Добавить вещь
        </Button>
      </div>
    </Screen>
  )
}
