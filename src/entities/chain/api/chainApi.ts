import { currentPersonaId, PERSONAS, type Persona } from '@/shared/model/persona'
import { confirmReceiptFor } from '../lib/participants'
import type { Chain, ChainParticipant, ParticipantStatus } from '../model/types'

/**
 * Ключи кэша TanStack Query. Иерархия не случайна: `my` — префикс `detail`,
 * поэтому инвалидация `all` после действия обновляет и цепочку, и список обменов.
 */
export const chainKeys = {
  all: ['chains'] as const,
  my: () => chainKeys.all,
  detail: (id: string) => [...chainKeys.all, id] as const,
}

/** Ответ участника на предложение обмена. */
export type ChainDecision = Extract<ParticipantStatus, 'confirmed' | 'declined'>

const [DASHA, MARK, LENA] = PERSONAS

/** Участник-персона: имя, рейтинг и аватар берём из общего реестра, чтобы они не разъезжались. */
const of = (
  persona: Persona,
  givesItem: ChainParticipant['givesItem'],
  status: ParticipantStatus,
  receiptConfirmed = false,
): ChainParticipant => ({
  userId: persona.id,
  name: persona.name,
  avatarUrl: persona.avatarUrl,
  rating: persona.rating,
  givesItem,
  status,
  receiptConfirmed,
})

// Мок вместо Go-API: цепочки живут в модуле, мутации меняют их так же, как это делал бы
// бэкенд. Меняется на реальные HTTP-вызовы без правок компонентов.
// Порядок участников = обход цикла: participants[i] отдаёт вещь participants[i + 1].
// Флага `isMe` в данных нет: чья это цепочка — вопрос точки зрения, см. `asSeenBy`.
// Длина цепочки — три участника: по исследованиям обмена почками переход с трёх на четыре
// добавляет 1–5% совпадений, а алгоритм и объяснимость сделки тяжелеют заметно сильнее.
let chains: Chain[] = [
  // Демонстрационная цепочка: все трое — персоны, поэтому один обмен виден тремя парами глаз.
  // Даша отдаёт велосипед Марку, Марк наушники — Лене, Лена фотоаппарат — Даше: каждый получает
  // ровно то, что указал в желании (см. `wish` этих вещей в `itemsApi`).
  {
    id: 'c1',
    status: 'formed',
    participants: [
      of(
        DASHA,
        { id: '1', title: 'Горный велосипед', photoUrl: '/mock/items/bike.jpg' },
        'pending',
      ),
      of(
        MARK,
        { id: '21', title: 'Наушники', photoUrl: '/mock/items/headphones.jpg' },
        'confirmed',
      ),
      of(
        LENA,
        { id: '31', title: 'Плёночный фотоаппарат', photoUrl: '/mock/items/camera.jpg' },
        'pending',
      ),
    ],
  },
  // Идущая передача: Игорь свою вещь уже получил, Соня — ещё нет. Значит после отметки
  // текущего пользователя цепочка не закроется — видно состояние «жду остальных».
  {
    id: 'c2',
    status: 'active',
    participants: [
      of(DASHA, { id: '5', title: 'Кофеварка', photoUrl: '/mock/items/coffee.jpg' }, 'confirmed'),
      {
        userId: 'u5',
        name: 'Игорь',
        avatarUrl: '/mock/avatars/u60.jpg',
        rating: 4.8,
        givesItem: { id: '51', title: 'Акустическая гитара', photoUrl: '/mock/items/guitar.jpg' },
        status: 'confirmed',
        receiptConfirmed: true,
      },
      // Единственный участник без `avatarUrl` — намеренно: на нём видно фолбэк на инициал.
      {
        userId: 'u6',
        name: 'Соня',
        rating: 4.6,
        givesItem: { id: '61', title: 'Электросамокат', photoUrl: '/mock/items/scooter.jpg' },
        status: 'confirmed',
        receiptConfirmed: false,
      },
    ],
  },
  {
    id: 'c3',
    status: 'completed',
    participants: [
      of(
        LENA,
        { id: '32', title: 'Настольная лампа', photoUrl: '/mock/items/lamp.jpg' },
        'confirmed',
        true,
      ),
      {
        userId: 'u7',
        name: 'Паша',
        avatarUrl: '/mock/avatars/u68.jpg',
        rating: 4.9,
        givesItem: { id: '71', title: 'Монитор 24"', photoUrl: '/mock/items/monitor24.jpg' },
        status: 'confirmed',
        receiptConfirmed: true,
      },
      {
        userId: 'u8',
        name: 'Катя',
        avatarUrl: '/mock/avatars/u26.jpg',
        rating: 5.0,
        givesItem: { id: '81', title: 'Плед', photoUrl: '/mock/items/blanket.jpg' },
        status: 'confirmed',
        receiptConfirmed: true,
      },
    ],
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function find(id: string): Chain {
  const chain = chains.find((c) => c.id === id)
  if (!chain) throw new Error(`Цепочка ${id} не найдена`)
  return chain
}

/** Заменить цепочку новым объектом — ссылка меняется, TanStack Query видит обновление. */
function replace(id: string, update: (chain: Chain) => Chain) {
  chains = chains.map((chain) => (chain.id === id ? update(chain) : chain))
}

/**
 * Цепочка глазами конкретного пользователя: `isMe` не лежит в данных, а проставляется
 * на ответе — ровно так же поступил бы бэкенд, зная, кто именно запрашивает.
 */
const asSeenBy = (chain: Chain, personaId: string): Chain => ({
  ...chain,
  participants: chain.participants.map((p) => (p.userId === personaId ? { ...p, isMe: true } : p)),
})

const withPersonaStatus = (chain: Chain, personaId: string, status: ParticipantStatus): Chain => ({
  ...chain,
  participants: chain.participants.map((p) => (p.userId === personaId ? { ...p, status } : p)),
})

/** Обмены, в которых участвует текущий пользователь, — чужие в кабинет не попадают. */
export async function getMyChains(): Promise<Chain[]> {
  await delay(300)
  const personaId = currentPersonaId()

  return chains
    .filter((chain) => chain.participants.some((p) => p.userId === personaId))
    .map((chain) => asSeenBy(chain, personaId))
}

export async function getChain(id: string): Promise<Chain> {
  await delay(250)
  return asSeenBy(find(id), currentPersonaId())
}

/** Подтвердить или отклонить участие. Отказ любого участника распускает цепочку. */
export async function respondToChain(id: string, decision: ChainDecision): Promise<void> {
  await delay(400)
  find(id)
  const personaId = currentPersonaId()

  if (decision === 'declined') {
    replace(id, (chain) => ({
      ...withPersonaStatus(chain, personaId, 'declined'),
      status: 'dissolved',
    }))
    return
  }

  replace(id, (chain) => withPersonaStatus(chain, personaId, 'confirmed'))

  // Демо-имитация ответа остальных участников: на бэке это придёт обычным refetch.
  setTimeout(() => {
    // За это время пользователь мог выйти из цепочки — распавшуюся не воскрешаем.
    if (find(id).status !== 'formed') return

    replace(id, (chain) => ({
      ...chain,
      status: 'active',
      participants: chain.participants.map((p) => ({ ...p, status: 'confirmed' })),
    }))
  }, 2500)
}

/** Выйти из цепочки до общего подтверждения — вещь снова свободна. */
export async function leaveChain(id: string): Promise<void> {
  await delay(400)
  find(id)
  replace(id, (chain) => ({
    ...withPersonaStatus(chain, currentPersonaId(), 'declined'),
    status: 'dissolved',
  }))
}

/**
 * Подтвердить получение вещи. Отмечается только текущий пользователь: цепочка закроется,
 * когда получение подтвердят все — обмен состоялся только тогда, когда его закрыли с обеих сторон.
 */
export async function confirmReceipt(id: string): Promise<void> {
  await delay(400)
  find(id)
  replace(id, (chain) => confirmReceiptFor(chain, currentPersonaId()))

  // Демо-имитация отметки остальных участников: на бэке это придёт обычным refetch.
  setTimeout(() => {
    // За это время получение мог отметить последний участник — закрытую цепочку не трогаем.
    if (find(id).status !== 'active') return

    replace(id, (chain) => ({
      ...chain,
      status: 'completed',
      participants: chain.participants.map((p) => ({ ...p, receiptConfirmed: true })),
    }))
  }, 2500)
}
