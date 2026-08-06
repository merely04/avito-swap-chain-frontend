import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { chainKeys, getMyChains, needsMyAction } from '@/entities/chain'
import { cx } from '@/shared/lib'
import type { Section } from '../lib/navigation'

/** Разделы кабинета, которых нет в MVP: показываем неактивными — ради правдоподобия контекста. */
const DECOR = ['Сообщения', 'Кошелёк']

const ITEMS_URL = '/'
const EXCHANGE_URL = '/?tab=exchanges'

const itemClass =
  'shrink-0 rounded-chip px-2.5 py-1.5 text-[13px] font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand'

/**
 * Меню личного кабинета. «Обмен» с бейджем — точка входа в сервис: не витрина,
 * а раздел, куда зовут ровно тогда, когда ход за пользователем.
 */
export function CabinetNav({ section }: { section: Section }) {
  const { data } = useQuery({ queryKey: chainKeys.my(), queryFn: getMyChains })
  const waiting = data?.filter(needsMyAction).length ?? 0

  const isExchange = section === 'exchange'

  // Подсветка держится на разделе целиком (желания и новое объявление — часть объявлений),
  // а current достаётся только пункту, который ведёт ровно на открытую страницу.
  const { pathname, search } = useLocation()
  const here = `${pathname}${search}`

  return (
    <nav
      aria-label="Личный кабинет"
      className="flex gap-1 overflow-x-auto border-b border-line-2 px-3 py-2"
    >
      <Link
        to={ITEMS_URL}
        aria-current={here === ITEMS_URL ? 'page' : undefined}
        className={cx(itemClass, isExchange ? 'text-ink-2 hover:bg-line-2' : 'bg-line-2 text-ink')}
      >
        Мои объявления
      </Link>

      <Link
        to={EXCHANGE_URL}
        aria-current={here === EXCHANGE_URL ? 'page' : undefined}
        className={cx(
          itemClass,
          'flex items-center gap-1.5',
          isExchange ? 'bg-line-2 text-ink' : 'text-ink-2 hover:bg-line-2',
        )}
      >
        Обмен
        {waiting > 0 && (
          <span
            title="Ждут вашего действия"
            className="grid min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10.5px] leading-[18px] font-bold text-on-brand"
          >
            {waiting}
          </span>
        )}
      </Link>

      {DECOR.map((label) => (
        <span
          key={label}
          title="В демо раздел не открывается"
          className={cx(itemClass, 'cursor-not-allowed text-ink-3')}
        >
          {label}
        </span>
      ))}
    </nav>
  )
}
