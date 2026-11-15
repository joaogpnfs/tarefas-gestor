import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { api } from '../lib/api'
import type { Tarefa, Projeto, Membro } from '../lib/api'

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [membros, setMembros] = useState<Membro[]>([])
  const [filters, setFilters] = useState({
    projeto_id: '',
    status: '',
    prioridade: '',
    responsavel_id: '',
  })

  useEffect(() => {
    loadData()
  }, [filters])

  async function loadData() {
    try {
      const cleanFilters: Record<string, string | number> = {}
      if (filters.projeto_id) cleanFilters.projeto_id = Number(filters.projeto_id)
      if (filters.status) cleanFilters.status = filters.status
      if (filters.prioridade) cleanFilters.prioridade = filters.prioridade
      if (filters.responsavel_id) cleanFilters.responsavel_id = Number(filters.responsavel_id)

      const [tarefasData, projetosData, membrosData] = await Promise.all([
        api.tarefas.getAll(cleanFilters),
        api.projetos.getAll(),
        api.membros.getAll(),
      ])

      setTarefas(tarefasData)
      setProjetos(projetosData)
      setMembros(membrosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const statusCor = {
    'A fazer': 'secondary',
    'Em andamento': 'default',
    'Concluído': 'outline',
  } as const

  const prioridadeCor = {
    'Baixa': 'secondary',
    'Média': 'default',
    'Alta': 'destructive',
  } as const

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tarefas</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Projeto</label>
              <Select value={filters.projeto_id} onValueChange={(v) => setFilters({ ...filters, projeto_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {projetos.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="A fazer">A fazer</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Prioridade</label>
              <Select value={filters.prioridade} onValueChange={(v) => setFilters({ ...filters, prioridade: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Responsável</label>
              <Select value={filters.responsavel_id} onValueChange={(v) => setFilters({ ...filters, responsavel_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {membros.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Entrega</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarefas.map((tarefa) => (
              <TableRow key={tarefa.id}>
                <TableCell className="font-medium">{tarefa.titulo}</TableCell>
                <TableCell>{tarefa.projeto_nome}</TableCell>
                <TableCell>
                  <Badge variant={statusCor[tarefa.status]}>{tarefa.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={prioridadeCor[tarefa.prioridade]}>{tarefa.prioridade}</Badge>
                </TableCell>
                <TableCell>{tarefa.responsavel_nome || '-'}</TableCell>
                <TableCell>
                  {tarefa.data_entrega
                    ? new Date(tarefa.data_entrega).toLocaleDateString('pt-BR')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
