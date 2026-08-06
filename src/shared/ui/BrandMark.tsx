/**
 * Лого-точки Avito + слово-логотип + подпись раздела: лок-ап «Avito Обмен».
 * Подпись тоньше и тусклее знака — сервис внутри Авито, а не отдельный бренд.
 */
export function BrandMark({ label = 'Обмен' }: { label?: string }) {
  return (
    <span className="flex items-center gap-2 text-[17px] font-bold">
      <span className="grid grid-cols-2 gap-[2px]">
        <i className="size-1.5 rounded-full bg-brand" />
        <i className="size-1.5 rounded-full bg-accent-green" />
        <i className="size-1.5 rounded-full bg-accent-violet" />
        <i className="size-1.5 rounded-full bg-accent-red" />
      </span>
      <span className="tracking-tight">
        Avito
        <span className="ml-1.5 font-normal text-ink-2">{label}</span>
      </span>
    </span>
  )
}
