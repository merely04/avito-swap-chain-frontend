import type { ReactNode } from 'react'
import { IconChevronLeft } from './icons'

/**
 * Каркас экрана: узкая колонка по центру, как в мобильном вебе Avito.
 * Высоту задаёт оболочка (`widgets/avito-shell`), экран растягивается в остаток —
 * иначе шапка Авито и экран сложились бы в два экрана высоты.
 */
export function Screen({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-md flex-1 flex-col bg-card">{children}</div>
}

interface ScreenHeaderProps {
  title: ReactNode
  /** Если передан — слева появляется кнопка «Назад». */
  onBack?: () => void
  /** Правый слот шапки: статус-чип, аватар и подобное. */
  children?: ReactNode
}

export function ScreenHeader({ title, onBack, children }: ScreenHeaderProps) {
  return (
    <header className="flex items-center gap-2.5 border-b border-line-2 px-4 py-3.5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="cursor-pointer rounded-sm text-ink-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <IconChevronLeft size={19} />
        </button>
      )}
      <h1 className="flex-1 text-[16px] font-bold">{title}</h1>
      {children}
    </header>
  )
}
