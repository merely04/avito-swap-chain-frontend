import { useQuery } from '@tanstack/react-query'
import { getMyItems, ItemCard, itemKeys } from '@/entities/item'
import { Notice } from '@/shared/ui'

export function ItemsList() {
  const { data, isPending, isError } = useQuery({
    queryKey: itemKeys.my(),
    queryFn: getMyItems,
  })

  if (isPending) return <Notice>Загрузка…</Notice>
  if (isError) return <Notice tone="error">Не удалось загрузить вещи</Notice>
  if (data.length === 0) return <Notice>Пока нет вещей — добавьте первую.</Notice>

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
