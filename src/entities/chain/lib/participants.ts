import type { Chain, ChainParticipant } from '../model/types'

/** Участник, за которого играет текущий пользователь. */
export const findMe = (chain: Chain): ChainParticipant | undefined =>
  chain.participants.find((p) => p.isMe)

/** Сколько участников уже подтвердили участие — числитель прогресса «N из M». */
export const countConfirmed = (chain: Chain): number =>
  chain.participants.filter((p) => p.status === 'confirmed').length

/** Участник, отказавшийся от обмена, — из-за него цепочка распалась. */
export const findDecliner = (chain: Chain): ChainParticipant | undefined =>
  chain.participants.find((p) => p.status === 'declined')

export interface Neighbours {
  /** Кому я отдаю свою вещь (следующий по кругу). */
  receiver: ChainParticipant
  /** От кого получаю вещь (предыдущий по кругу). */
  giver: ChainParticipant
}

/** Соседи по кругу обмена. `null`, если текущего пользователя нет в цепочке. */
export function findNeighbours(chain: Chain): Neighbours | null {
  const index = chain.participants.findIndex((p) => p.isMe)
  if (index === -1) return null

  const total = chain.participants.length
  return {
    receiver: chain.participants[(index + 1) % total],
    giver: chain.participants[(index + total - 1) % total],
  }
}
