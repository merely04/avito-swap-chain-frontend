/** Раздел личного кабинета — общий источник и для подсветки меню, и для крошек. */
export type Section = 'items' | 'wishes' | 'exchange' | 'new-item'

export interface Crumb {
  label: string
  /** Без `to` — текущая страница либо корень «Авито»: главной Авито в демо нет. */
  to?: string
}

/**
 * Раздел по текущему роуту. Обмены живут в двух местах — вкладка дашборда
 * (`/?tab=exchanges`) и сама цепочка (`/exchange/:id`), — но для меню это один раздел.
 */
export function getSection(pathname: string, tab: string | null): Section {
  if (pathname.startsWith('/exchange')) return 'exchange'
  if (pathname.startsWith('/items/new')) return 'new-item'
  if (tab === 'exchanges') return 'exchange'
  if (tab === 'wishes') return 'wishes'
  return 'items'
}

const SECTION_LABEL: Record<Section, string | null> = {
  items: null,
  wishes: 'Желания',
  exchange: 'Обмен',
  'new-item': 'Новое объявление',
}

/** Крошки «Авито → Мои объявления → …»: обмен — раздел кабинета, а не отдельный сервис. */
export function getBreadcrumbs(section: Section): Crumb[] {
  const label = SECTION_LABEL[section]

  return label === null
    ? [{ label: 'Авито' }, { label: 'Мои объявления' }]
    : [{ label: 'Авито' }, { label: 'Мои объявления', to: '/' }, { label }]
}
