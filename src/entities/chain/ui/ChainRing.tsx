import { cx } from '@/shared/lib'
import { displayName } from '../lib/participants'
import type { ChainParticipant } from '../model/types'
import { ParticipantAvatar } from './ParticipantAvatar'

const BOX = { width: 280, height: 290 }
const CENTER = { x: 140, y: 138 }
const RADIUS = 88

/** Точка на кольце по углу в градусах: 0° — справа, −90° — сверху. */
function pointAt(degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: CENTER.x + RADIUS * Math.cos(radians),
    y: CENTER.y + RADIUS * Math.sin(radians),
  }
}

/** Доля координаты в габарите — узлы стоят в процентах, поэтому кольцо тянется за контейнером. */
const percent = (value: number, of: number) => `${(value / of) * 100}%`

/**
 * Кольцо участников: каждый отдаёт вещь соседу по часовой стрелке.
 * Текущий пользователь всегда наверху — экран остаётся эгоцентричным.
 *
 * Габарит задан пропорцией, а не пикселями: на экране высотой 640 кольцо в 290 px
 * съедало почти половину, поэтому на узких окнах оно ужимается вместе с контейнером.
 */
export function ChainRing({ participants }: { participants: ChainParticipant[] }) {
  const meIndex = participants.findIndex((p) => p.isMe)
  const ordered =
    meIndex > 0 ? [...participants.slice(meIndex), ...participants.slice(0, meIndex)] : participants

  const step = 360 / ordered.length
  const angleOf = (index: number) => -90 + step * index

  return (
    <div
      className="relative mx-auto w-full max-w-[248px] sm:max-w-[280px]"
      style={{ aspectRatio: `${BOX.width} / ${BOX.height}` }}
    >
      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        {/* Пунктир — сам круг обмена, азур-стрелки между узлами — его направление. */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={RADIUS}
          fill="none"
          strokeWidth={2}
          strokeDasharray="3 8"
          className="stroke-line"
        />
        {ordered.map((p, index) => {
          const degrees = angleOf(index) + step / 2
          const { x, y } = pointAt(degrees)

          return (
            <polygon
              key={p.userId}
              points="-5,-5 6,0 -5,5"
              className="fill-brand"
              transform={`translate(${x} ${y}) rotate(${degrees + 90})`}
            />
          )
        })}
      </svg>

      {ordered.map((p, index) => {
        const { x, y } = pointAt(angleOf(index))

        return (
          <div
            key={p.userId}
            className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: percent(x, BOX.width), top: percent(y, BOX.height) }}
          >
            <ParticipantAvatar
              participant={p}
              className={cx(
                'size-13 border-2 bg-card text-[15px] font-bold',
                p.isMe
                  ? 'border-brand text-brand ring-4 ring-brand-soft'
                  : 'border-line text-ink-2',
              )}
            />
            <small
              className={cx(
                'text-center text-[11px] leading-tight font-bold',
                p.isMe ? 'text-brand' : 'text-ink-2',
              )}
            >
              {displayName(p)}
              <span className="block font-normal text-ink-3">{p.givesItem.title}</span>
            </small>
          </div>
        )
      })}
    </div>
  )
}
