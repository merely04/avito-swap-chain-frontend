import { findMe, findNeighbours, type Chain } from '../../../entities/chain'
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

  if (!me || !neighbours) {
    return <p className="py-10 text-center text-sm text-ink-2">Вы не участвуете в этой цепочке.</p>
  }

  const props: ChainViewProps = { chain, me, neighbours }

  switch (selectView(chain)) {
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
