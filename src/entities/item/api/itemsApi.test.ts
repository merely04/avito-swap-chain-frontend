import { beforeEach, describe, expect, it } from 'vitest'
import { PERSONAS, usePersonaStore } from '@/shared/model/persona'
import { getMyItems, setItemWish } from './itemsApi'

const [DASHA, MARK] = PERSONAS

const wish = { category: 'Электроника', description: 'Монитор 27"' }

const itemOf = async (id: string) => (await getMyItems()).find((item) => item.id === id)

describe('setItemWish — включение обмена у размещённого объявления', () => {
  beforeEach(() => {
    usePersonaStore.setState({ personaId: DASHA.id })
  })

  it('объявление без обмена уходит в подбор цепочки', async () => {
    const updated = await setItemWish('3', wish)

    expect(updated.status).toBe('searching')
    expect(updated.wish).toEqual(wish)
  })

  it('изменение сохраняется в кабинете, а не только в ответе', async () => {
    await setItemWish('3', wish)

    expect((await itemOf('3'))?.status).toBe('searching')
  })

  it('вещь, уже попавшую в цепочку, обмен не расколдовывает', async () => {
    // '1' — велосипед Даши, он зарезервирован в цепочке c1.
    const updated = await setItemWish('1', { category: 'Аудио', description: 'Колонка' })

    expect(updated.status).toBe('reserved')
    expect(updated.wish?.description).toBe('Колонка')
  })

  it('без описания желания включать обмен нечего — ребро графа не построить', async () => {
    await expect(setItemWish('3', { category: 'Электроника', description: '   ' })).rejects.toThrow()
  })

  it('чужое объявление не тронуть: id ищется в кабинете текущей персоны', async () => {
    // '23' — часы Марка; Даша про них знать не должна.
    await expect(setItemWish('23', wish)).rejects.toThrow()

    usePersonaStore.setState({ personaId: MARK.id })
    await expect(setItemWish('23', wish)).resolves.toMatchObject({ status: 'searching' })
  })
})
