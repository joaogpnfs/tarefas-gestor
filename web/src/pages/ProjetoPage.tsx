import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  CalendarDays, CircleDot, Clock, Image, KanbanSquare, List, ListChecks, MoreHorizontal, Plus, Search, Smile, Table2, Trash2, Users,
  ChevronDown, SlidersHorizontal, ArrowUpDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { useData } from '../lib/data'
import { cn } from '../lib/utils'
import { COVERS, EMOJIS, coverCss, daysUntil, formatLong } from '../lib/ui'
import { AvatarStack } from '../components/Avatar'
import { Pill } from '../components/Pills'
import { Button } from '../components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown'
import BoardView from '../components/views/BoardView'
import TableView from '../components/views/TableView'
import ListView from '../components/views/ListView'
import CalendarView from '../components/views/CalendarView'

const VIEWS = [
  { key: 'quadro', label: 'Quadro', icon: KanbanSquare },
  { key: 'tabela', label: 'Tabela', icon: Table2 },
  { key: 'lista', label: 'Lista', icon: List },
  { key: 'calendario', label: 'Calendário', icon: CalendarDays },
] as const

function prazoLabel(prazo: string): string {
  const n = daysUntil(prazo) ?? 0
  if (n === 0) return 'vence hoje'
  if (n < 0) return `atrasado ${Math.abs(n)} dia(s)`
  return `faltam ${n} dias`
}

function PropRow({ icon: Icon, label, children }: { icon: typeof Users; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[30px] items-center">
      <div className="flex w-40 shrink-0 items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-accent/60">{children}</div>
    </div>
  )
}

export default function ProjetoPage() {
  const { id } = useParams()
  const projetoId = Number(id)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const view = (params.get('view') ?? 'quadro') as (typeof VIEWS)[number]['key']
  const { projetos, tarefas, loading, updateProjeto, newTask, refresh } = useData()
  const projeto = projetos.find((p) => p.id === projetoId)
  const [q, setQ] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if (projeto) { setNome(projeto.nome); setDescricao(projeto.descricao ?? '') }
  }, [projeto?.id, projeto?.nome, projeto?.descricao]) // eslint-disable-line react-hooks/exhaustive-deps

  const doProjeto = useMemo(() => tarefas.filter((t) => t.projeto_id === projetoId), [tarefas, projetoId])
  const filtradas = useMemo(() => {
    const term = q.trim().toLowerCase()
    return term ? doProjeto.filter((t) => t.titulo.toLowerCase().includes(term) || (t.etiquetas ?? '').includes(term)) : doProjeto
  }, [doProjeto, q])

  if (!projeto) {
    return <div className="p-16 text-center text-muted-foreground">{loading ? 'Carregando…' : 'Projeto não encontrado'}</div>
  }

  const total = doProjeto.length
  const concluidas = doProjeto.filter((t) => t.status === 'Concluído').length
  const andamento = doProjeto.filter((t) => t.status === 'Em andamento').length
  const pct = total ? Math.round((concluidas / total) * 100) : 0
  const responsaveis = Array.from(new Set(doProjeto.map((t) => t.responsavel_nome).filter(Boolean))) as string[]
  const statusProjeto = total === 0 ? { label: 'Não iniciado', color: 'gray' as const }
    : concluidas === total ? { label: 'Concluído', color: 'green' as const }
    : andamento > 0 || concluidas > 0 ? { label: 'Em andamento', color: 'blue' as const }
    : { label: 'Planejado', color: 'purple' as const }

  const setView = (v: string) => setParams((p) => { p.set('view', v); return p }, { replace: true })
  const coverKeys = Object.keys(COVERS)

  const excluir = async () => {
    if (!confirm(`Excluir o projeto "${projeto.nome}" e todas as suas tarefas?`)) return
    try {
      await api.projetos.delete(projeto.id)
      await refresh()
      toast.success('Projeto excluído')
      navigate('/projetos')
    } catch {
      toast.error('Erro ao excluir projeto')
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Capa */}
      <div className="group relative h-[168px] w-full" style={{ background: coverCss(projeto.capa, projeto.cor) }}>
        <div className="cover-pattern absolute inset-0 opacity-70" />
        <div className="absolute bottom-3 right-12 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => updateProjeto(projeto.id, { capa: coverKeys[(coverKeys.indexOf(projeto.capa ?? '') + 1) % coverKeys.length] })}
            className="rounded-md bg-white/85 px-2.5 py-1 text-xs font-medium text-[#37352f] shadow-sm backdrop-blur hover:bg-white">
            Trocar capa
          </button>
        </div>
      </div>

      <div className="px-12 xl:px-20">
        {/* Ícone */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative z-10 -mt-[46px] flex h-[84px] w-[84px] items-center justify-center rounded-xl text-[64px] leading-none transition hover:bg-accent/50" title="Alterar ícone">
              {projeto.emoji || '📁'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <DropdownMenuLabel>Ícone</DropdownMenuLabel>
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJIS.map((e) => (
                <DropdownMenuItem key={e} className="justify-center p-1 text-xl" onSelect={() => updateProjeto(projeto.id, { emoji: e })}>{e}</DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mt-1 flex items-start gap-3">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => nome.trim() && nome !== projeto.nome ? updateProjeto(projeto.id, { nome }) : setNome(projeto.nome)}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="min-w-0 flex-1 bg-transparent text-[38px] font-bold leading-tight tracking-tight outline-none"
            aria-label="Título do projeto"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mt-3 text-muted-foreground"><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => updateProjeto(projeto.id, { capa: coverKeys[(coverKeys.indexOf(projeto.capa ?? '') + 1) % coverKeys.length] })}>
                <Image /> Trocar capa
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => updateProjeto(projeto.id, { emoji: EMOJIS[(EMOJIS.indexOf(projeto.emoji ?? '') + 1) % EMOJIS.length] })}>
                <Smile /> Trocar ícone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={excluir}><Trash2 /> Excluir projeto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onBlur={() => descricao !== (projeto.descricao ?? '') && updateProjeto(projeto.id, { descricao })}
          rows={1}
          placeholder="Adicione uma descrição…"
          className="mt-1 w-full max-w-3xl resize-none bg-transparent text-[15px] leading-relaxed text-muted-foreground outline-none"
        />

        {/* Propriedades */}
        <div className="mt-3 max-w-3xl">
          <PropRow icon={CircleDot} label="Status"><Pill color={statusProjeto.color} dot>{statusProjeto.label}</Pill></PropRow>
          <PropRow icon={Users} label="Membros">
            <AvatarStack names={responsaveis} size={24} max={5} />
            <span className="text-muted-foreground">{responsaveis.length} pessoas</span>
          </PropRow>
          <PropRow icon={Clock} label="Prazo">
            {projeto.prazo ? (
              <><span>{formatLong(projeto.prazo)}</span><span className="text-muted-foreground">· {prazoLabel(projeto.prazo)}</span></>
            ) : <span className="text-muted-foreground">Vazio</span>}
          </PropRow>
          <PropRow icon={ListChecks} label="Progresso">
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-[#3c8a5a] transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-medium">{pct}%</span>
            <span className="text-muted-foreground">· {concluidas} de {total} tarefas</span>
          </PropRow>
        </div>

        {/* Abas de visualização */}
        <div className="mt-4 flex items-center gap-1 border-b">
          {VIEWS.map((v) => {
            const Icon = v.icon
            const active = view === v.key
            return (
              <button key={v.key} onClick={() => setView(v.key)}
                className={cn('relative flex items-center gap-1.5 rounded-t-md px-2.5 pb-2 pt-1.5 text-sm font-medium transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <Icon className="h-4 w-4" />{v.label}
                {active && <span className="absolute inset-x-1.5 -bottom-px h-[2px] rounded-full bg-foreground" />}
              </button>
            )
          })}
          <div className="ml-auto flex items-center gap-1 pb-1.5">
            <Button variant="ghost" size="sm" className="text-muted-foreground"><SlidersHorizontal />Filtrar</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground"><ArrowUpDown />Ordenar</Button>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…"
                className="h-8 w-40 rounded-md bg-transparent pl-7 pr-2 text-sm outline-none transition-all placeholder:text-muted-foreground hover:bg-accent focus:w-52 focus:bg-card focus:ring-1 focus:ring-border" />
            </div>
            <div className="flex">
              <Button size="sm" className="rounded-r-none" onClick={() => newTask({ projeto_id: projeto.id })}><Plus />Novo</Button>
              <Button size="sm" className="rounded-l-none border-l border-white/25 px-1.5"><ChevronDown /></Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('pt-4', view === 'quadro' ? 'pl-12 xl:pl-20' : 'px-12 pb-16 xl:px-20')}>
        {view === 'quadro' && <BoardView tarefas={filtradas} projetoId={projeto.id} />}
        {view === 'tabela' && <TableView tarefas={filtradas} projetoId={projeto.id} />}
        {view === 'lista' && <ListView tarefas={filtradas} />}
        {view === 'calendario' && <CalendarView tarefas={filtradas} projetoId={projeto.id} />}
      </div>
    </div>
  )
}
