import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { chainKeys, DealStatusChip, getChain } from '../../../entities/chain'
import { IconChevronLeft } from '../../../shared/ui'
import { ChainBoard } from '../../../widgets/chain-board'

/**
 * Один роут на всю сделку: предложение, ожидание, передача, завершение и распад —
 * это разные состояния одной цепочки, а не разные экраны.
 */
export function ExchangePage() {
  const { id = '' } = useParams()

  const {
    data: chain,
    isPending,
    isError,
  } = useQuery({
    queryKey: chainKeys.detail(id),
    queryFn: () => getChain(id),
    // Вебсокетов в MVP нет: пока идёт согласование — подтягиваем ответы остальных.
    refetchInterval: (query) => (query.state.data?.status === 'formed' ? 2000 : false),
  })

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-card">
      <header className="flex items-center gap-2.5 border-b border-line-2 px-4 py-3.5">
        <Link
          to="/"
          aria-label="Назад"
          className="rounded-sm text-ink-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <IconChevronLeft size={19} />
        </Link>
        <h1 className="flex-1 text-[16px] font-bold">Цепочка обмена</h1>
        {chain && <DealStatusChip chain={chain} />}
      </header>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        {isPending && <p className="py-10 text-center text-sm text-ink-3">Загрузка…</p>}
        {isError && (
          <p className="py-10 text-center text-sm text-stop">Не удалось загрузить цепочку</p>
        )}
        {chain && <ChainBoard chain={chain} />}
      </div>
    </div>
  )
}
