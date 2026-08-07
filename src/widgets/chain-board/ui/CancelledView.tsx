import { useNavigate } from 'react-router-dom'
import { cancelReason, ExchangeSummary } from '@/entities/chain'
import { Banner, Button, IconCheck, IconClose } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'

/**
 * CANCELLED: вещь из этого варианта успела уйти в другую цепочку — собрать его уже нельзя.
 * Отдельный вид, а не распад: никто не отказывался, просто обмен состоялся в другом месте.
 */
export function CancelledView({ chain, me, neighbours }: ChainViewProps) {
  const navigate = useNavigate()

  return (
    <>
      {/* Не красный: человек ничего не потерял и ничего не сделал не так — обмен просто
          состоялся в другом месте. Красный здесь читался бы как сбой сервиса. */}
      <Banner tone="info" icon={<IconClose size={20} />}>
        <b className="font-bold">Вариант отменился.</b> {cancelReason(chain)}.
      </Banner>

      <ExchangeSummary me={me} neighbours={neighbours} />

      <Banner tone="ok" icon={<IconCheck size={20} />}>
        Вещь «{me.givesItem.title}» никуда не делась — она участвует в подборе дальше.
      </Banner>

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Одна и та же вещь участвует сразу в нескольких вариантах, и блокируется она, только когда
        вариант понравился всем. Один из них собрался первым — значит остальные с этой вещью
        отменяются. Это не сбой: так вещь не простаивает в ожидании ответов.
      </p>

      <BoardFooter>
        <Button fullWidth onClick={() => navigate('/exchange')}>
          К другим предложениям
        </Button>
      </BoardFooter>
    </>
  )
}
