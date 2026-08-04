import { useQuery } from '@tanstack/react-query'
import { getMyItems, itemKeys, WishCard } from '@/entities/item'

/** Что пользователь ищет: желания берутся из его же вещей (wish — поле вещи). */
export function WishesList() {
  const { data, isPending, isError } = useQuery({
    queryKey: itemKeys.my(),
    queryFn: getMyItems,
  })

  if (isPending) {
    return <p className="py-8 text-center text-sm text-ink-3">Загрузка…</p>
  }
  if (isError) {
    return <p className="py-8 text-center text-sm text-stop">Не удалось загрузить желания</p>
  }

  const wanted = data.filter((item) => item.wish)
  if (wanted.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-2">
        Желаний пока нет. Добавьте вещь и укажите, что хотите взамен.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {wanted.map((item) => (
        <WishCard key={item.id} item={item} />
      ))}
    </div>
  )
}
