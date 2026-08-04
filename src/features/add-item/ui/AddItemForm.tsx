import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import {
  CATEGORIES,
  CONDITIONS,
  CONDITION_LABEL,
  type ItemCondition,
  type ItemDraft,
} from '@/entities/item'
import { Button, Field, IconImage, Input, Select } from '@/shared/ui'

/** Первый шаг публикации: сама вещь, без желания. */
export type ItemFormValues = Omit<ItemDraft, 'wish'>

interface AddItemFormProps {
  /** Заполненные ранее значения — чтобы возврат со второго шага не терял ввод. */
  initial?: ItemFormValues
  onSubmit: (values: ItemFormValues) => void
}

export function AddItemForm({ initial, onSubmit }: AddItemFormProps) {
  const [values, setValues] = useState<ItemFormValues>(
    initial ?? { title: '', category: CATEGORIES[0], condition: 'good' },
  )

  const patch = (part: Partial<ItemFormValues>) => setValues((prev) => ({ ...prev, ...part }))

  const pickPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Ссылку на прежнее фото освобождаем, иначе замена фото копит их в памяти.
    if (values.photoUrl) URL.revokeObjectURL(values.photoUrl)
    patch({ photoUrl: URL.createObjectURL(file) })
  }

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ ...values, title: values.title.trim() })
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col gap-3.5">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-line p-5 text-center text-ink-3">
        {values.photoUrl ? (
          <img src={values.photoUrl} alt="" className="size-28 rounded-xl object-cover" />
        ) : (
          <IconImage size={28} />
        )}
        <b className="text-sm font-bold text-ink">
          {values.photoUrl ? 'Заменить фото' : 'Добавьте фото вещи'}
        </b>
        <span className="text-[12.5px]">С фото обмен находится быстрее</span>
        <input type="file" accept="image/*" className="sr-only" onChange={pickPhoto} />
      </label>

      <Field label="Название">
        <Input
          value={values.title}
          onChange={(event) => patch({ title: event.target.value })}
          placeholder="Например, горный велосипед"
          required
        />
      </Field>

      <Field label="Категория">
        <Select
          value={values.category}
          onChange={(event) => patch({ category: event.target.value })}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Состояние">
        <Select
          value={values.condition}
          onChange={(event) => patch({ condition: event.target.value as ItemCondition })}
        >
          {CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {CONDITION_LABEL[condition]}
            </option>
          ))}
        </Select>
      </Field>

      <div className="mt-auto pt-2">
        <Button type="submit" fullWidth disabled={!values.title.trim()}>
          Далее: что хотите взамен
        </Button>
      </div>
    </form>
  )
}
