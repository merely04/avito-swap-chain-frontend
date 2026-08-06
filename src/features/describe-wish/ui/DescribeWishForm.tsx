import { useRef, useState, type SubmitEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CATEGORIES, itemKeys, type Wish } from '@/entities/item'
import { Button, IconClose, IconPlus, Input, Select } from '@/shared/ui'

/** Строка формы: вариант желания + стабильный ключ, чтобы удаление не путало поля React. */
interface WishRow extends Wish {
  key: number
}

/** Больше пяти вариантов человек уже не держит в голове, а форма превращается в простыню. */
const MAX_VARIANTS = 5

const emptyRow = (key: number): WishRow => ({ key, category: CATEGORIES[0], description: '' })

/** Первый вариант обязателен, поэтому он и есть само желание; остальные — добавка к нему. */
const rowLabel = (index: number) => (index === 0 ? 'Что хотите взамен' : `Вариант ${index + 1}`)

interface DescribeWishFormProps {
  /** Что человек отдаёт — показываем, чтобы желание указывали осознанно. */
  give: string
  submitLabel: string
  pendingLabel: string
  /**
   * Как сохранить желание. Форма одна на оба входа в сервис — публикацию новой вещи
   * и включение обмена у уже размещённого объявления; отличается только сохранение.
   */
  onSubmit: (wish: Wish[]) => Promise<unknown>
  onDone: () => void
}

/**
 * Желание: что пользователь хочет получить взамен. Вариантов может быть несколько, и это
 * не украшение — каждый вариант отдельное ребро графа и отдельный шанс замкнуть цикл.
 * Широту даём количеством конкретных вариантов, а не размытой формулировкой в одном поле.
 */
export function DescribeWishForm({
  give,
  submitLabel,
  pendingLabel,
  onSubmit,
  onDone,
}: DescribeWishFormProps) {
  const [rows, setRows] = useState<WishRow[]>([emptyRow(0)])
  const nextKey = useRef(1)
  const queryClient = useQueryClient()

  // Пустые строки не сохраняем: добавить вариант и передумать — нормальный ход.
  const filled = rows
    .map(({ category, description }) => ({ category, description: description.trim() }))
    .filter((wish) => wish.description !== '')

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => onSubmit(filled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.my() })
      onDone()
    },
  })

  const patch = (key: number, part: Partial<Wish>) =>
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...part } : row)))

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate()
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col gap-3.5">
      <p className="text-[13.5px] text-ink-2">
        Отдаёте: <b className="font-bold text-ink">{give}</b>
      </p>

      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div key={row.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-sans text-xs font-semibold text-ink-2">{rowLabel(index)}</span>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => setRows((prev) => prev.filter((item) => item.key !== row.key))}
                  aria-label={`Убрать вариант ${index + 1}`}
                  className="cursor-pointer rounded-sm p-0.5 text-ink-3 outline-offset-2 hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <IconClose size={15} />
                </button>
              )}
            </div>

            {/* Категория и описание в одну строку, как в поиске Авито: «где искать» + «что». */}
            <div className="grid grid-cols-[38%_1fr] gap-2">
              <Select
                value={row.category}
                onChange={(event) => patch(row.key, { category: event.target.value })}
                aria-label={`Категория варианта ${index + 1}`}
                className="px-2.5 text-[13px]"
              >
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>

              <Input
                value={row.description}
                onChange={(event) => patch(row.key, { description: event.target.value })}
                aria-label={rowLabel(index)}
                placeholder={index === 0 ? 'Например, игровая приставка' : 'Ещё вариант'}
              />
            </div>
          </div>
        ))}
      </div>

      {rows.length < MAX_VARIANTS && (
        <Button
          variant="ghost"
          onClick={() => setRows((prev) => [...prev, emptyRow(nextKey.current++)])}
          className="self-start px-3 py-2 text-[13.5px]"
        >
          <IconPlus size={15} />
          Добавить вариант
        </Button>
      )}

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Каждый вариант ищется отдельно, подойдёт любой из них. Несколько конкретных вариантов дают
        больше шансов, чем одна размытая формулировка. Вещь уйдёт в подбор сразу — когда цепочка
        найдётся, вы получите предложение.
      </p>

      {isError && (
        <p role="alert" className="text-[12.5px] font-semibold text-stop">
          Не удалось сохранить желание. Проверьте, что указали хотя бы один вариант.
        </p>
      )}

      <div className="mt-auto pt-2">
        <Button type="submit" fullWidth disabled={isPending || filled.length === 0}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
