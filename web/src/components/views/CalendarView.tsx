import { useMemo, useState } from 'react'
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { Tarefa } from '../../lib/api'
import { useData } from '../../lib/data'
import { cn } from '../../lib/utils'
import { STATUS_META, isOverdue, toDate } from '../../lib/ui'
import { Button } from '../ui/button'

export default function CalendarView({ tarefas, projetoId }: { tarefas: Tarefa[]; projetoId?: number }) {
  const { openTask, newTask } = useData()
  const [month, setMonth] = useState(() => new Date())

  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  }), [month])

  const byDay = (d: Date) => tarefas.filter((t) => {
    const td = toDate(t.data_entrega)
    return td && isSameDay(td, d)
  })

  const semData = tarefas.filter((t) => !t.data_entrega).length

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold capitalize">{format(month, 'MMMM yyyy', { locale: ptBR })}</h3>
        {semData > 0 && <span className="text-xs text-muted-foreground">· {semData} sem data</span>}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => subMonths(m, 1))}><ChevronLeft /></Button>
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>Hoje</Button>
          <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}><ChevronRight /></Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const items = byDay(d)
            const inMonth = isSameMonth(d, month)
            return (
              <div key={i}
                className={cn('group relative min-h-[104px] border-b border-r p-1.5 [&:nth-child(7n)]:border-r-0', !inMonth && 'bg-muted/40')}>
                <div className="mb-1 flex items-center justify-between">
                  <button onClick={() => newTask({ projeto_id: projetoId, data_entrega: format(d, 'yyyy-MM-dd') })}
                    className="rounded p-0.5 text-muted-foreground opacity-0 transition hover:bg-accent group-hover:opacity-100">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <span className={cn('flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs',
                    isToday(d) ? 'bg-[#e03e3e] font-semibold text-white' : inMonth ? 'text-foreground' : 'text-muted-foreground/60')}>
                    {d.getDate() === 1 ? format(d, 'd MMM', { locale: ptBR }).replace('.', '') : d.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {items.slice(0, 3).map((t) => (
                    <button key={t.id} onClick={() => openTask(t.id)}
                      className={cn('flex w-full items-center gap-1.5 truncate rounded-[5px] border bg-card px-1.5 py-1 text-left text-xs font-medium shadow-sm transition hover:shadow-card-hover',
                        t.status === 'Concluído' && 'text-muted-foreground line-through',
                        isOverdue(t) && 'border-[#e03e3e]/40')}>
                      <span className="h-3 w-[3px] shrink-0 rounded-full" style={{ background: t.projeto_cor ?? STATUS_META[t.status].hex }} />
                      <span className="truncate">{t.titulo}</span>
                    </button>
                  ))}
                  {items.length > 3 && <div className="px-1 text-[11px] font-medium text-muted-foreground">+{items.length - 3} mais</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
