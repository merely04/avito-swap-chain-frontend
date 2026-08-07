import { Link } from 'react-router-dom'
import {
  cancelReason,
  countConfirmed,
  ExchangeSummary,
  findMe,
  findNeighbours,
  type Chain,
} from '@/entities/chain'
import { RespondToExchange } from '@/features/respond-to-exchange'
import { cx } from '@/shared/lib'
import { Card } from '@/shared/ui'

interface OfferCardProps {
  chain: Chain
  /** Сколько живых вариантов держат мою вещь из этого предложения — 1 значит соперников нет. */
  variants: number
}

/**
 * Одно предложение в списке: что отдаю и что получаю, кому и от кого, сколько участников уже
 * согласны — и ответ прямо отсюда. На экран цепочки уходят, чтобы разобраться, а не чтобы решить.
 */
export function OfferCard({ chain, variants }: OfferCardProps) {
  const me = findMe(chain)
  const neighbours = findNeighbours(chain)
  if (!me || !neighbours) return null

  const total = chain.participants.length
  const cancelled = chain.status === 'cancelled'

  return (
    <Card className="flex flex-col gap-3 p-3.5">
      {/* Отменённое предложение приглушено, но остаётся на месте: исчезнувшая карточка
          читается как поломка, а человеку надо понять, куда делся вариант. */}
      <div className={cx('flex flex-col gap-2', cancelled && 'opacity-60')}>
        <ExchangeSummary me={me} neighbours={neighbours} />

        <p className="text-[12.5px] text-ink-2">
          Участников: {total} · согласны {countConfirmed(chain)} из {total}
        </p>
      </div>

      {cancelled ? (
        <p className="text-[12.5px] leading-relaxed text-ink-2">
          <b className="font-bold">{cancelReason(chain)}.</b> Этот вариант больше не соберётся —
          зато ничего не потеряно: вещь свободна и участвует в подборе дальше.
        </p>
      ) : (
        <>
          {variants > 1 && (
            <p className="text-[12.5px] leading-relaxed text-ink-2">
              Ваша вещь «{me.givesItem.title}» участвует в{' '}
              <b className="font-bold">{variants} вариантах</b> — состоится один из них, остальные
              отменятся.
            </p>
          )}

          <RespondToExchange chainId={chain.id} />
        </>
      )}

      <Link
        to={`/exchange/${chain.id}`}
        className="rounded-sm text-center text-[13px] font-semibold text-brand outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
      >
        Разобраться в цепочке
      </Link>
    </Card>
  )
}
