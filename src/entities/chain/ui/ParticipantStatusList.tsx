import { Status, type StatusTone } from '@/shared/ui'
import { displayName } from '../lib/participants'
import type { ChainParticipant, ParticipantStatus } from '../model/types'
import { ParticipantAvatar } from './ParticipantAvatar'

// Статус участника набран текстом справа, как колонка «Статус» в заказах Авито.
// Цветных значков на аватарах и подложки под своей строкой больше нет: они дублировали
// подпись и делали список пёстрым. Оранжевый остаётся единственной строке, где ход за
// пользователем, — её и надо увидеть первой.
const STATUS_VIEW: Record<
  ParticipantStatus,
  { tone: StatusTone; label: string; myTone: StatusTone; myLabel: string }
> = {
  confirmed: {
    tone: 'neutral',
    label: 'Подтверждено',
    myTone: 'neutral',
    myLabel: 'Вы подтвердили',
  },
  pending: {
    tone: 'muted',
    label: 'Ожидаем',
    myTone: 'attention',
    myLabel: 'Ваш ход',
  },
  declined: {
    tone: 'stop',
    label: 'Отказ',
    myTone: 'stop',
    myLabel: 'Вы отказались',
  },
}

/** Кто уже согласился, а кого ждём — прозрачность цепочки до согласия. */
export function ParticipantStatusList({ participants }: { participants: ChainParticipant[] }) {
  return (
    <div className="overflow-hidden rounded-card border border-line">
      {participants.map((p) => {
        const view = STATUS_VIEW[p.status]

        return (
          <div
            key={p.userId}
            className="flex items-center gap-2.5 border-b border-line-2 px-3 py-2 last:border-b-0"
          >
            <ParticipantAvatar
              participant={p}
              className="size-9 bg-line-2 text-[14px] font-bold text-ink-2"
            />

            <div className="min-w-0 flex-1">
              <b className="block truncate text-[13.5px] font-bold">
                {displayName(p)}
                {p.rating != null && (
                  <span className="font-normal text-ink-3"> · {p.rating.toFixed(1)} ★</span>
                )}
              </b>
              <span className="block truncate text-[12px] text-ink-2">
                отдаёт: {p.givesItem.title}
              </span>
            </div>

            <Status tone={p.isMe ? view.myTone : view.tone} className="shrink-0">
              {p.isMe ? view.myLabel : view.label}
            </Status>
          </div>
        )
      })}
    </div>
  )
}
