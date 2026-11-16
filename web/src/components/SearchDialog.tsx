import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useData } from '../lib/data'
import { StatusPill } from './Pills'

export default function SearchDialog() {
  const { searchOpen, setSearchOpen, projetos, tarefas, openTask } = useData()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const ps = projetos.filter((p) => !term || p.nome.toLowerCase().includes(term)).slice(0, 5)
    const ts = tarefas
      .filter((t) => !term || t.titulo.toLowerCase().includes(term) || (t.etiquetas ?? '').toLowerCase().includes(term))
      .slice(0, 8)
    return { ps, ts }
  }, [q, projetos, tarefas])

  const close = () => { setSearchOpen(false); setQ('') }

  return (
    <DialogPrimitive.Root open={searchOpen} onOpenChange={(o) => (o ? setSearchOpen(true) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content aria-describedby={undefined}
          className="fixed inset-0 z-50 flex h-dvh w-full max-h-dvh max-w-none translate-x-0 flex-col overflow-hidden rounded-none border bg-popover shadow-pop data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] md:inset-auto md:left-1/2 md:top-[14vh] md:h-auto md:max-h-none md:w-[calc(100%-2rem)] md:max-w-[620px] md:-translate-x-1/2 md:rounded-xl">
          <DialogPrimitive.Title className="sr-only">Buscar</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar tarefas, projetos e etiquetas…"
              className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground" />
            <kbd className="rounded border px-1.5 text-[10px] text-muted-foreground">Esc</kbd>
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-2 md:max-h-[420px] md:flex-none">
            {results.ps.length > 0 && <div className="px-2 pb-1 pt-2 text-[11px] font-semibold text-muted-foreground">Projetos</div>}
            {results.ps.map((p) => (
              <button key={p.id} onClick={() => { navigate(`/projetos/${p.id}`); close() }}
                className="group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm hover:bg-accent">
                <span className="text-base">{p.emoji}</span>
                <span className="flex-1 truncate font-medium">{p.nome}</span>
                <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))}
            {results.ts.length > 0 && <div className="px-2 pb-1 pt-3 text-[11px] font-semibold text-muted-foreground">Tarefas</div>}
            {results.ts.map((t) => (
              <button key={t.id} onClick={() => { openTask(t.id); close() }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm hover:bg-accent">
                <span className="text-base">{t.projeto_emoji ?? '📄'}</span>
                <span className="flex-1 truncate">{t.titulo}</span>
                <StatusPill status={t.status} />
              </button>
            ))}
            {results.ps.length + results.ts.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">Nenhum resultado para “{q}”</div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
