import { countConfirmed, ExchangeSummary, ParticipantStatusList } from '@/entities/chain'
import { LeaveChain } from '@/features/leave-chain'
import { Banner, IconCheck } from '@/shared/ui'
import type { ChainViewProps } from '../model/types'
import { BoardFooter } from './BoardFooter'
import { ChainProgress } from './ChainProgress'

/** FORMED + я CONFIRMED: вариант мне подошёл — ждём ответа остальных участников. */
export function WaitingView({ chain, me, neighbours }: ChainViewProps) {
  const confirmed = countConfirmed(chain)
  const total = chain.participants.length

  return (
    <>
      <Banner tone="ok" icon={<IconCheck size={20} />}>
        <b className="font-bold">Вариант вам подходит.</b> Ждём ответа остальных.
      </Banner>

      <ExchangeSummary me={me} neighbours={neighbours} />

      <ChainProgress label="Вариант подошёл" value={confirmed} total={total} />

      <ParticipantStatusList participants={chain.participants} neighbours={neighbours} />

      <p className="text-[12.5px] leading-relaxed text-ink-3">
        Вещь пока не заблокирована: она участвует и в других подобранных вариантах. Заблокируется
        она в тот момент, когда этот вариант понравится всем, — тогда остальные варианты с ней
        отменятся.
      </p>

      <BoardFooter>
        <p className="text-center text-[12.5px] text-ink-2">
          Пока обмен не запущен, вы можете выйти без последствий.
        </p>
        <LeaveChain chainId={chain.id} />
      </BoardFooter>
    </>
  )
}
