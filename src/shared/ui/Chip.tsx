import type { ReactNode } from 'react'
import { cx } from '../lib'

/**
 * Смысловой минимум вместо радуги: нейтральный — спокойное состояние,
 * акцентный — то, что двигается прямо сейчас, стоп — распад или ошибка.
 */
type Tone = 'neutral' | 'accent' | 'stop'

/** Без заливки статус читается как подпись, а не как украшение: цвет несёт только точка. */
const text: Record<Tone, string> = {
  neutral: 'text-ink-2',
  accent: 'text-ink',
  stop: 'text-stop',
}

/** Заливка — только там, где статус требует внимания. */
const solid: Record<Tone, string> = {
  neutral: 'bg-line-2 text-ink',
  accent: 'bg-brand-soft text-brand',
  stop: 'bg-stop-bg text-stop',
}

const dots: Record<Tone, string> = {
  neutral: 'bg-ink-3',
  accent: 'bg-brand',
  stop: 'bg-stop',
}

interface ChipProps {
  tone?: Tone
  /** Плашка с заливкой — для тегов и статусов, которые нельзя пропустить. */
  filled?: boolean
  dot?: boolean
  children: ReactNode
  className?: string
}

export function Chip({
  tone = 'neutral',
  filled = false,
  dot = false,
  children,
  className,
}: ChipProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 font-sans text-[11.5px] leading-4 font-semibold whitespace-nowrap',
        filled ? cx('rounded-chip px-2 py-[3px]', solid[tone]) : text[tone],
        className,
      )}
    >
      {dot && <span className={cx('size-1.5 shrink-0 rounded-full', dots[tone])} />}
      {children}
    </span>
  )
}
