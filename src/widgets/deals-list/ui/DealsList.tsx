import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ChainCard, chainKeys, getMyChains } from '@/entities/chain'
import { sortByUrgency } from '../lib/sortByUrgency'

export function DealsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: chainKeys.my(),
    queryFn: getMyChains,
  })

  if (isPending) {
    return <p className="py-8 text-center text-sm text-ink-3">Загрузка…</p>
  }
  if (isError) {
    return <p className="py-8 text-center text-sm text-stop">Не удалось загрузить обмены</p>
  }
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-2">
        Обменов пока нет. Добавьте вещь — сервис подберёт для неё цепочку.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {sortByUrgency(data).map((chain) => (
        <Link
          key={chain.id}
          to={`/exchange/${chain.id}`}
          className="rounded-card outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <ChainCard chain={chain} />
        </Link>
      ))}
    </div>
  )
}
