import { CalendarClock, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import {
  PRIORIDADE_META, STATUS_META, daysUntil, formatShort, isOverdue, tagColor,
} from '../lib/ui'
import type { PillColor, Prioridade, Status } from '../lib/ui'
import type { Tarefa } from '../lib/api'

export function Pill({ color, children, className, dot }: {
  color: PillColor
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span className={cn('pill', `pill-${color}`, className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', `dot-${color}`)} />}
      {children}
    </span>
  )
}

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return <Pill color={STATUS_META[status].color} dot className={className}>{status}</Pill>
}

export function PriorityPill({ prioridade, className }: { prioridade: Prioridade; className?: string }) {
  return <Pill color={PRIORIDADE_META[prioridade].color} className={className}>{prioridade}</Pill>
}

export function TagPill({ tag, className }: { tag: string; className?: string }) {
  return <Pill color={tagColor(tag)} className={className}>{tag}</Pill>
}

/** Faixa de etiqueta no estilo Trello (barrinha colorida). */
export function LabelBar({ color, title }: { color: PillColor; title: string }) {
  return <span title={title} className={cn('h-2 w-10 rounded-full', `dot-${color}`)} />
}

export function DueChip({ tarefa, className, compact }: {
  tarefa: Pick<Tarefa, 'data_entrega' | 'status'>
  className?: string
  compact?: boolean
}) {
  if (!tarefa.data_entrega) return null
  const done = tarefa.status === 'Concluído'
  const overdue = isOverdue(tarefa)
  const n = daysUntil(tarefa.data_entrega)
  const soon = !done && !overdue && n !== null && n <= 1
  const Icon = done ? CheckCircle2 : overdue ? AlertCircle : CalendarClock
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium leading-4',
        done && 'bg-[#3c8a5a] text-white',
        overdue && 'bg-[#e03e3e] text-white',
        soon && 'bg-[#fdecc8] text-[#6b4b0f] dark:bg-[#89632a] dark:text-[#fdf0d6]',
        !done && !overdue && !soon && 'text-muted-foreground',
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {compact ? formatShort(tarefa.data_entrega) : formatShort(tarefa.data_entrega)}
    </span>
  )
}
