import { Link } from 'react-router-dom'
import { BrandMark, Button } from '@/shared/ui'

/**
 * Шапка Авито: бренд-лок-ап и поиск. Поиск — декорация, в демо ищет сервис подбора,
 * а не пользователь; поле выключено, чтобы это было видно без пояснений.
 */
export function ShellHeader() {
  return (
    <header className="flex flex-col gap-2.5 border-b border-line-2 px-4 py-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <BrandMark />
        </Link>

        {/* Правый слот шапки: сюда встанет переключатель демо-персон (features/switch-persona),
            он же подставит имя — до него аккаунт безымянный, как участник «Вы» в моках. */}
        <span
          className="ml-auto grid size-8 place-items-center rounded-full bg-brand-soft text-brand"
          title="Личный кабинет"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </span>
      </div>

      <div className="flex gap-2">
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
    </header>
  )
}
