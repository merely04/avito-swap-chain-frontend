import { currentPersonaId, PERSONAS } from '@/shared/model/persona'
import type { Item, Wish } from '../model/types'

/** Ключи кэша TanStack Query для вещей. */
export const itemKeys = {
  my: () => ['my-items'] as const,
}

/** Что пользователь заполняет в форме: вещь без служебных полей. */
export type ItemDraft = Omit<Item, 'id' | 'status'>

const [DASHA, MARK, LENA] = PERSONAS

// Мок вместо бэкенда — заменяется на реальный запрос к Go-API (TanStack Query).
// Объявления разложены по владельцам: у каждой персоны свой кабинет. Зарезервированные
// вещи — те, что участвуют в цепочках из `chainApi`, id совпадают.
// У каждой персоны есть объявление в статусе `idle` — обычное объявление Авито, у которого
// обмен ещё не включён. Это точка входа в сервис, и каждое такое объявление кому-то из
// участников нужно: монитор ищет Марк, умные часы — Даша, приставку — Даша.
let itemsByOwner: Record<string, Item[]> = {
  [DASHA.id]: [
    {
      id: '3',
      title: 'Монитор LG 27" IPS',
      category: 'Электроника',
      condition: 'good',
      status: 'idle',
    },
    {
      id: '1',
      title: 'Горный велосипед',
      category: 'Спорт и отдых',
      condition: 'good',
      status: 'reserved',
      wish: { category: 'Электроника', description: 'Игровая приставка или смартфон' },
    },
    {
      id: '5',
      title: 'Кофеварка',
      category: 'Дом и дача',
      condition: 'good',
      status: 'reserved',
      wish: { category: 'Транспорт', description: 'Электросамокат' },
    },
    {
      id: '2',
      title: 'Гантели 20 кг',
      category: 'Спорт и отдых',
      condition: 'used',
      status: 'searching',
      wish: { category: 'Электроника', description: 'Умные часы' },
    },
  ],
  [MARK.id]: [
    {
      id: '23',
      title: 'Умные часы Amazfit GTR',
      category: 'Электроника',
      condition: 'good',
      status: 'idle',
    },
    {
      id: '21',
      title: 'Наушники',
      category: 'Аудио',
      condition: 'good',
      status: 'reserved',
      wish: { category: 'Спорт и отдых', description: 'Горный велосипед' },
    },
    {
      id: '22',
      title: 'Механическая клавиатура',
      category: 'Электроника',
      condition: 'new',
      status: 'searching',
      wish: { category: 'Электроника', description: 'Монитор 27"' },
    },
  ],
  [LENA.id]: [
    {
      id: '34',
      title: 'PlayStation 4 Slim, 1 ТБ',
      category: 'Электроника',
      condition: 'used',
      status: 'idle',
    },
    {
      id: '31',
      title: 'Плёночный фотоаппарат',
      category: 'Электроника',
      condition: 'used',
      status: 'reserved',
      wish: { category: 'Аудио', description: 'Наушники' },
    },
    {
      id: '33',
      title: 'Кофемолка',
      category: 'Дом и дача',
      condition: 'good',
      status: 'searching',
      wish: { category: 'Хобби и творчество', description: 'Виниловый проигрыватель' },
    },
  ],
}

let nextId = 100

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMyItems(): Promise<Item[]> {
  await delay(300)
  return itemsByOwner[currentPersonaId()] ?? []
}

/** Новая вещь сразу уходит в подбор — сервис ищет для неё цепочку. */
export async function createItem(draft: ItemDraft): Promise<Item> {
  await delay(400)

  const item: Item = { ...draft, id: String(nextId++), status: 'searching' }
  const ownerId = currentPersonaId()
  itemsByOwner = { ...itemsByOwner, [ownerId]: [item, ...(itemsByOwner[ownerId] ?? [])] }
  return item
}

/**
 * Включить обмен у уже размещённого объявления — главный вход в сервис: человек не заводит
 * вещь заново, а указывает, что готов её обменять. Без желания включать нечего: желание —
 * это ребро графа, по которому ищется цепочка.
 */
export async function setItemWish(id: string, wish: Wish): Promise<Item> {
  await delay(400)

  if (!wish.description.trim()) throw new Error('Не указано, что хочется взамен')

  const ownerId = currentPersonaId()
  const items = itemsByOwner[ownerId] ?? []
  const item = items.find((i) => i.id === id)
  if (!item) throw new Error(`Объявление ${id} не найдено`)

  // Вещь, уже попавшую в цепочку, из неё не вынимаем — уточнение желания её не расколдовывает.
  const updated: Item = { ...item, wish, status: item.status === 'idle' ? 'searching' : item.status }
  itemsByOwner = { ...itemsByOwner, [ownerId]: items.map((i) => (i.id === id ? updated : i)) }
  return updated
}
