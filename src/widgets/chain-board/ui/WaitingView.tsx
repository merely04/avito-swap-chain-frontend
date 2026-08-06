import { countConfirmed, ExchangeSummary, ParticipantStatusList } from '@/entities/chain'
import { LeaveChain } from '@/features/leave-chain'
import { Banner, IconCheck } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'
import { ChainProgress } from './ChainProgress'

/** FORMED + я CONFIRMED: ход не за мной — ждём остальных участников. */
export function WaitingView({ chain, me, neighbours }: ChainViewProps) {
  const confirmed = countConfirmed(chain)
  const total = chain.participants.length

  return (
    <>
      <Banner tone="ok" icon={<IconCheck size={20} />}>
        <b className="font-bold">Вы подтвердили участие.</b> Ждём остальных.
      </Banner>

      <ExchangeSummary give={me.givesItem} receive={neighbours.giver.givesItem} reserved />

      <ChainProgress label="Согласовано" value={confirmed} total={total} />

      <ParticipantStatusList participants={chain.participants} />

      <BoardFooter>
        <p className="text-center text-[12.5px] text-ink-2">
          Пока обмен не запущен, вы можете выйти без последствий.
        </p>
        <LeaveChain chainId={chain.id} />
      </BoardFooter>
    </>
  )
}
