import { useNavigate } from 'react-router-dom'
import { ExchangeSummary } from '@/entities/chain'
import { Banner, Button, IconCheck } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'

/** COMPLETED: все передали и подтвердили получение — цепочка закрыта. */
export function CompletedView({ me, neighbours }: ChainViewProps) {
  const navigate = useNavigate()

  return (
    <>
      <Banner tone="ok" icon={<IconCheck size={20} />}>
        <b className="font-bold">Обмен завершён.</b> Все вещи нашли новых владельцев.
      </Banner>

      <ExchangeSummary me={me} neighbours={neighbours} past />

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Цепочка закрыта. Вещь «{neighbours.giver.givesItem.title}» теперь ваша — она появится в
        списке ваших вещей.
      </p>

      <BoardFooter>
        <Button fullWidth onClick={() => navigate('/')}>
          К моим вещам
        </Button>
      </BoardFooter>
    </>
  )
}
