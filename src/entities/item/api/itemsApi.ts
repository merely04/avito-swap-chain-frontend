import type { Item } from '../model/types'

// Мок вместо бэкенда — заменяется на реальный запрос к Go-API (TanStack Query).
const MY_ITEMS: Item[] = [
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

export function getMyItems(): Promise<Item[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MY_ITEMS), 300)
  })
}
