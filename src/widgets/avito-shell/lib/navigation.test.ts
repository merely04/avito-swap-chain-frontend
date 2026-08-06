import { describe, expect, it } from 'vitest'
import { getBreadcrumbs, getSection } from './navigation'

describe('getSection', () => {
  it('дашборд без параметров — «Мои объявления»', () => {
    expect(getSection('/', null)).toBe('items')
  })

  it('вкладки дашборда задают раздел', () => {
    expect(getSection('/', 'wishes')).toBe('wishes')
    expect(getSection('/', 'exchanges')).toBe('exchange')
  })

  it('роут цепочки — тот же раздел «Обмен», что и вкладка', () => {
    expect(getSection('/exchange/c1', null)).toBe('exchange')
  })

  it('создание объявления — свой раздел', () => {
    expect(getSection('/items/new', null)).toBe('new-item')
  })

  it('незнакомая вкладка не ломает подсветку', () => {
    expect(getSection('/', 'whatever')).toBe('items')
  })
})

describe('getBreadcrumbs', () => {
  it('корень «Авито» некликабелен — главной Авито в демо нет', () => {
    expect(getBreadcrumbs('items')[0]).toEqual({ label: 'Авито' })
  })

  it('на дашборде крошек две, последняя без ссылки', () => {
    expect(getBreadcrumbs('items')).toEqual([{ label: 'Авито' }, { label: 'Мои объявления' }])
  })

  it('во вложенном разделе «Мои объявления» становятся ссылкой', () => {
    expect(getBreadcrumbs('exchange')).toEqual([
      { label: 'Авито' },
      { label: 'Мои объявления', to: '/' },
      { label: 'Обмен' },
    ])
  })
})
