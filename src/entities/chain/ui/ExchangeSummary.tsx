import { cx, dative, genitive } from '@/shared/lib'
import { IconArrowRight, IconBox } from '@/shared/ui'
import type { Neighbours } from '../lib/participants'
import type { ChainParticipant } from '../model/types'
import { ParticipantAvatar } from './ParticipantAvatar'

type ItemRef = ChainParticipant['givesItem']

interface ExchangeSummaryProps {
  /** Участник, за которого играет текущий пользователь: его вещь и уходит в цепочку. */
  me: ChainParticipant
  /** Соседи: вещь получает `receiver`, а приходит она от `giver`. */
  neighbours: Neighbours
  /** Обмен уже состоялся — подписи в прошедшем времени. */
  past?: boolean
}

const label = 'row-start-1 text-[11px] font-bold tracking-wide text-brand uppercase'
const title = 'row-start-3 text-center text-[13.5px] font-bold'

/**
 * Эгоцентричная суть обмена: «вы отдаёте X Марку → получаете Y от Ани».
 * Первое, что видит человек, — полная цепочка идёт вторым слоем (гипотеза H1).
 *
 * Имена соседей стоят здесь, а не только в стрелках ленты: главный вопрос человека —
 * с кем он имеет дело, ведь встречаться и передавать вещь он будет именно с ними.
 *
 * Ряды сетки держат подписи, миниатюры, названия вещей и имена сторон на одной линии,
 * а стрелку — ровно по центру ряда миниатюр.
 */
export function ExchangeSummary({ me, neighbours, past = false }: ExchangeSummaryProps) {
  const { receiver, giver } = neighbours
  const give = me.givesItem
  const receive = giver.givesItem

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] justify-items-center gap-x-2.5 gap-y-1 rounded-card bg-brand-soft p-3 sm:gap-y-1.5 sm:p-3.5">
      <small className={cx(label, 'col-start-1')}>{past ? 'Отдали' : 'Отдаёте'}</small>
      <small className={cx(label, 'col-start-3')}>{past ? 'Получили' : 'Получаете'}</small>

      <Thumb item={give} className="col-start-1" />
      <IconArrowRight size={26} className="col-start-2 row-start-2 self-center text-brand" />
      <Thumb item={receive} className="col-start-3" />

      <b className={cx(title, 'col-start-1')}>{give.title}</b>
      <b className={cx(title, 'col-start-3')}>{receive.title}</b>

      <Party participant={receiver} caption={dative(receiver.name)} className="col-start-1" />
      <Party participant={giver} caption={`от ${genitive(giver.name)}`} className="col-start-3" />
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

/** Вторая сторона передачи: лицо и имя в нужном падеже — «Марку», «от Ани». */
function Party({
  participant,
  caption,
  className,
}: {
  participant: ChainParticipant
  caption: string
  className: string
}) {
  return (
    <span className={cx('row-start-4 flex max-w-full items-center gap-1.5', className)}>
      <ParticipantAvatar
        participant={participant}
        className="size-4.5 bg-card text-[10px] font-bold text-ink-2"
      />
      <b className="min-w-0 truncate text-[12.5px] font-bold">{caption}</b>
    </span>
  )
}
