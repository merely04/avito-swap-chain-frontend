import { cx } from '@/shared/lib'
import { IconArrowRight } from '@/shared/ui'
import { displayName, isNeighbour, type Neighbours } from '../lib/participants'
import type { ChainParticipant } from '../model/types'
import { ParticipantAvatar } from './ParticipantAvatar'

/** Громкость участника: себя видно первым, соседей — в полный голос, остальных — тише. */
type Voice = 'me' | 'neighbour' | 'rest'

const avatarTone: Record<Voice, string> = {
  me: 'border-brand text-brand ring-4 ring-brand-soft',
  neighbour: 'border-line text-ink-2',
  rest: 'border-line-2 text-ink-3',
}

const nameTone: Record<Voice, string> = {
  me: 'text-brand',
  neighbour: 'text-ink',
  rest: 'text-ink-3',
}

const itemTone: Record<Voice, string> = {
  me: 'text-ink-3',
  neighbour: 'text-ink-2',
  rest: 'text-ink-3',
}

/** Обход цикла с текущего пользователя: экран эгоцентричный (гипотеза H1). */
function fromMe(participants: ChainParticipant[]): ChainParticipant[] {
  const index = participants.findIndex((p) => p.isMe)
  return index > 0 ? [...participants.slice(index), ...participants.slice(0, index)] : participants
}

interface ChainRibbonProps {
  participants: ChainParticipant[]
  /** Кому отдаём вещь и от кого получаем — соседи звучат громче остальных. */
  neighbours: Neighbours
}

/**
 * Лента участников: слева направо, стрелки — направление передачи вещи, пунктир снизу —
 * возврат к первому узлу. Кольцо для трёх узлов было избыточной фигурой: занимало половину
 * экрана и на узком окне читалось хуже строки.
 *
 * Узлы стоят в равных колонках, поэтому центр колонки считается в процентах: на границах
 * колонок стоят стрелки, под центрами крайних — концы линии возврата. Разметка не зависит
 * от числа участников: цепочка из трёх (рабочий случай) и из четырёх верстаются одинаково.
 */
export function ChainRibbon({ participants, neighbours }: ChainRibbonProps) {
  const ordered = fromMe(participants)
  const total = ordered.length
  const half = 50 / total

  const voiceOf = (p: ChainParticipant): Voice =>
    p.isMe ? 'me' : isNeighbour(p, neighbours) ? 'neighbour' : 'rest'

  return (
    <div className="relative">
      <ol
        className="grid gap-x-1"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {ordered.map((p) => {
          const voice = voiceOf(p)

          return (
            <li key={p.userId} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <ParticipantAvatar
                participant={p}
                className={cx('size-12 border-2 bg-card text-[15px] font-bold', avatarTone[voice])}
              />
              {/* Ширину подписи задаёт колонка, иначе длинное название вещи вылезает к соседу. */}
              <small className={cx('w-full text-[11px] leading-tight font-bold', nameTone[voice])}>
                {displayName(p)}
                <span
                  className={cx(
                    'font-normal break-words',
                    itemTone[voice],
                    voice === 'rest' ? 'line-clamp-1' : 'line-clamp-2',
                  )}
                >
                  {p.givesItem.title}
                </span>
              </small>
            </li>
          )
        })}
      </ol>

      {/* Стрелки между узлами — кто кому отдаёт вещь. Стоят по центру ряда аватаров. */}
      {ordered.slice(1).map((p, index) => (
        <span
          key={p.userId}
          className="absolute top-6 -translate-x-1/2 -translate-y-1/2 text-brand"
          style={{ left: `${((index + 1) * 100) / total}%` }}
        >
          <IconArrowRight size={15} />
        </span>
      ))}

      {/* Возврат к первому узлу: без него лента читается как отрезок, а не как круг без денег. */}
      <div
        className="relative mt-3 mb-2 h-4 rounded-b-lg border-x border-b border-dashed border-line"
        style={{ marginLeft: `${half}%`, marginRight: `${half}%` }}
      >
        <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-brand">
          <IconArrowRight size={15} />
        </span>
        <small className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-card px-1.5 text-[11px] whitespace-nowrap text-ink-3">
          круг замыкается
        </small>
      </div>
    </div>
  )
}
