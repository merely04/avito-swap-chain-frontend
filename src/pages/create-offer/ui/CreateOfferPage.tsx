import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddItemForm, type ItemFormValues } from '@/features/add-item'
import { DescribeWishForm } from '@/features/describe-wish'
import { Chip, IconChevronLeft } from '@/shared/ui'

/**
 * Публикация вещи в два шага: сама вещь → что хочется взамен.
 * Шаги живут на одном роуте — ввод первого шага не теряется при возврате.
 */
export function CreateOfferPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState<ItemFormValues>()
  const [step, setStep] = useState<1 | 2>(1)

  const goBack = () => {
    if (step === 2) setStep(1)
    else navigate('/')
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-card">
      <header className="flex items-center gap-2.5 border-b border-line-2 px-4 py-3.5">
        <button
          type="button"
          onClick={goBack}
          aria-label="Назад"
          className="cursor-pointer rounded-sm text-ink-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <IconChevronLeft size={19} />
        </button>
        <h1 className="flex-1 text-[16px] font-bold">
          {step === 1 ? 'Новая вещь' : 'Что хотите взамен'}
        </h1>
        <Chip>Шаг {step} из 2</Chip>
      </header>

      <main className="flex flex-1 flex-col p-4">
        {step === 2 && values ? (
          <DescribeWishForm item={values} onCreated={() => navigate('/')} />
        ) : (
          <AddItemForm
            initial={values}
            onSubmit={(next) => {
              setValues(next)
              setStep(2)
            }}
          />
        )}
      </main>
    </div>
  )
}
