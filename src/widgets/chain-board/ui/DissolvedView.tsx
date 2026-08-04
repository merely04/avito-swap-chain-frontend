import { useNavigate } from 'react-router-dom'
import { findDecliner } from '../../../entities/chain'
import { Banner, Button, IconCheck, IconClose } from '../../../shared/ui'
import type { ChainViewProps } from '../model/types'

/** DISSOLVED: кто-то отказался — обмен не стартовал, вещи разблокированы. */
export function DissolvedView({ chain, me }: ChainViewProps) {
  const navigate = useNavigate()
  const decliner = findDecliner(chain)

  const reason = decliner?.isMe
    ? 'Вы отклонили обмен.'
    : decliner
      ? `Участник ${decliner.name} отклонил обмен.`
      : 'Один из участников отказался.'

  return (
    <>
      <Banner tone="stop" icon={<IconClose size={20} />}>
        <b className="font-bold">Цепочка распалась.</b> {reason}
      </Banner>

      <Banner tone="ok" icon={<IconCheck size={20} />}>
        Вещь «{me.givesItem.title}» снова свободна и участвует в подборе.
      </Banner>

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Никто не остался без вещи: обмен не стартовал, потому что подтвердили не все. Ищем для вас
        новую цепочку.
      </p>

      <div className="mt-auto pt-2">
        <Button fullWidth onClick={() => navigate('/')}>
          Искать новую цепочку
        </Button>
      </div>
    </>
  )
}
