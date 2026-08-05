import { describe, expect, it } from 'vitest'
import type { Chain, ChainParticipant, ChainStatus, ParticipantStatus } from '../model/types'
import { countConfirmed, findDecliner, findMe, findNeighbours, needsMyAction } from './participants'

const participant = (
  userId: string,
  status: ParticipantStatus,
  isMe?: boolean,
): ChainParticipant => ({
  userId,
  name: `Участник ${userId}`,
  givesItem: { id: `item-${userId}`, title: `Вещь ${userId}` },
  status,
  ...(isMe ? { isMe: true } : {}),
})

const chain = (participants: ChainParticipant[], status: ChainStatus = 'formed'): Chain => ({
  id: 'c1',
  status,
  participants,
})

describe('findMe', () => {
  it('находит участника с флагом isMe', () => {
    const me = participant('me', 'pending', true)
    expect(findMe(chain([participant('u1', 'confirmed'), me]))).toBe(me)
  })

  it('возвращает undefined, если текущего пользователя нет в цепочке', () => {
    expect(findMe(chain([participant('u1', 'confirmed'), participant('u2', 'pending')]))).toBe(
      undefined,
    )
  })

  it('возвращает undefined для пустого списка участников', () => {
    expect(findMe(chain([]))).toBe(undefined)
  })

  it('при нескольких isMe (некорректные данные) берёт первого', () => {
    const first = participant('me-1', 'pending', true)
    const second = participant('me-2', 'confirmed', true)
    expect(findMe(chain([first, second]))).toBe(first)
  })
})

describe('needsMyAction', () => {
  it('цепочка formed и я ещё не ответил → ход за мной', () => {
    expect(needsMyAction(chain([participant('me', 'pending', true)], 'formed'))).toBe(true)
  })

  it('цепочка formed, но я уже подтвердил → жду остальных, действий не нужно', () => {
    expect(needsMyAction(chain([participant('me', 'confirmed', true)], 'formed'))).toBe(false)
  })

  it('цепочка formed, но я уже отказался → действий не нужно', () => {
    expect(needsMyAction(chain([participant('me', 'declined', true)], 'formed'))).toBe(false)
  })

  it.each<ChainStatus>(['active', 'completed', 'dissolved'])(
    'статус %s + мой pending → не срочно, отвечать уже поздно',
    (status) => {
      expect(needsMyAction(chain([participant('me', 'pending', true)], status))).toBe(false)
    },
  )

  it('меня нет в цепочке → ход не за мной', () => {
    expect(needsMyAction(chain([participant('u1', 'pending')], 'formed'))).toBe(false)
  })
})

describe('countConfirmed', () => {
  it('считает только подтвердивших, игнорируя pending и declined', () => {
    const c = chain([
      participant('u1', 'confirmed'),
      participant('u2', 'pending'),
      participant('u3', 'declined'),
      participant('me', 'confirmed', true),
    ])
    expect(countConfirmed(c)).toBe(2)
  })

  it('никто не подтвердил → 0', () => {
    expect(countConfirmed(chain([participant('u1', 'pending')]))).toBe(0)
  })

  it('пустая цепочка → 0', () => {
    expect(countConfirmed(chain([]))).toBe(0)
  })

  it('все подтвердили → длина списка', () => {
    const c = chain([participant('u1', 'confirmed'), participant('u2', 'confirmed')])
    expect(countConfirmed(c)).toBe(2)
  })
})

describe('findDecliner', () => {
  it('находит отказавшегося участника', () => {
    const decliner = participant('u2', 'declined')
    expect(findDecliner(chain([participant('u1', 'confirmed'), decliner]))).toBe(decliner)
  })

  it('находит отказ самого пользователя', () => {
    const me = participant('me', 'declined', true)
    expect(findDecliner(chain([participant('u1', 'confirmed'), me]))).toBe(me)
  })

  it('никто не отказался → undefined', () => {
    const c = chain([participant('u1', 'confirmed'), participant('u2', 'pending')])
    expect(findDecliner(c)).toBe(undefined)
  })

  it('при нескольких отказах возвращает первого по порядку обхода', () => {
    const first = participant('u1', 'declined')
    const second = participant('u2', 'declined')
    expect(findDecliner(chain([first, second]))).toBe(first)
  })
})

describe('findNeighbours', () => {
  it('я в середине круга: отдаю следующему, получаю от предыдущего', () => {
    const c = chain([
      participant('u1', 'confirmed'),
      participant('me', 'pending', true),
      participant('u3', 'confirmed'),
    ])
    expect(findNeighbours(c)).toEqual({
      receiver: c.participants[2],
      giver: c.participants[0],
    })
  })

  it('я первый в списке: получаю от последнего — круг замыкается', () => {
    const c = chain([
      participant('me', 'pending', true),
      participant('u2', 'confirmed'),
      participant('u3', 'confirmed'),
    ])
    expect(findNeighbours(c)).toEqual({
      receiver: c.participants[1],
      giver: c.participants[2],
    })
  })

  it('я последний в списке: отдаю первому — круг замыкается', () => {
    const c = chain([
      participant('u1', 'confirmed'),
      participant('u2', 'confirmed'),
      participant('me', 'pending', true),
    ])
    expect(findNeighbours(c)).toEqual({
      receiver: c.participants[0],
      giver: c.participants[1],
    })
  })

  it('цепочка из двоих: и отдаю, и получаю от одного и того же человека', () => {
    const c = chain([participant('me', 'pending', true), participant('u2', 'confirmed')])
    const neighbours = findNeighbours(c)
    expect(neighbours?.receiver).toBe(c.participants[1])
    expect(neighbours?.giver).toBe(c.participants[1])
  })

  it('вырожденная цепочка из одного меня: обоими соседями оказываюсь я сам', () => {
    const c = chain([participant('me', 'pending', true)])
    const neighbours = findNeighbours(c)
    expect(neighbours?.receiver).toBe(c.participants[0])
    expect(neighbours?.giver).toBe(c.participants[0])
  })

  it('меня нет в цепочке → undefined', () => {
    expect(findNeighbours(chain([participant('u1', 'confirmed')]))).toBe(undefined)
  })

  it('пустая цепочка → undefined', () => {
    expect(findNeighbours(chain([]))).toBe(undefined)
  })

  it('соседи не зависят от статусов участников', () => {
    const c = chain(
      [
        participant('u1', 'declined'),
        participant('me', 'confirmed', true),
        participant('u3', 'pending'),
      ],
      'dissolved',
    )
    expect(findNeighbours(c)).toEqual({
      receiver: c.participants[2],
      giver: c.participants[0],
    })
  })
})
