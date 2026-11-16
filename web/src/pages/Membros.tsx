import { useState } from 'react'
import { Mail, MoreHorizontal, Pencil, Plus, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../lib/api'
import type { Membro } from '../lib/api'
import { useData } from '../lib/data'
import { avatarColor } from '../lib/ui'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown'

export default function Membros() {
  const { membros, tarefas, projetos, refresh } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Membro | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', cargo: '' })

  const abrir = (m?: Membro) => {
    setEditing(m ?? null)
    setForm({ nome: m?.nome ?? '', email: m?.email ?? '', cargo: m?.cargo ?? '' })
    setOpen(true)
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) await api.membros.update(editing.id, form)
      else await api.membros.create(form)
      toast.success(editing ? 'Membro atualizado' : 'Membro adicionado')
      setOpen(false)
      refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar membro')
    }
  }

  const excluir = async (m: Membro) => {
    if (!confirm(`Remover ${m.nome} da equipe?`)) return
    try {
      await api.membros.delete(m.id)
      toast.success('Membro removido')
      refresh()
    } catch {
      toast.error('Erro ao remover membro')
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] animate-fade-up px-4 pb-16 pt-8 md:px-10 md:pt-10">
      <div className="text-5xl">👥</div>
      <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight md:text-[34px]">Membros</h1>
          <p className="text-[15px] text-muted-foreground">{membros.length} pessoas colaborando em {projetos.length} projetos.</p>
        </div>
        <Button onClick={() => abrir()}><UserPlus />Convidar membro</Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {membros.map((m, i) => {
          const ts = tarefas.filter((t) => t.responsavel_id === m.id)
          const done = ts.filter((t) => t.status === 'Concluído').length
          const doing = ts.filter((t) => t.status === 'Em andamento').length
          const todo = ts.length - done - doing
          const pct = ts.length ? Math.round((done / ts.length) * 100) : 0
          const projs = projetos.filter((p) => ts.some((t) => t.projeto_id === p.id))
          const color = avatarColor(m.nome)
          return (
            <div key={m.id} className="group animate-fade-up overflow-hidden rounded-xl border bg-card shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{ animationDelay: `${i * 40}ms` }}>
              <div className="relative h-16" style={{ background: `linear-gradient(120deg, ${color}, ${color}99)` }}>
                <div className="cover-pattern absolute inset-0 opacity-60" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur transition hover:bg-white/30 md:h-auto md:w-auto md:p-1 md:opacity-0 md:group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => abrir(m)}><Pencil /> Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive onSelect={() => excluir(m)}><Trash2 /> Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="px-4 pb-4">
                <div className="-mt-7 inline-block rounded-full bg-card p-1"><Avatar name={m.nome} size={52} /></div>
                <h3 className="mt-1 truncate text-[15px] font-semibold">{m.nome}</h3>
                <p className="truncate text-[13px] text-muted-foreground">{m.cargo ?? 'Membro'}</p>
                <a href={`mailto:${m.email}`} className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground hover:text-foreground">
                  <Mail className="h-3 w-3" />{m.email}
                </a>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { n: todo, l: 'A fazer', c: 'pill-gray' },
                    { n: doing, l: 'Fazendo', c: 'pill-blue' },
                    { n: done, l: 'Feitas', c: 'pill-green' },
                  ].map((s) => (
                    <div key={s.l} className={`rounded-md py-1.5 ${s.c}`}>
                      <div className="text-base font-semibold leading-none">{s.n}</div>
                      <div className="mt-0.5 text-[10px] font-medium opacity-80">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-3 flex h-6 items-center gap-1">
                  {projs.map((p) => (
                    <span key={p.id} title={p.nome} className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-sm">{p.emoji}</span>
                  ))}
                  {projs.length === 0 && <span className="text-xs text-muted-foreground">Sem projetos</span>}
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={() => abrir()}
          className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-card hover:text-foreground">
          <Plus className="h-5 w-5" />Adicionar membro
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-md" aria-describedby={undefined}>
          <DialogHeader><DialogTitle>{editing ? 'Editar membro' : 'Convidar membro'}</DialogTitle></DialogHeader>
          <form onSubmit={salvar} className="space-y-3">
            <div className="flex justify-center py-2"><Avatar name={form.nome || null} size={56} /></div>
            <Input placeholder="Nome completo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            <Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="Cargo (ex.: Desenvolvedora Frontend)" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">{editing ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
