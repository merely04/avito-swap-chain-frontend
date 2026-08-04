/** Состояние цепочки обмена (машина состояний сделки). */
export type ChainStatus = 'formed' | 'active' | 'completed' | 'dissolved'

/** Решение конкретного участника по цепочке. */
export type ParticipantStatus = 'pending' | 'confirmed' | 'declined'

export interface ChainParticipant {
  userId: string
  name: string
  avatarUrl?: string
  rating?: number
  /** Вещь, которую участник отдаёт следующему по кругу. */
  givesItem: { id: string; title: string }
  status: ParticipantStatus
  isMe?: boolean
}

export interface Chain {
  id: string
  status: ChainStatus
  /** Участники в порядке обхода цикла: participants[i] отдаёт вещь participants[i+1]. */
  participants: ChainParticipant[]
}
