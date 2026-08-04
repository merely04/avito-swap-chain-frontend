export type ItemCondition = 'new' | 'good' | 'used'

/** Статус вещи в обороте обмена. */
export type ItemStatus = 'idle' | 'searching' | 'reserved'

/** Что пользователь хочет получить взамен этой вещи. */
export interface Wish {
  category: string
  description: string
}

export interface Item {
  id: string
  title: string
  category: string
  condition: ItemCondition
  photoUrl?: string
  wish?: Wish
  status: ItemStatus
}
