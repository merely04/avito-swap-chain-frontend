import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ChainCard, chainKeys, getMyChains } from '@/entities/chain'
import { Notice } from '@/shared/ui'
import { sortByUrgency } from '../lib/sortByUrgency'

export function DealsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: chainKeys.my(),
    queryFn: getMyChains,
  })

  if (isPending) return <Notice>Загрузка…</Notice>
  if (isError) return <Notice tone="error">Не удалось загрузить обмены</Notice>
  if (data.length === 0) {
    return <Notice>Обменов пока нет. Добавьте вещь — сервис подберёт для неё цепочку.</Notice>
  }

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
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
