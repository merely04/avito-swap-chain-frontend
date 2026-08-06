import type { ReactNode } from 'react'
import { countReceipts, ExchangeSummary } from '@/entities/chain'
import { ConfirmReceipt } from '@/features/confirm-receipt'
import { Banner, IconCheck } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'
import { ChainProgress } from './ChainProgress'

/** ACTIVE: все подтвердили — остались шаги передачи вещей. */
export function HandoffView({ chain, me, neighbours }: ChainViewProps) {
  const { receiver, giver } = neighbours
  const receive = giver.givesItem
  const done = me.receiptConfirmed

  const steps: ReactNode[] = [
    <>
      Договоритесь о встрече — вашу вещь получает <b className="font-bold">{receiver.name}</b>
    </>,
    <>Передайте «{me.givesItem.title}»</>,
    <>
      Заберите «{receive.title}» — вещь отдаёт <b className="font-bold">{giver.name}</b>
    </>,
    <>Отметьте, что получили вещь</>,
  ]

  return (
    <>
      <Banner tone="ok" icon={<IconCheck size={20} />}>
        {done ? (
          <>
            <b className="font-bold">Вы отметили получение.</b> Ждём остальных участников.
          </>
        ) : (
          <>
            <b className="font-bold">Все подтвердили.</b> Переходите к передаче.
          </>
        )}
      </Banner>

      <ExchangeSummary give={me.givesItem} receive={receive} />

      {done ? (
        <ChainProgress
          label="Получение отметили"
          value={countReceipts(chain)}
          total={chain.participants.length}
        />
      ) : (
        <ol className="flex flex-col">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3 border-b border-line-2 py-2.5 last:border-b-0">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand">
                {index + 1}
              </span>
              <span className="pt-0.5 text-[13.5px]">{step}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Когда все отметят получение — цепочка закроется, обмен завершится.
      </p>

      <BoardFooter>
        {done ? (
          <p className="text-center text-[12.5px] text-ink-2">
            Свою часть обмена вы выполнили — повторно отмечать не нужно.
          </p>
        ) : (
          <ConfirmReceipt chainId={chain.id} />
        )}
      </BoardFooter>
    </>
  )
}
