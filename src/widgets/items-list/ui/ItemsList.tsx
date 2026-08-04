import { useQuery } from '@tanstack/react-query'
import { getMyItems, ItemCard } from '@/entities/item'

export function ItemsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['my-items'],
    queryFn: getMyItems,
  })

  if (isPending) {
    return <p className="py-8 text-center text-sm text-ink-3">Загрузка…</p>
  }
  if (isError) {
    return <p className="py-8 text-center text-sm text-stop">Не удалось загрузить вещи</p>
  }
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-2">Пока нет вещей — добавьте первую.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
