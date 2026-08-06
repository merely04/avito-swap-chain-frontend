import { Outlet, useLocation } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { CabinetNav } from './CabinetNav'
import { ShellHeader } from './ShellHeader'
import { getSection } from '../lib/navigation'

/**
 * Оболочка «мы внутри Авито»: обмен подаётся не отдельным продуктом, а разделом
 * личного кабинета. Layout-роут — чистая обвязка вокруг `<Outlet />`, бизнес-слои
 * о ней не знают, поэтому раздел встраивается и как отдельное SPA.
 *
 * Раскладка: на узких окнах всё идёт одной колонкой поверх белого листа,
 * от `lg` меню кабинета уходит в левую колонку, а фоном становится серая страница.
 */
export function AvitoShell() {
  const { pathname } = useLocation()
  const section = getSection(pathname)

  return (
    <div className="flex min-h-svh flex-col bg-card lg:bg-page">
      <ShellHeader />

      <div className="mx-auto flex w-full max-w-page flex-1 flex-col lg:flex-row lg:gap-6 lg:px-6 lg:py-6">
        <CabinetNav section={section} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Breadcrumbs pathname={pathname} />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
