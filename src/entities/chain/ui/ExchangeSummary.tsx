import { cx } from '@/shared/lib'
import { Chip, IconArrowRight, IconBox } from '@/shared/ui'
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

const label = 'row-start-1 text-[11px] font-bold tracking-wide text-brand uppercase'
const title = 'row-start-3 text-center text-[13.5px] font-bold'

/**
 * Эгоцентричная суть обмена: «вы отдаёте X → получаете Y».
 * Первое, что видит человек, — полная цепочка идёт вторым слоем (гипотеза H1).
 *
 * Ряды сетки держат подписи, миниатюры и названия сторон на одной линии,
 * а стрелку — ровно по центру ряда миниатюр.
 */
export function ExchangeSummary({
  give,
  receive,
  reserved = false,
  past = false,
}: ExchangeSummaryProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] justify-items-center gap-x-2.5 gap-y-1 rounded-card bg-brand-soft p-3 sm:gap-y-1.5 sm:p-3.5">
      <small className={cx(label, 'col-start-1')}>{past ? 'Отдали' : 'Отдаёте'}</small>
      <small className={cx(label, 'col-start-3')}>{past ? 'Получили' : 'Получаете'}</small>

      <Thumb item={give} className="col-start-1" />
      <IconArrowRight size={26} className="col-start-2 row-start-2 self-center text-brand" />
      <Thumb item={receive} className="col-start-3" />

      <b className={cx(title, 'col-start-1')}>{give.title}</b>
      <b className={cx(title, 'col-start-3')}>{receive.title}</b>

      {reserved && (
        <Chip tone="accent" dot className="col-start-1 row-start-4">
          В цепочке
        </Chip>
      )}
    </div>
  )
}

/** Миниатюра вещи; без фото — коробка-плейсхолдер, как в объявлении без снимка. */
function Thumb({ item, className }: { item: ItemRef; className: string }) {
  const box = cx('row-start-2 size-15 rounded-xl bg-card', className)

  if (!item.photoUrl) {
    return (
      <span className={cx('grid place-items-center text-ink-3', box)}>
        <IconBox size={28} />
      </span>
    )
  }

  return <img src={item.photoUrl} alt="" loading="lazy" className={cx('object-cover', box)} />
}
