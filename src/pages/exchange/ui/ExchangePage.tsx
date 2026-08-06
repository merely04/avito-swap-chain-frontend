import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { chainKeys, DealStatusChip, getChain } from '@/entities/chain'
import { Notice, Screen, ScreenHeader } from '@/shared/ui'
import { ChainBoard } from '@/widgets/chain-board'

/**
 * Один роут на всю сделку: предложение, ожидание, передача, завершение и распад —
 * это разные состояния одной цепочки, а не разные экраны.
 */
export function ExchangePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const {
    data: chain,
    isPending,
    isError,
  } = useQuery({
    queryKey: chainKeys.detail(id),
    queryFn: () => getChain(id),
    // Вебсокетов в MVP нет: пока цепочка в движении — подтягиваем ответы на предложение
    // и отметки о получении, которые делают остальные участники.
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'formed' || status === 'active' ? 2000 : false
    },
  })

  return (
    <Screen>
      <ScreenHeader title="Цепочка обмена" onBack={() => navigate('/')}>
        {chain && <DealStatusChip chain={chain} />}
      </ScreenHeader>

      <main className="flex flex-1 flex-col p-4">
        {isPending && <Notice>Загрузка…</Notice>}
        {isError && <Notice tone="error">Не удалось загрузить цепочку</Notice>}
        {chain && <ChainBoard chain={chain} />}
      </main>
    </Screen>
  )
}
