import type { Item } from '../model/types'

/** Ключи кэша TanStack Query для вещей. */
export const itemKeys = {
  my: () => ['my-items'] as const,
}

/** Что пользователь заполняет в форме: вещь без служебных полей. */
export type ItemDraft = Omit<Item, 'id' | 'status'>

// Мок вместо бэкенда — заменяется на реальный запрос к Go-API (TanStack Query).
let myItems: Item[] = [
  {
    id: '1',
    title: 'Горный велосипед',
    category: 'Спорт и отдых',
    condition: 'good',
    status: 'reserved',
    wish: { category: 'Электроника', description: 'Игровая приставка или смартфон' },
  },
  {
    id: '2',
    title: 'Плёночный фотоаппарат',
    category: 'Электроника',
    condition: 'used',
    status: 'searching',
    wish: { category: 'Аудио', description: 'Наушники' },
  },
]

let nextId = 100

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMyItems(): Promise<Item[]> {
  await delay(300)
  return myItems
}

/** Новая вещь сразу уходит в подбор — сервис ищет для неё цепочку. */
export async function createItem(draft: ItemDraft): Promise<Item> {
  await delay(400)

  const item: Item = { ...draft, id: String(nextId++), status: 'searching' }
  myItems = [item, ...myItems]
  return item
}
