import type { ReactNode } from 'react'
import { Chip, IconArrowRight, IconBox } from '../../../shared/ui'
import type { ChainParticipant } from '../model/types'

type ItemRef = ChainParticipant['givesItem']

interface ExchangeSummaryProps {
  give: ItemRef
  receive: ItemRef
  /** Отдаваемая вещь заморожена в цепочке — сигнал «вы её не потеряете». */
  reserved?: boolean
  /** Обмен уже состоялся — подписи в прошедшем времени. */
  past?: boolean
}

/**
 * Эгоцентричная суть обмена: «вы отдаёте X → получаете Y».
 * Первое, что видит человек, — полная цепочка идёт вторым слоем (гипотеза H1).
 */
export function ExchangeSummary({
  give,
  receive,
  reserved = false,
  past = false,
}: ExchangeSummaryProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-card bg-brand-soft p-3.5">
      <Side label={past ? 'Отдали' : 'Отдаёте'} title={give.title}>
        {reserved && (
          <Chip status="frozen" dot>
            В цепочке
          </Chip>
        )}
      </Side>
      {/* отступ сверху выравнивает стрелку по центру миниатюр */}
      <IconArrowRight size={26} className="mt-9 shrink-0 text-brand" />
      <Side label={past ? 'Получили' : 'Получаете'} title={receive.title} />
    </div>
  )
}

function Side({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
      <small className="text-[11px] font-bold tracking-wide text-brand uppercase">{label}</small>
      <span className="grid size-15 place-items-center rounded-xl bg-card text-ink-3">
        <IconBox size={28} />
      </span>
      <b className="text-[13.5px] font-bold">{title}</b>
      {children}
    </div>
  )
}
