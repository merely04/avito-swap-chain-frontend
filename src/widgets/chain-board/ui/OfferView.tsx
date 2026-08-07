import { ChainRibbon, ExchangeSummary, ParticipantStatusList } from '@/entities/chain'
import { RespondToExchange } from '@/features/respond-to-exchange'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'

/** FORMED + я PENDING: один из подобранных вариантов, от меня ждут ответа. */
export function OfferView({ chain, me, neighbours }: ChainViewProps) {
  return (
    <>
      <ExchangeSummary me={me} neighbours={neighbours} />

      <ChainRibbon participants={chain.participants} neighbours={neighbours} />
      <p className="-mt-1 text-center text-[12px] text-ink-3">
        Каждый отдаёт вещь соседу по кругу — без денег
      </p>

      <ParticipantStatusList participants={chain.participants} neighbours={neighbours} />

      <BoardFooter>
        <p className="text-center text-[12.5px] text-ink-2">
          Обмен начнётся, когда вариант подойдёт всем. Вещь пока остаётся у вас.
        </p>
        <RespondToExchange chainId={chain.id} />
      </BoardFooter>
    </>
  )
}
