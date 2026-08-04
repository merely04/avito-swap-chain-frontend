import { findMe, type Chain } from '../../../entities/chain'

export type ChainView = 'offer' | 'waiting' | 'handoff' | 'completed' | 'dissolved'

/**
 * Машина состояний сделки → под-вид экрана: `chain.status × статус моего участника`.
 * Один роут `/exchange/:id` показывает разное — код повторяет продуктовую логику 1:1.
 */
export function selectView(chain: Chain): ChainView {
  switch (chain.status) {
    case 'dissolved':
      return 'dissolved'
    case 'completed':
      return 'completed'
    case 'active':
      return 'handoff'
    case 'formed':
      return findMe(chain)?.status === 'confirmed' ? 'waiting' : 'offer'
  }
}
