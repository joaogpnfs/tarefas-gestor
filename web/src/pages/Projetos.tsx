import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Progress } from '../components/ui/progress'
import { api } from '../lib/api'
import type { Projeto } from '../lib/api'
import { toast } from 'sonner'

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ nome: '', descricao: '', cor: '#6366f1' })

  useEffect(() => {
    loadProjetos()
  }, [])

  async function loadProjetos() {
    try {
      const data = await api.projetos.getAll()
      const projetosWithStats = await Promise.all(
        data.map(async (p) => await api.projetos.getById(p.id))
      )
      setProjetos(projetosWithStats)
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      toast.error('Erro ao carregar projetos')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.projetos.create(formData)
      toast.success('Projeto criado com sucesso!')
      setOpen(false)
      setFormData({ nome: '', descricao: '', cor: '#6366f1' })
      loadProjetos()
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      toast.error('Erro ao criar projeto')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cor</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Criar Projeto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projetos.map((projeto) => {
          const total = projeto.stats?.total || 0
          const concluido = projeto.stats?.concluido || 0
          const progresso = total > 0 ? (concluido / total) * 100 : 0

          return (
            <Link key={projeto.id} to={`/projetos/${projeto.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: projeto.cor }}
                    />
                    <CardTitle>{projeto.nome}</CardTitle>
                  </div>
                  <CardDescription>{projeto.descricao || 'Sem descrição'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso</span>
                      <span className="font-medium">{Math.round(progresso)}%</span>
                    </div>
                    <Progress value={progresso} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">A fazer</p>
                      <p className="font-medium">{projeto.stats?.a_fazer || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Em andamento</p>
                      <p className="font-medium">{projeto.stats?.em_andamento || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Concluído</p>
                      <p className="font-medium">{projeto.stats?.concluido || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
