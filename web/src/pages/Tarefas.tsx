import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Plus, Table2, KanbanSquare, CalendarDays, List } from 'lucide-react'
import { useData } from '../lib/data'
import { cn } from '../lib/utils'
import { PRIORIDADES, PRIORIDADE_META, isOverdue } from '../lib/ui'
import type { Prioridade } from '../lib/ui'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/ui/button'
import TableView from '../components/views/TableView'
import BoardView from '../components/views/BoardView'
import ListView from '../components/views/ListView'
import CalendarView from '../components/views/CalendarView'

const VIEWS = [
  { key: 'tabela', label: 'Por status', icon: Table2 },
  { key: 'quadro', label: 'Quadro', icon: KanbanSquare },
  { key: 'lista', label: 'Lista', icon: List },
  { key: 'calendario', label: 'Calendário', icon: CalendarDays },
] as const

export default function Tarefas({ mine = false }: { mine?: boolean }) {
  const { tarefas, membros, projetos, currentUser, newTask } = useData()
  const [params, setParams] = useSearchParams()
  const view = (params.get('view') ?? 'tabela') as (typeof VIEWS)[number]['key']
  const setView = (v: string) => setParams((p) => { p.set('view', v); return p }, { replace: true })
  const [q, setQ] = useState('')
  const [prio, setPrio] = useState<Prioridade | null>(null)
  const [resp, setResp] = useState<number | null>(null)
  const [proj, setProj] = useState<number | null>(null)

  const base = useMemo(
    () => (mine && currentUser ? tarefas.filter((t) => t.responsavel_id === currentUser.id) : tarefas),
    [tarefas, mine, currentUser],
  )
  const list = useMemo(() => base.filter((t) =>
    (!q || t.titulo.toLowerCase().includes(q.toLowerCase())) &&
    (!prio || t.prioridade === prio) &&
    (!resp || t.responsavel_id === resp) &&
    (!proj || t.projeto_id === proj),
  ), [base, q, prio, resp, proj])

  const chip = (active: boolean) => cn(
    'flex h-10 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors md:h-7',
    active ? 'border-primary/40 bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
  )

  return (
    <div className="animate-fade-up px-4 pb-16 pt-8 md:px-10 md:pt-10">
      <div className="text-5xl">{mine ? '📥' : '✅'}</div>
      <h1 className="mt-3 text-[28px] font-bold tracking-tight md:text-[34px]">{mine ? 'Minhas tarefas' : 'Todas as tarefas'}</h1>
      <p className="text-[15px] text-muted-foreground">
        {mine ? 'Tudo o que está atribuído a você, em todos os projetos.' : 'Banco de dados com as tarefas de todos os projetos da equipe.'}
        {' '}<span className="font-medium text-foreground">{base.filter((t) => t.status !== 'Concluído').length} abertas</span>
        {' · '}<span className="font-medium text-[#e03e3e]">{base.filter(isOverdue).length} atrasadas</span>
      </p>

      <div className="mt-6 flex flex-col gap-2 border-b md:flex-row md:items-center md:gap-1">
        <div className="scrollbar-thin -mx-4 flex items-center gap-1 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
          {VIEWS.map((v) => {
            const Icon = v.icon
            return (
              <button key={v.key} onClick={() => setView(v.key)}
                className={cn('relative flex min-h-10 shrink-0 items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-sm font-medium md:min-h-0', view === v.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <Icon className="h-4 w-4" />{v.label}
                {view === v.key && <span className="absolute inset-x-1.5 -bottom-px h-[2px] rounded-full bg-foreground" />}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1 pb-1.5 md:ml-auto">
          <div className="relative min-w-0 flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…"
              className="h-10 w-full rounded-md bg-transparent pl-7 pr-2 text-sm outline-none placeholder:text-muted-foreground hover:bg-accent focus:bg-card focus:ring-1 focus:ring-border md:h-8 md:w-44" />
          </div>
          <Button size="sm" className="h-10 shrink-0 md:h-8" onClick={() => newTask({ responsavel_id: mine ? currentUser?.id ?? null : null })}><Plus />Novo</Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-1.5 py-3">
        {PRIORIDADES.map((p) => (
          <button key={p} onClick={() => setPrio(prio === p ? null : p)} className={chip(prio === p)}>
            <span className="h-2 w-2 rounded-full" style={{ background: PRIORIDADE_META[p].hex }} />{p}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        {projetos.map((p) => (
          <button key={p.id} onClick={() => setProj(proj === p.id ? null : p.id)} className={chip(proj === p.id)}>
            <span>{p.emoji}</span><span className="max-w-[120px] truncate">{p.nome}</span>
          </button>
        ))}
        {!mine && (
          <>
            <span className="mx-1 h-4 w-px bg-border" />
            <div className="flex -space-x-1">
              {membros.map((m) => (
                <button key={m.id} onClick={() => setResp(resp === m.id ? null : m.id)} title={m.nome}
                  className={cn('rounded-full p-1.5 transition hover:z-10 hover:scale-110 md:p-0', resp === m.id && 'z-10 ring-2 ring-primary ring-offset-1 ring-offset-background')}>
                  <Avatar name={m.nome} size={26} ring />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {view === 'tabela' && <TableView tarefas={list} showProject groupByStatus />}
      {view === 'quadro' && <BoardView tarefas={list} />}
      {view === 'lista' && <ListView tarefas={list} />}
      {view === 'calendario' && <CalendarView tarefas={list} />}
    </div>
  )
}
