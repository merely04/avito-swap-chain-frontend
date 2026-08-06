import { useQuery } from '@tanstack/react-query'
import { getMyItems, itemKeys, WishCard } from '@/entities/item'
import { Notice } from '@/shared/ui'

/** Что пользователь ищет: желания берутся из его же вещей (wish — поле вещи). */
export function WishesList() {
  const { data, isPending, isError } = useQuery({
    queryKey: itemKeys.my(),
    queryFn: getMyItems,
  })

  if (isPending) return <Notice>Загрузка…</Notice>
  if (isError) return <Notice tone="error">Не удалось загрузить желания</Notice>

  const wanted = data.filter((item) => item.wish.length > 0)
  if (wanted.length === 0) {
    return <Notice>Желаний пока нет. Добавьте вещь и укажите, что хотите взамен.</Notice>
  }

  return (
    <div className="flex flex-col gap-3">
      {wanted.map((item) => (
        <WishCard key={item.id} item={item} />
      ))}
    </div>
  )
}
