import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { api } from '../lib/api'
import { useData } from '../lib/data'
import { COVERS, EMOJIS, coverCss } from '../lib/ui'
import { cn } from '../lib/utils'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

const COLORS = ['#6366F1', '#F97316', '#0EA5E9', '#10B981', '#A855F7', '#EF4444', '#EC4899', '#64748B']

export default function ProjectDialog() {
  const { projectDialogOpen, setProjectDialogOpen, refresh } = useData()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [emoji, setEmoji] = useState('🚀')
  const [capa, setCapa] = useState('aurora')
  const [cor, setCor] = useState(COLORS[0])
  const [prazo, setPrazo] = useState('')

  const reset = () => { setNome(''); setDescricao(''); setEmoji('🚀'); setCapa('aurora'); setPrazo('') }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const p = await api.projetos.create({ nome, descricao, emoji, capa, cor, prazo: prazo || null })
      await refresh()
      toast.success('Projeto criado')
      setProjectDialogOpen(false)
      reset()
      navigate(`/projetos/${p.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar projeto')
    }
  }

  return (
    <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
      <DialogContent className="overflow-y-auto p-0 md:max-w-[560px] md:overflow-hidden" aria-describedby={undefined}>
        <form onSubmit={submit}>
          <div className="relative h-28" style={{ background: coverCss(capa, cor) }}>
            <div className="cover-pattern absolute inset-0 opacity-70" />
          </div>
          <div className="space-y-5 px-6 pb-6">
            <div className="-mt-9 flex h-16 w-16 items-center justify-center rounded-xl bg-card text-4xl shadow-card">{emoji}</div>
            <DialogTitle className="sr-only">Novo projeto</DialogTitle>
            <input
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do projeto"
              className="w-full bg-transparent text-2xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/40"
            />
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione uma descrição…"
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-muted-foreground outline-none"
            />
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">Ícone</div>
              <div className="flex flex-wrap gap-1">
                {EMOJIS.map((e) => (
                  <button type="button" key={e} onClick={() => setEmoji(e)}
                    className={cn('flex h-8 w-8 items-center justify-center rounded-md text-lg transition hover:bg-accent', emoji === e && 'bg-accent ring-2 ring-primary')}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">Capa</div>
              <div className="grid grid-cols-7 gap-1.5">
                {Object.entries(COVERS).map(([key, c]) => (
                  <button type="button" key={key} title={c.label} onClick={() => setCapa(key)}
                    className={cn('relative h-10 rounded-md transition hover:scale-105', capa === key && 'ring-2 ring-primary ring-offset-2 ring-offset-card')}
                    style={{ background: c.css }}>
                    {capa === key && <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">Cor</div>
                <div className="flex gap-1.5">
                  {COLORS.map((c) => (
                    <button type="button" key={c} onClick={() => setCor(c)}
                      className={cn('h-6 w-6 rounded-full transition hover:scale-110', cor === c && 'ring-2 ring-offset-2 ring-offset-card')}
                      style={{ background: c, ['--tw-ring-color' as string]: c }} />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">Prazo</div>
                <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)}
                  className="h-8 w-full rounded-md border bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => setProjectDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!nome.trim()}>Criar projeto</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
