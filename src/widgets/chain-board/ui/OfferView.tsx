import { ChainRing, ExchangeSummary, ParticipantStatusList } from '@/entities/chain'
import { RespondToExchange } from '@/features/respond-to-exchange'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'

/** FORMED + я PENDING: предложение обмена, от меня ждут решения. */
export function OfferView({ chain, me, neighbours }: ChainViewProps) {
  return (
    <>
      <ExchangeSummary give={me.givesItem} receive={neighbours.giver.givesItem} reserved />

      <ChainRing participants={chain.participants} />
      <p className="-mt-1 text-center text-[12px] text-ink-3">
        Каждый отдаёт вещь соседу по кругу — без денег
      </p>

      <ParticipantStatusList participants={chain.participants} />

      <BoardFooter>
        <p className="text-center text-[12.5px] text-ink-2">
          Обмен состоится, только когда подтвердят все. До этого вещь остаётся у вас.
        </p>
        <RespondToExchange chainId={chain.id} />
      </BoardFooter>
    </>
  )
}
