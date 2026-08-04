import type { ReactNode } from 'react'
import { cx } from '../lib'

type Status = 'wait' | 'ok' | 'stop' | 'frozen' | 'brand'

const statuses: Record<Status, string> = {
  wait: 'bg-wait-bg text-wait',
  ok: 'bg-ok-bg text-ok',
  stop: 'bg-stop-bg text-stop',
  frozen: 'bg-frozen-bg text-frozen',
  brand: 'bg-brand-soft text-brand',
}

interface ChipProps {
  status?: Status
  dot?: boolean
  children: ReactNode
  className?: string
}

export function Chip({ status = 'brand', dot = false, children, className }: ChipProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-[5px] font-sans font-bold text-[11.5px] px-[9px] py-[5px] rounded-chip whitespace-nowrap',
        statuses[status],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
