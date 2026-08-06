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
  givesItem: { id: string; title: string; photoUrl?: string }
  status: ParticipantStatus
  /**
   * Отметил ли участник, что получил свою вещь. Флаг у участника, а не у цепочки:
   * иначе на стадии передачи не отличить «я подтвердил, жду остальных» от «мне надо нажать кнопку».
   */
  receiptConfirmed: boolean
  isMe?: boolean
}

export interface Chain {
  id: string
  status: ChainStatus
  /** Участники в порядке обхода цикла: participants[i] отдаёт вещь participants[i+1]. */
  participants: ChainParticipant[]
}
