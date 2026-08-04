import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { chainKeys, getMyChains, needsMyAction } from '@/entities/chain'
import { Banner, IconPlus } from '@/shared/ui'

/**
 * Зовёт в цепочку, которая ждёт решения пользователя. Если таких нет — не показывается,
 * чтобы дашборд не звал в обмен, по которому ход уже сделан.
 */
export function PendingDealBanner() {
  const { data } = useQuery({ queryKey: chainKeys.my(), queryFn: getMyChains })

  const pending = data?.find(needsMyAction)
  if (!pending) return null

  return (
    <Link
      to={`/exchange/${pending.id}`}
      className="rounded-2xl outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand"
    >
      <Banner tone="info" icon={<IconPlus size={20} />}>
        <b className="font-bold">Новое предложение обмена</b> — цепочка из{' '}
        {pending.participants.length} участников
      </Banner>
    </Link>
  )
}
