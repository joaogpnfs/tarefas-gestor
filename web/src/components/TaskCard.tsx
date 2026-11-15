import { AlignLeft, CheckSquare, MessageSquare } from 'lucide-react'
import type { Tarefa } from '../lib/api'
import { cn } from '../lib/utils'
import { PRIORIDADE_META, parseTags, tagColor } from '../lib/ui'
import { Avatar } from './Avatar'
import { DueChip } from './Pills'

export default function TaskCard({ tarefa, dragging, overlay, showProject }: {
  tarefa: Tarefa
  dragging?: boolean
  overlay?: boolean
  showProject?: boolean
}) {
  const tags = parseTags(tarefa.etiquetas)
  const total = tarefa.checklist_total ?? 0
  const feitos = Math.min(tarefa.checklist_feitos ?? 0, total)
  const done = tarefa.status === 'Concluído'
  const prio = PRIORIDADE_META[tarefa.prioridade]

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-black/[0.04] bg-card text-left shadow-card transition-[box-shadow,transform] duration-150 dark:border-white/[0.06]',
        !overlay && 'hover:shadow-card-hover hover:-translate-y-px',
        dragging && 'opacity-40 shadow-none',
        overlay && 'rotate-[3deg] scale-[1.03] cursor-grabbing shadow-drag ring-1 ring-primary/30',
      )}
    >
      {tarefa.capa && <div className="h-9 w-full" style={{ background: tarefa.capa }} />}
      <div className="space-y-2 p-2.5 pb-2">
        <div className="flex flex-wrap gap-1">
          <span className={cn('pill text-[11px]', `pill-${prio.color}`)} title="Prioridade">
            <span className={cn('h-1.5 w-1.5 rounded-full', `dot-${prio.color}`)} />
            {prio.label}
          </span>
          {tags.slice(0, 3).map((t) => (
            <span key={t} className={cn('pill text-[11px]', `pill-${tagColor(t)}`)}>{t}</span>
          ))}
        </div>
        <p className={cn('text-[14px] font-medium leading-snug', done && 'text-muted-foreground line-through decoration-muted-foreground/50')}>
          {tarefa.titulo}
        </p>
        {showProject && tarefa.projeto_nome && (
          <p className="truncate text-xs text-muted-foreground">{tarefa.projeto_emoji} {tarefa.projeto_nome}</p>
        )}
        <div className="flex items-center gap-2 pt-0.5 text-muted-foreground">
          <DueChip tarefa={tarefa} />
          {tarefa.descricao && <AlignLeft className="h-3.5 w-3.5" aria-label="Possui descrição" />}
          {(tarefa.comentarios ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]"><MessageSquare className="h-3.5 w-3.5" />{tarefa.comentarios}</span>
          )}
          {total > 0 && (
            <span className={cn(
              'flex items-center gap-0.5 rounded px-1 text-[11px]',
              feitos === total && 'bg-[#3c8a5a] text-white',
            )}>
              <CheckSquare className="h-3.5 w-3.5" />{feitos}/{total}
            </span>
          )}
          <span className="ml-auto">
            {tarefa.responsavel_nome && <Avatar name={tarefa.responsavel_nome} size={24} />}
          </span>
        </div>
      </div>
    </div>
  )
}
