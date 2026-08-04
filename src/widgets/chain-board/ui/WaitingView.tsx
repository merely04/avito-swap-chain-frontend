import { countConfirmed, ExchangeSummary, ParticipantStatusList } from '../../../entities/chain'
import { LeaveChain } from '../../../features/leave-chain'
import { Banner, IconCheck } from '../../../shared/ui'
import type { ChainViewProps } from '../model/types'

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

      <div>
        <div className="mb-1.5 flex justify-between text-[12.5px] font-semibold text-ink-2">
          <span>Согласовано</span>
          <span className="text-ink">
            {confirmed} из {total}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-line-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={confirmed}
          aria-label="Согласование участников"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${(confirmed / total) * 100}%` }}
          />
        </div>
      </div>

      <ParticipantStatusList participants={chain.participants} />

      <div className="mt-auto flex flex-col gap-2.5 pt-2">
        <p className="text-center text-[12.5px] text-ink-2">
          Пока обмен не запущен, вы можете выйти без последствий.
        </p>
        <LeaveChain chainId={chain.id} />
      </div>
    </>
  )
}
