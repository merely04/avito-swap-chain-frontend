import { findMe, findNeighbours, type Chain } from '@/entities/chain'
import { selectView } from '../lib/selectView'
import type { ChainViewProps } from '../model/types'
import { OfferView } from './OfferView'
import { WaitingView } from './WaitingView'
import { HandoffView } from './HandoffView'
import { CompletedView } from './CompletedView'
import { DissolvedView } from './DissolvedView'

/** Доска цепочки: по состоянию сделки выбирает, что именно показать пользователю. */
export function ChainBoard({ chain }: { chain: Chain }) {
  const me = findMe(chain)
  const neighbours = findNeighbours(chain)

  return (
    <div className="flex flex-1 flex-col gap-3 sm:gap-3.5">
      {me && neighbours ? (
        renderView({ chain, me, neighbours })
      ) : (
        <p className="py-10 text-center text-sm text-ink-2">Вы не участвуете в этой цепочке.</p>
      )}
    </div>
  )
}

function renderView(props: ChainViewProps) {
  switch (selectView(props.chain)) {
    case 'offer':
      return <OfferView {...props} />
    case 'waiting':
      return <WaitingView {...props} />
    case 'handoff':
      return <HandoffView {...props} />
    case 'completed':
      return <CompletedView {...props} />
    case 'dissolved':
      return <DissolvedView {...props} />
  }
}
