import { currentPersonaId, PERSONAS, type Persona } from '@/shared/model/persona'
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

/** Участник-персона: имя и рейтинг берём из общего реестра, чтобы они не разъезжались. */
const of = (
  persona: Persona,
  givesItem: ChainParticipant['givesItem'],
  status: ParticipantStatus,
): ChainParticipant => ({
  userId: persona.id,
  name: persona.name,
  rating: persona.rating,
  givesItem,
  status,
})

// Мок вместо Go-API: цепочки живут в модуле, мутации меняют их так же, как это делал бы
// бэкенд. Меняется на реальные HTTP-вызовы без правок компонентов.
// Порядок участников = обход цикла: participants[i] отдаёт вещь participants[i + 1].
// Флага `isMe` в данных нет: чья это цепочка — вопрос точки зрения, см. `asSeenBy`.
let chains: Chain[] = [
  {
    id: 'c1',
    status: 'formed',
    participants: [
      of(DASHA, { id: '1', title: 'Горный велосипед' }, 'pending'),
      of(MARK, { id: '21', title: 'Наушники' }, 'confirmed'),
      of(LENA, { id: '31', title: 'Плёночный фотоаппарат' }, 'pending'),
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
      of(DASHA, { id: '5', title: 'Кофеварка' }, 'confirmed'),
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
      of(LENA, { id: '32', title: 'Настольная лампа' }, 'confirmed'),
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

/** Подтвердить получение вещи. В MVP закрывает всю цепочку. */
export async function confirmReceipt(id: string): Promise<void> {
  await delay(400)
  find(id)
  replace(id, (chain) => ({ ...chain, status: 'completed' }))
}
