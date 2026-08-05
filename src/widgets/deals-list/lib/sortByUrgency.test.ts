import { describe, expect, it } from 'vitest'
import type { Chain, ChainParticipant, ChainStatus, ParticipantStatus } from '@/entities/chain'
import { sortByUrgency } from './sortByUrgency'

/** Цепочка из двоих: я и ещё один участник. `myStatus === undefined` → меня в ней нет. */
const chain = (id: string, status: ChainStatus, myStatus?: ParticipantStatus): Chain => ({
  id,
  status,
  participants: [
    {
      userId: 'u1',
      name: 'Марк',
      givesItem: { id: 'item-u1', title: 'Наушники' },
      status: 'confirmed',
    },
    ...(myStatus
      ? [
          {
            userId: 'me',
            name: 'Вы',
            givesItem: { id: 'item-me', title: 'Велосипед' },
            status: myStatus,
            isMe: true,
          } satisfies ChainParticipant,
        ]
      : []),
  ],
})

const ids = (chains: Chain[]) => chains.map((c) => c.id)

describe('sortByUrgency', () => {
  it('цепочка, ждущая моего ответа, поднимается в самый верх', () => {
    const input = [
      chain('completed', 'completed', 'confirmed'),
      chain('urgent', 'formed', 'pending'),
      chain('active', 'active', 'confirmed'),
    ]
    expect(ids(sortByUrgency(input))).toEqual(['urgent', 'active', 'completed'])
  })

  it('порядок статусов: formed → active → dissolved → completed', () => {
    const input = [
      chain('completed', 'completed', 'confirmed'),
      chain('dissolved', 'dissolved', 'declined'),
      chain('active', 'active', 'confirmed'),
      chain('formed', 'formed', 'confirmed'),
    ]
    expect(ids(sortByUrgency(input))).toEqual(['formed', 'active', 'dissolved', 'completed'])
  })

  it('срочная цепочка обгоняет даже formed, где я уже подтвердил', () => {
    const input = [chain('waiting', 'formed', 'confirmed'), chain('urgent', 'formed', 'pending')]
    expect(ids(sortByUrgency(input))).toEqual(['urgent', 'waiting'])
  })

  it('мой отказ снимает срочность: цепочка падает вниз к остальным formed', () => {
    const input = [chain('declined', 'formed', 'declined'), chain('urgent', 'formed', 'pending')]
    expect(ids(sortByUrgency(input))).toEqual(['urgent', 'declined'])
  })

  it('цепочка без меня никогда не срочная', () => {
    const input = [chain('stranger', 'formed'), chain('urgent', 'formed', 'pending')]
    expect(ids(sortByUrgency(input))).toEqual(['urgent', 'stranger'])
  })

  it('pending в уже запущенной цепочке не делает её срочной', () => {
    const input = [chain('active', 'active', 'pending'), chain('formed', 'formed', 'confirmed')]
    expect(ids(sortByUrgency(input))).toEqual(['formed', 'active'])
  })

  it('при равной срочности сохраняет исходный порядок (сортировка стабильна)', () => {
    const input = [
      chain('a', 'active', 'confirmed'),
      chain('b', 'active', 'confirmed'),
      chain('c', 'active', 'confirmed'),
    ]
    expect(ids(sortByUrgency(input))).toEqual(['a', 'b', 'c'])
  })

  it('несколько срочных цепочек сохраняют исходный порядок между собой', () => {
    const input = [
      chain('u1', 'formed', 'pending'),
      chain('done', 'completed', 'confirmed'),
      chain('u2', 'formed', 'pending'),
    ]
    expect(ids(sortByUrgency(input))).toEqual(['u1', 'u2', 'done'])
  })

  it('не мутирует исходный массив и возвращает новый', () => {
    const input = [
      chain('completed', 'completed', 'confirmed'),
      chain('urgent', 'formed', 'pending'),
    ]
    const result = sortByUrgency(input)
    expect(result).not.toBe(input)
    expect(ids(input)).toEqual(['completed', 'urgent'])
  })

  it('пустой список остаётся пустым', () => {
    expect(sortByUrgency([])).toEqual([])
  })

  it('один элемент возвращается как есть', () => {
    expect(ids(sortByUrgency([chain('only', 'dissolved', 'declined')]))).toEqual(['only'])
  })
})
