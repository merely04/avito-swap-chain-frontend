import type { ReactNode } from 'react'
import { ExchangeSummary } from '../../../entities/chain'
import { ConfirmReceipt } from '../../../features/confirm-receipt'
import { Banner, IconCheck } from '../../../shared/ui'
import type { ChainViewProps } from '../model/types'

/** ACTIVE: все подтвердили — остались шаги передачи вещей. */
export function HandoffView({ chain, me, neighbours }: ChainViewProps) {
  const { receiver, giver } = neighbours
  const receive = giver.givesItem

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
        <b className="font-bold">Все подтвердили.</b> Переходите к передаче.
      </Banner>

      <ExchangeSummary give={me.givesItem} receive={receive} />

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

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Когда все отметят передачу — цепочка закроется, обмен завершится.
      </p>

      <div className="mt-auto pt-2">
        <ConfirmReceipt chainId={chain.id} />
      </div>
    </>
  )
}
