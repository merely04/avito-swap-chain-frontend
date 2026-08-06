import { Link } from 'react-router-dom'
import { SwitchPersona } from '@/features/switch-persona'
import { BrandMark, Button } from '@/shared/ui'

/**
 * Шапка Авито: бренд-лок-ап и поиск. Поиск — декорация, в демо ищет сервис подбора,
 * а не пользователь; поле выключено, чтобы это было видно без пояснений.
 *
 * Подложка — во всю ширину окна, содержимое — в том же контейнере, что и страница.
 * Порядок блоков задаётся `order`, а не второй разметкой: на узких окнах бренд и
 * аккаунт в первой строке, поиск переносится во вторую; от `lg` всё встаёт в ряд.
 */
export function ShellHeader() {
  return (
    <header className="border-b border-line-2 bg-card">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-2.5 px-4 py-3 lg:flex-nowrap lg:gap-5 lg:px-6 lg:py-3.5">
        <Link
          to="/"
          className="order-1 rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <BrandMark />
        </Link>

        <div className="order-3 flex w-full gap-2 lg:order-2 lg:w-auto lg:max-w-2xl lg:flex-1">
          <input
            disabled
            aria-label="Поиск по объявлениям"
            placeholder="Поиск по объявлениям"
            className="min-w-0 flex-1 rounded-input border border-line bg-page px-3 py-2 text-[14px] text-ink-3 placeholder:text-ink-3 disabled:cursor-not-allowed"
          />
          <Button variant="dark" disabled className="px-3.5 py-2 text-[14px]">
            Найти
          </Button>
        </div>

        {/* Место аккаунта: в демо здесь переключатель персон — он же показывает, кто вошёл. */}
        <div className="order-2 ml-auto shrink-0 lg:order-3">
          <SwitchPersona />
        </div>
      </div>
    </header>
  )
}
