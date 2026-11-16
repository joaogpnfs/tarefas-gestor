import { useEffect, useRef, useState } from 'react'
import {
  AlignLeft, ArrowRightLeft, Calendar, CheckSquare, CreditCard, Flag, FolderKanban, MessageSquare,
  Palette, Tag, Trash2, User, X, Plus, Circle,
} from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useData } from '../lib/data'
import type { Tarefa } from '../lib/api'
import { cn } from '../lib/utils'
import {
  PRIORIDADES, PRIORIDADE_META, STATUSES, STATUS_META, formatLong, isOverdue, parseTags, tagColor,
} from '../lib/ui'
import { Avatar } from './Avatar'
import { DueChip, PriorityPill, StatusPill, TagPill } from './Pills'
import { Button } from './ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown'

const CARD_COVERS = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B']

function SideButton({ icon: Icon, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: typeof Tag }) {
  return (
    <button
      {...props}
      className={cn(
        'flex h-10 w-full items-center gap-2 rounded-md bg-muted px-2.5 text-left text-[13px] font-medium transition-colors hover:bg-accent md:h-8',
        props.className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      {children}
    </button>
  )
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Tag; children: React.ReactNode }) {
  return (
    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </h3>
  )
}

function DetailView({ tarefa }: { tarefa: Tarefa }) {
  const { membros, projetos, updateTarefa, deleteTarefa, closeTask } = useData()
  const [titulo, setTitulo] = useState(tarefa.titulo)
  const [descricao, setDescricao] = useState(tarefa.descricao ?? '')
  const [newTag, setNewTag] = useState('')
  const [addingTag, setAddingTag] = useState(false)
  const tags = parseTags(tarefa.etiquetas)
  const total = tarefa.checklist_total ?? 0
  const feitos = Math.min(tarefa.checklist_feitos ?? 0, total)
  const projeto = projetos.find((p) => p.id === tarefa.projeto_id)
  const tituloRef = useRef<HTMLTextAreaElement>(null)

  const resizeTitulo = () => {
    const el = tituloRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao ?? '')
  }, [tarefa.id, tarefa.titulo, tarefa.descricao])

  useEffect(() => {
    resizeTitulo()
  }, [titulo])

  const saveTitulo = () => {
    if (titulo.trim() && titulo !== tarefa.titulo) updateTarefa(tarefa.id, { titulo })
    else setTitulo(tarefa.titulo)
  }
  const saveDescricao = () => {
    if (descricao !== (tarefa.descricao ?? '')) updateTarefa(tarefa.id, { descricao })
  }
  const addTag = () => {
    const t = newTag.trim()
    if (t && !tags.includes(t)) updateTarefa(tarefa.id, { etiquetas: [...tags, t].join(',') })
    setNewTag('')
    setAddingTag(false)
  }

  return (
    <>
      {tarefa.capa ? (
        <div className="relative h-24 w-full md:rounded-t-xl" style={{ background: tarefa.capa }}>
          <div className="cover-pattern absolute inset-0 opacity-60 md:rounded-t-xl" />
        </div>
      ) : (
        <div className="h-3" />
      )}
      <DialogPrimitive.Close className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-foreground/80 backdrop-blur transition hover:bg-black/20 md:h-auto md:w-auto md:p-1.5">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>

      <div className="grid grid-cols-1 gap-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 md:grid-cols-[1fr_190px] md:px-6 md:pb-6">
        <div className="min-w-0 space-y-6">
          <div className="flex gap-3 pr-12">
            <CreditCard className="mt-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title asChild>
                <textarea
                  ref={tituloRef}
                  value={titulo}
                  rows={1}
                  onChange={(e) => setTitulo(e.target.value)}
                  onBlur={saveTitulo}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLTextAreaElement).blur() } }}
                  className="w-full resize-none overflow-hidden rounded-md bg-transparent px-1 py-0.5 text-xl font-semibold leading-snug outline-none focus:bg-muted"
                />
              </DialogPrimitive.Title>
              <p className="px-1 text-[13px] text-muted-foreground">
                na lista <span className="font-medium text-foreground underline decoration-dotted underline-offset-2">{tarefa.status}</span>
                {' '}do projeto <span className="font-medium text-foreground">{projeto?.emoji} {projeto?.nome}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-4 pl-8">
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">Responsável</div>
              <div className="flex items-center gap-2">
                <Avatar name={tarefa.responsavel_nome} size={30} />
                <span className="text-sm">{tarefa.responsavel_nome ?? 'Ninguém'}</span>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">Etiquetas</div>
              <div className="flex flex-wrap items-center gap-1">
                <PriorityPill prioridade={tarefa.prioridade} className="h-7 px-2" />
                {tags.map((t) => (
                  <button
                    key={t}
                    title="Remover etiqueta"
                    onClick={() => updateTarefa(tarefa.id, { etiquetas: tags.filter((x) => x !== t).join(',') })}
                  >
                    <TagPill tag={t} className="h-7 px-2 hover:opacity-80" />
                  </button>
                ))}
                {addingTag ? (
                  <input
                    autoFocus
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onBlur={addTag}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="nova etiqueta"
                    className="h-7 w-28 rounded border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <button onClick={() => setAddingTag(true)} className="flex h-7 w-7 items-center justify-center rounded bg-muted hover:bg-accent">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">Data de entrega</div>
              <label className="flex h-7 cursor-pointer items-center gap-2 rounded bg-muted px-2 text-sm hover:bg-accent">
                <DueChip tarefa={tarefa} className="px-1" />
                {!tarefa.data_entrega && <span className="text-muted-foreground">Definir</span>}
                {isOverdue(tarefa) && <span className="text-xs font-medium text-[#e03e3e]">Atrasada</span>}
                <input
                  type="date"
                  value={tarefa.data_entrega?.slice(0, 10) ?? ''}
                  onChange={(e) => updateTarefa(tarefa.id, { data_entrega: e.target.value || null })}
                  className="w-0 opacity-0"
                />
              </label>
            </div>
          </div>

          <div>
            <SectionTitle icon={AlignLeft}>Descrição</SectionTitle>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onBlur={saveDescricao}
              placeholder="Adicione uma descrição mais detalhada…"
              rows={4}
              className="ml-6 w-[calc(100%-1.5rem)] resize-none rounded-lg bg-muted px-3 py-2.5 text-sm leading-relaxed outline-none transition focus:bg-card focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <SectionTitle icon={CheckSquare}>Checklist</SectionTitle>
              <div className="flex flex-wrap justify-end gap-1">
                <Button size="sm" variant="secondary" className="h-7" onClick={() => updateTarefa(tarefa.id, { checklist_total: total + 1 })}>
                  Adicionar item
                </Button>
                <Button size="sm" variant="secondary" className="h-7" disabled={feitos >= total}
                  onClick={() => updateTarefa(tarefa.id, { checklist_feitos: feitos + 1 })}>
                  Marcar concluído
                </Button>
              </div>
            </div>
            <div className="ml-6 flex items-center gap-3">
              <span className="w-9 text-xs font-medium text-muted-foreground">{total ? Math.round((feitos / total) * 100) : 0}%</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', feitos === total && total > 0 ? 'bg-[#3c8a5a]' : 'bg-primary')}
                  style={{ width: `${total ? (feitos / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{feitos}/{total} itens</span>
            </div>
          </div>

          <div>
            <SectionTitle icon={MessageSquare}>Atividade</SectionTitle>
            <div className="ml-6 space-y-3">
              <div className="flex items-start gap-2">
                <Avatar name={tarefa.responsavel_nome} size={28} />
                <div className="flex-1 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
                  Escrever um comentário…
                </div>
              </div>
              <p className="pl-9 text-xs text-muted-foreground">
                {tarefa.comentarios ?? 0} comentário(s) · criada em {formatLong(tarefa.criado_em)}
              </p>
            </div>
          </div>
        </div>

        {/* Coluna de ações */}
        <aside className="space-y-5">
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Adicionar ao cartão</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><SideButton icon={User}>Membros</SideButton></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Responsável</DropdownMenuLabel>
                {membros.map((m) => (
                  <DropdownMenuItem key={m.id} onSelect={() => updateTarefa(tarefa.id, { responsavel_id: m.id, responsavel_nome: m.nome })}>
                    <Avatar name={m.nome} size={20} /> {m.nome}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => updateTarefa(tarefa.id, { responsavel_id: null, responsavel_nome: null })}>
                  Remover responsável
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SideButton icon={Tag} onClick={() => setAddingTag(true)}>Etiquetas</SideButton>
            <SideButton icon={CheckSquare} onClick={() => updateTarefa(tarefa.id, { checklist_total: total + 1 })}>Checklist</SideButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><SideButton icon={Palette}>Capa</SideButton></DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2">
                <DropdownMenuLabel>Cor da capa</DropdownMenuLabel>
                <div className="grid grid-cols-5 gap-1.5 p-1">
                  {CARD_COVERS.map((c) => (
                    <DropdownMenuItem key={c} className="h-8 p-0" style={{ background: c }} onSelect={() => updateTarefa(tarefa.id, { capa: c })} />
                  ))}
                </div>
                <DropdownMenuItem onSelect={() => updateTarefa(tarefa.id, { capa: null })}>Remover capa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ações</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><SideButton icon={ArrowRightLeft}>Mover</SideButton></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Lista</DropdownMenuLabel>
                {STATUSES.map((s) => (
                  <DropdownMenuItem key={s} onSelect={() => updateTarefa(tarefa.id, { status: s })}>
                    <span className={cn('h-2 w-2 rounded-full', `dot-${STATUS_META[s].color}`)} /> {s}
                    {tarefa.status === s && <span className="ml-auto text-xs text-muted-foreground">atual</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><SideButton icon={Flag}>Prioridade</SideButton></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {PRIORIDADES.map((p) => (
                  <DropdownMenuItem key={p} onSelect={() => updateTarefa(tarefa.id, { prioridade: p })}>
                    <Flag style={{ color: PRIORIDADE_META[p].hex }} /> {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <SideButton
              icon={Trash2}
              className="hover:bg-[#ffe2dd] hover:text-[#c4352c] dark:hover:bg-[#6e3630] dark:hover:text-white"
              onClick={() => {
                if (confirm('Excluir esta tarefa?')) {
                  deleteTarefa(tarefa.id)
                  closeTask()
                }
              }}
            >
              Excluir
            </SideButton>
          </div>

          <div className="space-y-2 rounded-lg border bg-background p-3 text-xs">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><StatusPill status={tarefa.status} /></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Prioridade</span><PriorityPill prioridade={tarefa.prioridade} /></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Projeto</span><span className="truncate pl-2 font-medium">{projeto?.emoji} {projeto?.nome}</span></div>
          </div>
        </aside>
      </div>
    </>
  )
}

function Row({ icon: Icon, label, children }: { icon: typeof Tag; label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-1 items-center gap-1 text-sm md:grid-cols-[140px_1fr] md:gap-3">
      <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</span>
      {children}
    </label>
  )
}

function CreateView({ draft }: { draft: Partial<Tarefa> }) {
  const { projetos, membros, createTarefa, closeTask, openTask } = useData()
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    projeto_id: draft.projeto_id ?? projetos[0]?.id ?? 0,
    status: draft.status ?? 'A fazer',
    prioridade: draft.prioridade ?? 'Média',
    responsavel_id: draft.responsavel_id ?? null,
    data_entrega: draft.data_entrega ?? '',
    etiquetas: '',
  } as Record<string, string | number | null>)
  const set = (k: string, v: string | number | null) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!String(form.titulo).trim()) return
    const created = await createTarefa({
      ...form,
      projeto_id: Number(form.projeto_id),
      responsavel_id: form.responsavel_id ? Number(form.responsavel_id) : null,
      data_entrega: form.data_entrega ? String(form.data_entrega) : null,
    } as Partial<Tarefa>)
    if (created) openTask(created.id)
  }

  const field = 'h-9 w-full rounded-md border bg-card px-2.5 text-sm outline-none focus:ring-2 focus:ring-ring'

  return (
    <form onSubmit={submit} className="space-y-5 p-6">
      <DialogPrimitive.Close type="button" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent md:h-auto md:w-auto md:p-1.5">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
      <DialogPrimitive.Title className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Novo cartão</DialogPrimitive.Title>
      <input
        autoFocus
        value={String(form.titulo)}
        onChange={(e) => set('titulo', e.target.value)}
        placeholder="Sem título"
        className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40 md:text-3xl"
      />
      <div className="space-y-2.5">
        <Row icon={FolderKanban} label="Projeto">
          <select className={field} value={String(form.projeto_id)} onChange={(e) => set('projeto_id', Number(e.target.value))}>
            {projetos.map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.nome}</option>)}
          </select>
        </Row>
        <Row icon={Circle} label="Status">
          <select className={field} value={String(form.status)} onChange={(e) => set('status', e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Row>
        <Row icon={Flag} label="Prioridade">
          <select className={field} value={String(form.prioridade)} onChange={(e) => set('prioridade', e.target.value)}>
            {PRIORIDADES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Row>
        <Row icon={User} label="Responsável">
          <select className={field} value={String(form.responsavel_id ?? '')} onChange={(e) => set('responsavel_id', e.target.value || null)}>
            <option value="">Ninguém</option>
            {membros.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </Row>
        <Row icon={Calendar} label="Entrega">
          <input type="date" className={field} value={String(form.data_entrega ?? '')} onChange={(e) => set('data_entrega', e.target.value)} />
        </Row>
        <Row icon={Tag} label="Etiquetas">
          <input className={field} placeholder="frontend, ux" value={String(form.etiquetas)} onChange={(e) => set('etiquetas', e.target.value)} />
        </Row>
      </div>
      {parseTags(String(form.etiquetas)).length > 0 && (
        <div className="flex flex-wrap gap-1 md:pl-[152px]">
          {parseTags(String(form.etiquetas)).map((t) => <span key={t} className={cn('pill', `pill-${tagColor(t)}`)}>{t}</span>)}
        </div>
      )}
      <textarea
        value={String(form.descricao)}
        onChange={(e) => set('descricao', e.target.value)}
        rows={4}
        placeholder="Descrição…"
        className="w-full resize-none rounded-lg bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={closeTask}>Cancelar</Button>
        <Button type="submit" disabled={!String(form.titulo).trim()}>Criar cartão</Button>
      </div>
    </form>
  )
}

export default function TaskModal() {
  const { openTaskId, taskDraft, tarefas, closeTask } = useData()
  const tarefa = openTaskId != null ? tarefas.find((t) => t.id === openTaskId) : undefined
  const open = !!tarefa || !!taskDraft

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && closeTask()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-0 z-50 h-dvh w-full max-h-dvh overflow-y-auto rounded-none border bg-card shadow-pop scrollbar-thin',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.97]',
            'md:inset-auto md:left-1/2 md:top-[6vh] md:h-auto md:max-h-[88vh] md:w-[calc(100%-2rem)] md:-translate-x-1/2 md:rounded-xl md:data-[state=open]:slide-in-from-top-2',
            tarefa ? 'md:max-w-[780px]' : 'md:max-w-[620px]',
          )}
        >
          {tarefa ? <DetailView tarefa={tarefa} /> : taskDraft ? <CreateView draft={taskDraft} /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
