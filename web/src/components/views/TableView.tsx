import { useState } from 'react'
import {
  Calendar, CheckSquare, ChevronDown, ChevronRight, CircleDot, Flag, FolderKanban, Plus, Tag, Type, User,
} from 'lucide-react'
import type { Tarefa } from '../../lib/api'
import { useData } from '../../lib/data'
import { cn } from '../../lib/utils'
import { STATUSES, isOverdue, parseTags, relativeDue, formatShort, STATUS_META } from '../../lib/ui'
import type { Status } from '../../lib/ui'
import { Avatar } from '../Avatar'
import { PriorityPill, StatusPill, TagPill } from '../Pills'

function Th({ icon: Icon, children, className }: { icon: typeof Type; children: React.ReactNode; className?: string }) {
  return (
    <th className={cn('h-9 whitespace-nowrap border-b border-r px-2 text-left text-[13px] font-normal text-muted-foreground last:border-r-0', className)}>
      <span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{children}</span>
    </th>
  )
}

function Row({ t, showProject }: { t: Tarefa; showProject?: boolean }) {
  const { openTask } = useData()
  const total = t.checklist_total ?? 0
  const feitos = Math.min(t.checklist_feitos ?? 0, total)
  return (
    <tr onClick={() => openTask(t.id)} className="group cursor-pointer transition-colors hover:bg-accent/60">
      <td className="h-10 max-w-[300px] border-b border-r px-2">
        <div className="flex items-center gap-2">
          <span className="text-[15px]">{t.projeto_emoji ?? '📄'}</span>
          <span className={cn('truncate text-sm font-medium', t.status === 'Concluído' && 'text-muted-foreground line-through')}>{t.titulo}</span>
          <span className="ml-auto hidden shrink-0 rounded border bg-card px-1.5 text-[11px] font-medium text-muted-foreground shadow-sm group-hover:inline">ABRIR</span>
        </div>
      </td>
      {showProject && (
        <td className="max-w-[170px] border-b border-r px-2 text-sm text-muted-foreground">
          <span className="block truncate">{t.projeto_nome}</span>
        </td>
      )}
      <td className="border-b border-r px-2"><StatusPill status={t.status} /></td>
      <td className="border-b border-r px-2"><PriorityPill prioridade={t.prioridade} /></td>
      <td className="border-b border-r px-2">
        {t.responsavel_nome ? (
          <span className="flex items-center gap-1.5 whitespace-nowrap text-sm"><Avatar name={t.responsavel_nome} size={20} />{t.responsavel_nome.split(' ')[0]}</span>
        ) : <span className="text-sm text-muted-foreground">—</span>}
      </td>
      <td className="whitespace-nowrap border-b border-r px-2 text-sm">
        <span className={cn(isOverdue(t) && 'font-medium text-[#e03e3e]', t.status === 'Concluído' && 'text-muted-foreground')}>
          {formatShort(t.data_entrega)}
        </span>
        {t.data_entrega && t.status !== 'Concluído' && (
          <span className="ml-1.5 hidden text-xs text-muted-foreground 2xl:inline">{relativeDue(t.data_entrega)}</span>
        )}
      </td>
      <td className="border-b border-r px-2">
        <div className="flex gap-1 overflow-hidden whitespace-nowrap">{parseTags(t.etiquetas).slice(0, 2).map((tag) => <TagPill key={tag} tag={tag} />)}</div>
      </td>
      {!showProject && (
      <td className="border-b px-2">
        {total > 0 ? (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full', feitos === total ? 'bg-[#3c8a5a]' : 'bg-primary')} style={{ width: `${(feitos / total) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{feitos}/{total}</span>
          </div>
        ) : <span className="text-xs text-muted-foreground">—</span>}
      </td>
      )}
    </tr>
  )
}

export default function TableView({ tarefas, showProject, groupByStatus, projetoId }: {
  tarefas: Tarefa[]
  showProject?: boolean
  groupByStatus?: boolean
  projetoId?: number
}) {
  const { newTask } = useData()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const cols = 7

  const header = (
    <thead>
      <tr>
        <Th icon={Type} className="min-w-[250px]">Nome</Th>
        {showProject && <Th icon={FolderKanban}>Projeto</Th>}
        <Th icon={CircleDot}>Status</Th>
        <Th icon={Flag}>Prioridade</Th>
        <Th icon={User}>Responsável</Th>
        <Th icon={Calendar}>Entrega</Th>
        <Th icon={Tag}>Etiquetas</Th>
        {!showProject && <Th icon={CheckSquare}>Checklist</Th>}
      </tr>
    </thead>
  )

  const groups: Array<{ key: Status | 'all'; items: Tarefa[] }> = groupByStatus
    ? STATUSES.map((s) => ({ key: s, items: tarefas.filter((t) => t.status === s) }))
    : [{ key: 'all', items: tarefas }]

  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full border-collapse border-t">
        {header}
        {groups.map((g) => (
          <tbody key={g.key}>
            {g.key !== 'all' && (
              <tr>
                <td colSpan={cols} className="pb-1 pt-5">
                  <button onClick={() => setCollapsed((c) => ({ ...c, [g.key]: !c[g.key] }))}
                    className="flex items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-accent">
                    {collapsed[g.key] ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    <StatusPill status={g.key} />
                    <span className="text-muted-foreground">{g.items.length}</span>
                  </button>
                </td>
              </tr>
            )}
            {!collapsed[g.key] && g.items.map((t) => <Row key={t.id} t={t} showProject={showProject} />)}
            {!collapsed[g.key] && (
              <tr>
                <td colSpan={cols} className="border-b">
                  <button onClick={() => newTask({ projeto_id: projetoId, ...(g.key !== 'all' ? { status: g.key } : {}) })}
                    className="flex h-9 w-full items-center gap-1.5 px-2 text-sm text-muted-foreground hover:bg-accent/60">
                    <Plus className="h-4 w-4" /> Novo
                  </button>
                </td>
              </tr>
            )}
            {g.key !== 'all' && !collapsed[g.key] && g.items.length > 0 && (
              <tr><td colSpan={cols} className="px-2 py-1 text-[11px] text-muted-foreground">
                <span className={cn('mr-1 inline-block h-1.5 w-1.5 rounded-full', `dot-${STATUS_META[g.key].color}`)} />
                CONTAGEM {g.items.length}
              </td></tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  )
}
