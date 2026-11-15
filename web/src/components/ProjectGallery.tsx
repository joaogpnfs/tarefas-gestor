import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useData } from '../lib/data'
import { coverCss } from '../lib/ui'
import { AvatarStack } from './Avatar'

export default function ProjectGallery({ limit }: { limit?: number }) {
  const { projetos, tarefas, setProjectDialogOpen } = useData()
  const list = limit ? projetos.slice(0, limit) : projetos
  return (
    <div className="grid grid-cols-4 gap-3">
      {list.map((p) => {
        const ts = tarefas.filter((t) => t.projeto_id === p.id)
        const done = ts.filter((t) => t.status === 'Concluído').length
        const pct = ts.length ? Math.round((done / ts.length) * 100) : 0
        const nomes = Array.from(new Set(ts.map((t) => t.responsavel_nome).filter(Boolean))) as string[]
        return (
          <Link key={p.id} to={`/projetos/${p.id}`}
            className="group overflow-hidden rounded-xl border bg-card shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="relative h-[84px]" style={{ background: coverCss(p.capa, p.cor) }}>
              <div className="cover-pattern absolute inset-0 opacity-70" />
            </div>
            <div className="px-3.5 pb-3.5">
              <div className="-mt-5 mb-1 text-[34px] leading-none drop-shadow-sm">{p.emoji}</div>
              <h3 className="truncate text-[15px] font-semibold">{p.nome}</h3>
              <p className="mt-0.5 line-clamp-2 h-9 text-xs leading-[18px] text-muted-foreground">{p.descricao}</p>
              <div className="mt-3 flex items-center justify-between">
                <AvatarStack names={nomes} size={22} max={4} />
                <span className="text-xs text-muted-foreground">{done}/{ts.length} · {pct}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.cor }} />
              </div>
            </div>
          </Link>
        )
      })}
      {!limit && (
        <button onClick={() => setProjectDialogOpen(true)}
          className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-card hover:text-foreground">
          <Plus className="h-5 w-5" /> Novo projeto
        </button>
      )}
    </div>
  )
}
