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
  const [selected, setSelected] = useState(() => new Date())

  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
  }), [month])

  const byDay = (d: Date) => tarefas.filter((t) => {
    const td = toDate(t.data_entrega)
    return td && isSameDay(td, d)
  })

  const semData = tarefas.filter((t) => !t.data_entrega).length
  const selectedItems = byDay(selected)

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold capitalize">{format(month, 'MMMM yyyy', { locale: ptBR })}</h3>
        {semData > 0 && <span className="text-xs text-muted-foreground">· {semData} sem data</span>}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={() => setMonth((m) => subMonths(m, 1))}><ChevronLeft /></Button>
          <Button variant="outline" size="sm" className="h-10 md:h-8" onClick={() => setMonth(new Date())}>Hoje</Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8" onClick={() => setMonth((m) => addMonths(m, 1))}><ChevronRight /></Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="px-0.5 py-1.5 text-center text-[10px] font-medium text-muted-foreground md:px-2 md:py-2 md:text-right md:text-xs">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const items = byDay(d)
            const inMonth = isSameMonth(d, month)
            const isSelected = isSameDay(d, selected)
            return (
              <div key={i}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(d)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(d) } }}
                className={cn(
                  'group relative border-b border-r p-1 [&:nth-child(7n)]:border-r-0 md:min-h-[104px] md:p-1.5',
                  'min-h-11',
                  !inMonth && 'bg-muted/40',
                  isSelected && 'bg-primary/10 md:bg-transparent',
                )}>
                <div className="mb-1 flex items-center justify-between">
                  <button onClick={(e) => { e.stopPropagation(); newTask({ projeto_id: projetoId, data_entrega: format(d, 'yyyy-MM-dd') }) }}
                    className="hidden rounded p-0.5 text-muted-foreground opacity-0 transition hover:bg-accent group-hover:opacity-100 md:block">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <span className={cn('ml-auto flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-xs md:h-6 md:min-w-6',
                    isToday(d) ? 'bg-[#e03e3e] font-semibold text-white' : inMonth ? 'text-foreground' : 'text-muted-foreground/60')}>
                    <span className="md:hidden">{d.getDate()}</span>
                    <span className="hidden md:inline">{d.getDate() === 1 ? format(d, 'd MMM', { locale: ptBR }).replace('.', '') : d.getDate()}</span>
                  </span>
                </div>
                <div className="hidden space-y-1 md:block">
                  {items.slice(0, 3).map((t) => (
                    <button key={t.id} onClick={(e) => { e.stopPropagation(); openTask(t.id) }}
                      className={cn('flex w-full items-center gap-1.5 truncate rounded-[5px] border bg-card px-1.5 py-1 text-left text-xs font-medium shadow-sm transition hover:shadow-card-hover',
                        t.status === 'Concluído' && 'text-muted-foreground line-through',
                        isOverdue(t) && 'border-[#e03e3e]/40')}>
                      <span className="h-3 w-[3px] shrink-0 rounded-full" style={{ background: t.projeto_cor ?? STATUS_META[t.status].hex }} />
                      <span className="truncate">{t.titulo}</span>
                    </button>
                  ))}
                  {items.length > 3 && <div className="px-1 text-[11px] font-medium text-muted-foreground">+{items.length - 3} mais</div>}
                </div>
                {items.length > 0 && (
                  <div className="mt-0.5 flex justify-center gap-0.5 md:hidden">
                    {items.slice(0, 3).map((t) => (
                      <span key={t.id} className="h-1.5 w-1.5 rounded-full" style={{ background: t.projeto_cor ?? STATUS_META[t.status].hex }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold capitalize">{format(selected, "EEEE, d 'de' MMMM", { locale: ptBR })}</h4>
          <Button size="sm" className="h-10" onClick={() => newTask({ projeto_id: projetoId, data_entrega: format(selected, 'yyyy-MM-dd') })}>
            <Plus /> Nova
          </Button>
        </div>
        {selectedItems.length === 0 ? (
          <p className="rounded-lg border bg-card px-3 py-4 text-sm text-muted-foreground shadow-card">Nenhuma tarefa neste dia.</p>
        ) : (
          <div className="space-y-2">
            {selectedItems.map((t) => (
              <button key={t.id} onClick={() => openTask(t.id)}
                className={cn('flex w-full items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-left text-sm font-medium shadow-card',
                  t.status === 'Concluído' && 'text-muted-foreground line-through',
                  isOverdue(t) && 'border-[#e03e3e]/40')}>
                <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: t.projeto_cor ?? STATUS_META[t.status].hex }} />
                <span className="min-w-0 flex-1 truncate">{t.titulo}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
