/** Лого-точки Avito + подпись — общий бренд-знак в шапках экранов. */
export function BrandMark({ label = 'Обмен' }: { label?: string }) {
  return (
    <span className="flex items-center gap-2 text-[17px] font-bold">
      <span className="grid grid-cols-2 gap-[2px]">
        <i className="size-1.5 rounded-full bg-brand" />
        <i className="size-1.5 rounded-full bg-accent-green" />
        <i className="size-1.5 rounded-full bg-accent-violet" />
        <i className="size-1.5 rounded-full bg-accent-red" />
      </span>
      {label}
    </span>
  )
}
