import { useState, type SubmitEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES, createItem, itemKeys, type Item, type ItemDraft } from '@/entities/item'
import { Button, Field, Select } from '@/shared/ui'

interface DescribeWishFormProps {
  /** Вещь с первого шага — публикуется вместе с желанием. */
  item: Omit<ItemDraft, 'wish'>
  onCreated: (created: Item) => void
}

/** Второй шаг публикации: что пользователь хочет получить взамен. */
export function DescribeWishForm({ item, onCreated }: DescribeWishFormProps) {
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => createItem({ ...item, wish: { category, description: description.trim() } }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.my() })
      onCreated(created)
    },
  })

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate()
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col gap-3.5">
      <p className="text-[13.5px] text-ink-2">
        Отдаёте: <b className="font-bold text-ink">{item.title}</b>
      </p>

      <Field label="Категория желаемого">
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Что хотите взамен">
        <textarea
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Например: игровая приставка или смартфон не старше трёх лет"
          className="w-full resize-none rounded-input border border-line bg-card px-[13px] py-3 font-sans text-[14.5px] font-semibold text-ink placeholder:font-normal placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-brand"
        />
      </Field>

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Чем шире описание, тем больше шансов попасть в цепочку. Вещь уйдёт в подбор сразу — когда
        цепочка найдётся, вы получите предложение.
      </p>

      <div className="mt-auto pt-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? 'Публикуем…' : 'Опубликовать и искать обмен'}
        </Button>
      </div>
    </form>
  )
}
