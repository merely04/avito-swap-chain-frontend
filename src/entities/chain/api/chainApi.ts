import type { Chain, ParticipantStatus } from '../model/types'

/** Ключи кэша TanStack Query для цепочек. */
export const chainKeys = {
  detail: (id: string) => ['chain', id] as const,
}

/** Ответ участника на предложение обмена. */
export type ChainDecision = Extract<ParticipantStatus, 'confirmed' | 'declined'>

// Мок вместо Go-API: цепочка живёт в модуле, мутации меняют её так же, как это делал бы
// бэкенд. Меняется на реальные HTTP-вызовы без правок компонентов.
// Порядок участников = обход цикла: participants[i] отдаёт вещь participants[i + 1].
let chain: Chain = {
  id: 'c1',
  status: 'formed',
  participants: [
    {
      userId: 'me',
      name: 'Вы',
      givesItem: { id: '1', title: 'Горный велосипед' },
      status: 'pending',
      isMe: true,
    },
    {
      userId: 'u2',
      name: 'Марк',
      rating: 4.9,
      givesItem: { id: '21', title: 'Наушники' },
      status: 'confirmed',
    },
    {
      userId: 'u3',
      name: 'Лена',
      rating: 4.7,
      givesItem: { id: '31', title: 'Плёночный фотоаппарат' },
      status: 'pending',
    },
    {
      userId: 'u4',
      name: 'Аня',
      rating: 5.0,
      givesItem: { id: '41', title: 'Смартфон' },
      status: 'confirmed',
    },
  ],
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function assertExists(id: string) {
  if (id !== chain.id) throw new Error(`Цепочка ${id} не найдена`)
}

/** Новая цепочка с изменённым статусом текущего пользователя. */
const withMyStatus = (status: ParticipantStatus): Chain => ({
  ...chain,
  participants: chain.participants.map((p) => (p.isMe ? { ...p, status } : p)),
})

export async function getChain(id: string): Promise<Chain> {
  await delay(250)
  assertExists(id)
  return chain
}

/** Подтвердить или отклонить участие. Отказ любого участника распускает цепочку. */
export async function respondToChain(id: string, decision: ChainDecision): Promise<void> {
  await delay(400)
  assertExists(id)

  if (decision === 'declined') {
    chain = { ...withMyStatus('declined'), status: 'dissolved' }
    return
  }

  chain = withMyStatus('confirmed')

  // Демо-имитация ответа остальных участников: на бэке это придёт обычным refetch.
  setTimeout(() => {
    chain = {
      ...chain,
      status: 'active',
      participants: chain.participants.map((p) => ({ ...p, status: 'confirmed' })),
    }
  }, 2500)
}

/** Выйти из цепочки до общего подтверждения — вещь снова свободна. */
export async function leaveChain(id: string): Promise<void> {
  await delay(400)
  assertExists(id)
  chain = { ...withMyStatus('declined'), status: 'dissolved' }
}

/** Подтвердить получение вещи. В MVP закрывает всю цепочку. */
export async function confirmReceipt(id: string): Promise<void> {
  await delay(400)
  assertExists(id)
  chain = { ...chain, status: 'completed' }
}
