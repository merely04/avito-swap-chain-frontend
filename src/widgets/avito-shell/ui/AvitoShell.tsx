import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { CabinetNav } from './CabinetNav'
import { ShellHeader } from './ShellHeader'
import { getSection } from '../lib/navigation'

/**
 * Оболочка «мы внутри Авито»: обмен подаётся не отдельным продуктом, а разделом
 * личного кабинета. Layout-роут — чистая обвязка вокруг `<Outlet />`, бизнес-слои
 * о ней не знают, поэтому раздел встраивается и как отдельное SPA.
 */
export function AvitoShell() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const section = getSection(pathname, params.get('tab'))

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-card">
      <ShellHeader />
      <CabinetNav section={section} />
      <Breadcrumbs section={section} />
      <Outlet />
    </div>
  )
}
