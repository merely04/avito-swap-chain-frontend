import { useNavigate } from 'react-router-dom'
import { ParticipantStatusList } from '@/entities/chain'
import { Banner, Button, IconCheck, IconClose } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'

/** FORMED + я DECLINED: я вышел, но цепочка ещё жива — участники ищут замену. */
export function DeclinedView({ chain, me }: ChainViewProps) {
  const navigate = useNavigate()

  return (
    <>
      <Banner tone="stop" icon={<IconClose size={20} />}>
        <b className="font-bold">Вы вышли из этого обмена.</b> Участвовать в нём вы больше не
        можете.
      </Banner>

      <Banner tone="ok" icon={<IconCheck size={20} />}>
        Вещь «{me.givesItem.title}» снова свободна и участвует в подборе.
      </Banner>

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Сервис ищет вам замену: если найдётся человек с подходящей вещью, обмен состоится без вас.
        Если нет — цепочка распадётся, вещи разблокируются, никто ничего не потеряет.
      </p>

      <ParticipantStatusList participants={chain.participants} />

      <BoardFooter>
        <Button fullWidth onClick={() => navigate('/')}>
          Искать новую цепочку
        </Button>
      </BoardFooter>
    </>
  )
}
