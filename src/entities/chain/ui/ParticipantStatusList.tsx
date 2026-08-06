import type { ComponentType } from 'react'
import { cx } from '@/shared/lib'
import { IconCheck, IconClock, IconClose, IconPlus } from '@/shared/ui'
import { displayName } from '../lib/participants'
import type { ChainParticipant, ParticipantStatus } from '../model/types'
import { ParticipantAvatar } from './ParticipantAvatar'

// Значок на аватаре — единственное цветное пятно в строке: зелёный «готов», серый «ждём»,
// красный «отказ». Ожидание не тревога, поэтому оно нейтральное, а не оранжевое.
const STATUS_VIEW: Record<
  ParticipantStatus,
  { badge: string; label: string; myLabel: string; Icon: ComponentType<{ size?: number }> }
> = {
  confirmed: {
    badge: 'bg-ok text-white',
    label: 'Подтверждено',
    myLabel: 'Вы подтвердили',
    Icon: IconCheck,
  },
  pending: {
    badge: 'bg-line text-ink-2',
    label: 'Ожидаем',
    myLabel: 'Ваш ход',
    Icon: IconClock,
  },
  declined: {
    badge: 'bg-stop text-white',
    label: 'Отказ',
    myLabel: 'Вы отказались',
    Icon: IconClose,
  },
}

/** Кто уже согласился, а кого ждём — прозрачность цепочки до согласия. */
export function ParticipantStatusList({ participants }: { participants: ChainParticipant[] }) {
  return (
    <div className="overflow-hidden rounded-card border border-line">
      {participants.map((p) => {
        const view = STATUS_VIEW[p.status]
        const waitsForMe = p.isMe && p.status === 'pending'
        const Icon = waitsForMe ? IconPlus : view.Icon

        return (
          <div
            key={p.userId}
            className={cx(
              'flex items-center gap-2.5 border-b border-line-2 px-3 py-2 last:border-b-0',
              p.isMe && 'bg-brand-soft',
            )}
          >
            {/* Значок статуса сидит на аватаре: одно лицо участника вместо двух кружков в строке. */}
            <span className="relative shrink-0">
              <ParticipantAvatar
                participant={p}
                className="size-9 bg-line-2 text-[14px] font-bold text-ink-2"
              />
              <span
                className={cx(
                  'absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full ring-2',
                  waitsForMe ? 'bg-brand text-on-brand' : view.badge,
                  p.isMe ? 'ring-brand-soft' : 'ring-card',
                )}
              >
                <Icon size={10} />
              </span>
            </span>

            <div className="min-w-0 flex-1">
              <b className={cx('block truncate text-[13.5px] font-bold', p.isMe && 'text-brand')}>
                {displayName(p)}
                {p.rating != null && (
                  <span className="font-normal text-ink-3"> · {p.rating.toFixed(1)} ★</span>
                )}
              </b>
              <span className="block truncate text-[12px] text-ink-2">
                отдаёт: {p.givesItem.title}
              </span>
            </div>

            <span className="shrink-0 text-[12px] font-semibold text-ink-2">
              {p.isMe ? view.myLabel : view.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
