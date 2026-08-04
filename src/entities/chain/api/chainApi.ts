import type { Chain, ParticipantStatus } from '../model/types'

/** Ключи кэша TanStack Query для цепочек. */
export const chainKeys = {
  my: () => ['chains'] as const,
  detail: (id: string) => ['chain', id] as const,
}

/** Ответ участника на предложение обмена. */
export type ChainDecision = Extract<ParticipantStatus, 'confirmed' | 'declined'>

// Мок вместо Go-API: цепочки живут в модуле, мутации меняют их так же, как это делал бы
// бэкенд. Меняется на реальные HTTP-вызовы без правок компонентов.
// Порядок участников = обход цикла: participants[i] отдаёт вещь participants[i + 1].
let chains: Chain[] = [
  {
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
  },
  {
    id: 'c2',
    status: 'active',
    participants: [
      {
        userId: 'me',
        name: 'Вы',
        givesItem: { id: '5', title: 'Кофеварка' },
        status: 'confirmed',
        isMe: true,
      },
      {
        userId: 'u5',
        name: 'Игорь',
        rating: 4.8,
        givesItem: { id: '51', title: 'Акустическая гитара' },
        status: 'confirmed',
      },
      {
        userId: 'u6',
        name: 'Соня',
        rating: 4.6,
        givesItem: { id: '61', title: 'Электросамокат' },
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'c3',
    status: 'completed',
    participants: [
      {
        userId: 'me',
        name: 'Вы',
        givesItem: { id: '7', title: 'Настольная лампа' },
        status: 'confirmed',
        isMe: true,
      },
      {
        userId: 'u7',
        name: 'Паша',
        rating: 4.9,
        givesItem: { id: '71', title: 'Монитор 24"' },
        status: 'confirmed',
      },
      {
        userId: 'u8',
        name: 'Катя',
        rating: 5.0,
        givesItem: { id: '81', title: 'Плед' },
        status: 'confirmed',
      },
      {
        userId: 'u9',
        name: 'Рома',
        rating: 4.5,
        givesItem: { id: '91', title: 'Кресло-мешок' },
        status: 'confirmed',
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

const withMyStatus = (chain: Chain, status: ParticipantStatus): Chain => ({
  ...chain,
  participants: chain.participants.map((p) => (p.isMe ? { ...p, status } : p)),
})

export async function getMyChains(): Promise<Chain[]> {
  await delay(300)
  return chains
}

export async function getChain(id: string): Promise<Chain> {
  await delay(250)
  return find(id)
}

/** Подтвердить или отклонить участие. Отказ любого участника распускает цепочку. */
export async function respondToChain(id: string, decision: ChainDecision): Promise<void> {
  await delay(400)
  find(id)

  if (decision === 'declined') {
    replace(id, (chain) => ({ ...withMyStatus(chain, 'declined'), status: 'dissolved' }))
    return
  }

  replace(id, (chain) => withMyStatus(chain, 'confirmed'))

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
  replace(id, (chain) => ({ ...withMyStatus(chain, 'declined'), status: 'dissolved' }))
}

/** Подтвердить получение вещи. В MVP закрывает всю цепочку. */
export async function confirmReceipt(id: string): Promise<void> {
  await delay(400)
  find(id)
  replace(id, (chain) => ({ ...chain, status: 'completed' }))
}
