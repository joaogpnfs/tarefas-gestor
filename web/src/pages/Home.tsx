import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AlertTriangle, ArrowUpRight, CheckCircle2, FolderKanban, Loader2, Plus, Sparkles, CalendarDays, Clock,
} from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useData } from '../lib/data'
import { cn } from '../lib/utils'
import {
  CURRENT_USER_FIRST_NAME, PRIORIDADES, PRIORIDADE_META, STATUSES, STATUS_META, daysUntil, greeting, isOverdue, relativeDue,
} from '../lib/ui'
import type { Tarefa } from '../lib/api'
import ProjectGallery from '../components/ProjectGallery'
import { PriorityPill } from '../components/Pills'
import { Button } from '../components/ui/button'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function StatCard({ icon: Icon, label, value, hint, chip, delay }: {
  icon: typeof Sparkles; label: string; value: number | string; hint: string; chip: string; delay: number
}) {
  return (
    <div className="animate-fade-up rounded-xl border bg-card p-4 shadow-card transition hover:shadow-card-hover" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', chip)}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-1.5 text-xs text-muted-foreground">{hint}</div>
    </div>
  )
}

function TaskLine({ t }: { t: Tarefa }) {
  const { openTask } = useData()
  const overdue = isOverdue(t)
  return (
    <button onClick={() => openTask(t.id)}
      className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent/60">
      <span className={cn('h-4 w-4 shrink-0 rounded-full border-[1.5px]', t.status === 'Em andamento' ? 'border-[#2e7cd1] bg-[#2e7cd1]/15' : 'border-muted-foreground/40')} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{t.titulo}</span>
        <span className="block truncate text-xs text-muted-foreground">{t.projeto_emoji} {t.projeto_nome}</span>
      </span>
      <PriorityPill prioridade={t.prioridade} />
      <span className={cn('w-24 text-right text-xs', overdue ? 'font-medium text-[#e03e3e]' : 'text-muted-foreground')}>{relativeDue(t.data_entrega)}</span>
    </button>
  )
}

function Group({ title, icon: Icon, color, items, empty }: { title: string; icon: typeof Clock; color: string; items: Tarefa[]; empty: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className={cn('h-3.5 w-3.5', color)} />{title}<span className="font-normal">{items.length}</span>
      </div>
      {items.length === 0 ? <p className="px-2 py-2 text-sm text-muted-foreground">{empty}</p> : items.map((t) => <TaskLine key={t.id} t={t} />)}
    </div>
  )
}

export default function Home() {
  const { tarefas, projetos, currentUser, loading, newTask, setProjectDialogOpen } = useData()
  const now = new Date()

  const stats = useMemo(() => {
    const total = tarefas.length
    const done = tarefas.filter((t) => t.status === 'Concluído').length
    return {
      total, done,
      doing: tarefas.filter((t) => t.status === 'Em andamento').length,
      overdue: tarefas.filter(isOverdue).length,
      pct: total ? Math.round((done / total) * 100) : 0,
    }
  }, [tarefas])

  const minhas = tarefas.filter((t) => (currentUser ? t.responsavel_id === currentUser.id : true) && t.status !== 'Concluído')
  const hoje = minhas.filter((t) => daysUntil(t.data_entrega) === 0)
  const atrasadas = minhas.filter((t) => isOverdue(t))
  const proximas = minhas.filter((t) => (daysUntil(t.data_entrega) ?? 99) > 0)
    .sort((a, b) => (a.data_entrega ?? '').localeCompare(b.data_entrega ?? '')).slice(0, 5)

  const statusData = STATUSES.map((s) => ({ name: s, value: tarefas.filter((t) => t.status === s).length, fill: STATUS_META[s].hex }))
  const prioData = PRIORIDADES.map((p) => ({ name: p, value: tarefas.filter((t) => t.prioridade === p).length, fill: PRIORIDADE_META[p].hex }))

  if (loading) return <div className="flex h-[60vh] items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <div className="mx-auto max-w-[1120px] px-10 pb-16 pt-8">
      {/* Saudação */}
      <div className="animate-fade-up flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{capitalize(format(now, "EEEE, d 'de' MMMM", { locale: ptBR }))}</p>
          <h1 className="mt-1 text-[32px] font-bold tracking-tight">{greeting(now)}, {CURRENT_USER_FIRST_NAME} 👋</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Você tem <span className="font-medium text-foreground">{hoje.length} tarefa(s) para hoje</span>
            {atrasadas.length > 0 && <> e <span className="font-medium text-[#e03e3e]">{atrasadas.length} atrasada(s)</span></>}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProjectDialogOpen(true)}><FolderKanban />Novo projeto</Button>
          <Button onClick={() => newTask({})}><Plus />Nova tarefa</Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-7 grid grid-cols-4 gap-3">
        <StatCard icon={FolderKanban} label="Projetos ativos" value={projetos.length} hint={`${stats.total} tarefas no total`} chip="bg-[#e8deee] text-[#6940a5] dark:bg-[#492f64] dark:text-[#e2d3f1]" delay={0} />
        <StatCard icon={Sparkles} label="Em andamento" value={stats.doing} hint="sendo trabalhadas agora" chip="bg-[#d3e5ef] text-[#1f6fb5] dark:bg-[#28456c] dark:text-[#cfe3f7]" delay={50} />
        <StatCard icon={CheckCircle2} label="Concluídas" value={stats.done} hint={`${stats.pct}% de todas as tarefas`} chip="bg-[#dbeddb] text-[#2f7a4b] dark:bg-[#2b593f] dark:text-[#d2ecd9]" delay={100} />
        <StatCard icon={AlertTriangle} label="Atrasadas" value={stats.overdue} hint="precisam de atenção" chip="bg-[#ffe2dd] text-[#c4352c] dark:bg-[#6e3630] dark:text-[#fbd9d4]" delay={150} />
      </div>

      {/* Gráficos */}
      <div className="mt-3 grid grid-cols-[1fr_1fr_1.15fr] gap-3">
        <div className="animate-fade-up rounded-xl border bg-card p-4 shadow-card" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-semibold">Tarefas por status</h3>
          <div className="relative mt-1 h-[132px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={44} outerRadius={62} paddingAngle={3} stroke="none" cornerRadius={4}>
                  {statusData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">{stats.pct}%</span>
              <span className="text-[11px] text-muted-foreground">concluído</span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {statusData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} />
                <span className="flex-1">{d.name}</span>
                <b className="font-medium text-foreground">{d.value}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-fade-up rounded-xl border bg-card p-4 shadow-card" style={{ animationDelay: '250ms' }}>
          <h3 className="text-sm font-semibold">Por prioridade</h3>
          <div className="mt-3 h-[172px]">
            <ResponsiveContainer>
              <BarChart data={prioData} barSize={34}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis hide allowDecimals={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 2, 2]} name="Tarefas">
                  {prioData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="animate-fade-up rounded-xl border bg-card p-4 shadow-card" style={{ animationDelay: '300ms' }}>
          <h3 className="text-sm font-semibold">Progresso dos projetos</h3>
          <div className="mt-3 space-y-3">
            {projetos.map((p) => {
              const ts = tarefas.filter((t) => t.projeto_id === p.id)
              const pct = ts.length ? Math.round((ts.filter((t) => t.status === 'Concluído').length / ts.length) * 100) : 0
              return (
                <Link key={p.id} to={`/projetos/${p.id}`} className="block group">
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="truncate font-medium group-hover:underline">{p.emoji} {p.nome}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: p.cor }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Minhas tarefas */}
      <div className="mt-8 grid grid-cols-[1.35fr_1fr] gap-6">
        <section className="animate-fade-up" style={{ animationDelay: '350ms' }}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Minhas tarefas</h2>
            <Link to="/minhas" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">Ver todas <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-4 rounded-xl border bg-card p-2 shadow-card">
            <Group title="Hoje" icon={CalendarDays} color="text-[#d9730d]" items={hoje} empty="Nada para hoje 🎉" />
            <Group title="Atrasadas" icon={AlertTriangle} color="text-[#e03e3e]" items={atrasadas} empty="Nenhuma tarefa atrasada" />
            <Group title="Próximas" icon={Clock} color="text-[#2e7cd1]" items={proximas} empty="Sem próximas entregas" />
          </div>
        </section>
        <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Prazos da semana</h2>
          </div>
          <div className="rounded-xl border bg-card p-3 shadow-card">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(now); d.setDate(now.getDate() + i)
              const items = tarefas.filter((t) => daysUntil(t.data_entrega) === i)
              return (
                <div key={i} className="flex items-center gap-3 border-b py-2 last:border-0">
                  <div className={cn('flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg', i === 0 ? 'bg-[#e03e3e] text-white' : 'bg-muted')}>
                    <span className="text-[9px] font-semibold uppercase leading-none">{DIAS[d.getDay()]}</span>
                    <span className="text-sm font-bold leading-tight">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    {items.length === 0 ? <span className="text-sm text-muted-foreground">Livre</span> : (
                      <div className="flex flex-wrap gap-1">
                        {items.slice(0, 2).map((t) => (
                          <span key={t.id} className="flex max-w-full items-center gap-1.5 truncate rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.projeto_cor }} />
                            <span className="truncate">{t.titulo}</span>
                          </span>
                        ))}
                        {items.length > 2 && <span className="text-xs text-muted-foreground">+{items.length - 2}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Projetos recentes */}
      <section className="mt-8 animate-fade-up" style={{ animationDelay: '450ms' }}>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projetos recentes</h2>
          <Link to="/projetos" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">Ver galeria <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        <ProjectGallery limit={4} />
      </section>
    </div>
  )
}
