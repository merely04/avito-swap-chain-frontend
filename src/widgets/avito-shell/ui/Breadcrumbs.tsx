import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { getBreadcrumbs, type Section } from '../lib/navigation'

/** Крошки считаются из роута — страницы о своём месте в навигации Авито не знают. */
export function Breadcrumbs({ section }: { section: Section }) {
  const crumbs = getBreadcrumbs(section)

  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex items-center gap-1.5 px-4 pt-2.5 text-[12px] text-ink-3"
    >
      {crumbs.map((crumb, i) => (
        <Fragment key={crumb.label}>
          {i > 0 && <span aria-hidden="true">›</span>}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="rounded-sm outline-offset-2 hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-brand"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={i === crumbs.length - 1 ? 'text-ink-2' : undefined}>
              {crumb.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
