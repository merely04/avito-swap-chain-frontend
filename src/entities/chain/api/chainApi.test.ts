import { beforeEach, describe, expect, it } from 'vitest'
import { PERSONAS, usePersonaStore } from '@/shared/model/persona'
import { findMe } from '../lib/participants'
import { getChain, getMyChains } from './chainApi'

const [DASHA, MARK] = PERSONAS

const lookAs = (personaId: string) => usePersonaStore.setState({ personaId })

beforeEach(() => {
  lookAs(DASHA.id)
})

describe('точка зрения персоны', () => {
  it('isMe достаётся выбранной персоне, а не лежит в данных', async () => {
    lookAs(MARK.id)
    const chain = await getChain('c1')

    expect(findMe(chain)?.userId).toBe(MARK.id)
    expect(chain.participants.filter((p) => p.isMe)).toHaveLength(1)
  })

  it('одна и та же цепочка глазами двух персон — разные «я»', async () => {
    const seenByDasha = await getChain('c1')
    lookAs(MARK.id)
    const seenByMark = await getChain('c1')

    expect(findMe(seenByDasha)?.userId).toBe(DASHA.id)
    expect(findMe(seenByMark)?.userId).toBe(MARK.id)
    expect(seenByDasha.participants.length).toBe(seenByMark.participants.length)
  })

  it('участник, за которого не смотрят, приходит без isMe', async () => {
    const chain = await getChain('c1')
    const mark = chain.participants.find((p) => p.userId === MARK.id)

    expect(mark?.isMe).toBe(undefined)
  })
})

describe('getMyChains', () => {
  it('возвращает только обмены, в которых участвует текущая персона', async () => {
    lookAs(MARK.id)
    const chains = await getMyChains()

    expect(chains.length).toBeGreaterThan(0)
    expect(chains.every((c) => c.participants.some((p) => p.userId === MARK.id))).toBe(true)
  })

  it('чужие обмены в кабинет не попадают', async () => {
    const dashaChains = await getMyChains()
    lookAs(MARK.id)
    const markChains = await getMyChains()

    const onlyDasha = dashaChains.filter((c) => !markChains.some((m) => m.id === c.id))
    expect(onlyDasha.length).toBeGreaterThan(0)
    expect(onlyDasha.every((c) => c.participants.every((p) => p.userId !== MARK.id))).toBe(true)
  })
})
