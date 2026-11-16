import { Check, MessageSquare, CheckSquare } from 'lucide-react'
import type { Tarefa } from '../../lib/api'
import { useData } from '../../lib/data'
import { cn } from '../../lib/utils'
import { STATUSES, STATUS_META, parseTags } from '../../lib/ui'
import { Avatar } from '../Avatar'
import { DueChip, PriorityPill, TagPill } from '../Pills'

export default function ListView({ tarefas }: { tarefas: Tarefa[] }) {
  const { openTask, updateTarefa } = useData()
  return (
    <div className="space-y-6">
      {STATUSES.map((s) => {
        const items = tarefas.filter((t) => t.status === s)
        return (
          <section key={s}>
            <div className="mb-1 flex items-center gap-2 px-1">
              <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_META[s].accent)} />
              <h3 className="text-sm font-semibold">{s}</h3>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="divide-y overflow-hidden rounded-lg border bg-card shadow-card">
              {items.length === 0 && <div className="px-4 py-3 text-sm text-muted-foreground">Nenhuma tarefa</div>}
              {items.map((t) => {
                const done = t.status === 'Concluído'
                return (
                  <div key={t.id} onClick={() => openTask(t.id)}
                    className="group flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors hover:bg-accent/50 md:gap-3">
                    <button
                      title={done ? 'Reabrir' : 'Concluir'}
                      onClick={(e) => { e.stopPropagation(); updateTarefa(t.id, { status: done ? 'A fazer' : 'Concluído' }) }}
                      className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors md:h-[18px] md:w-[18px] md:border-[1.5px]',
                        done ? 'text-[#3c8a5a] md:border-[#3c8a5a] md:bg-[#3c8a5a] md:text-white' : 'text-muted-foreground md:border-muted-foreground/40 md:hover:border-[#3c8a5a]')}
                    >
                      <span className={cn('flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] md:border-0',
                        done ? 'border-[#3c8a5a] bg-[#3c8a5a] text-white' : 'border-muted-foreground/40')}>
                        {done && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                    </button>
                    <span className={cn('min-w-0 flex-1 truncate text-sm font-medium', done && 'text-muted-foreground line-through')}>{t.titulo}</span>
                    <div className="hidden gap-1 md:flex">{parseTags(t.etiquetas).slice(0, 2).map((tag) => <TagPill key={tag} tag={tag} />)}</div>
                    <span className="hidden sm:inline-flex"><PriorityPill prioridade={t.prioridade} /></span>
                    {(t.comentarios ?? 0) > 0 && <span className="hidden items-center gap-0.5 text-xs text-muted-foreground sm:flex"><MessageSquare className="h-3.5 w-3.5" />{t.comentarios}</span>}
                    {(t.checklist_total ?? 0) > 0 && <span className="hidden items-center gap-0.5 text-xs text-muted-foreground sm:flex"><CheckSquare className="h-3.5 w-3.5" />{t.checklist_feitos}/{t.checklist_total}</span>}
                    <span className="shrink-0 text-right sm:w-[86px]"><DueChip tarefa={t} /></span>
                    <Avatar name={t.responsavel_nome} size={24} />
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
