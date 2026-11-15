import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { api } from '../lib/api'
import type { Projeto, Tarefa } from '../lib/api'
import { toast } from 'sonner'

function KanbanCard({ tarefa }: { tarefa: Tarefa }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tarefa.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const prioridadeCor = {
    'Baixa': 'secondary',
    'Média': 'default',
    'Alta': 'destructive',
  } as const

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
    >
      <h4 className="font-medium mb-2">{tarefa.titulo}</h4>
      {tarefa.descricao && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{tarefa.descricao}</p>
      )}
      <div className="flex items-center justify-between">
        <Badge variant={prioridadeCor[tarefa.prioridade]}>
          {tarefa.prioridade}
        </Badge>
        {tarefa.responsavel_nome && (
          <span className="text-xs text-muted-foreground">{tarefa.responsavel_nome}</span>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({ titulo, tarefas }: { titulo: string; tarefas: Tarefa[] }) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-base">{titulo} ({tarefas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext items={tarefas.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tarefas.map((tarefa) => (
              <KanbanCard key={tarefa.id} tarefa={tarefa} />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  )
}

export default function ProjetoDetail() {
  const { id } = useParams<{ id: string }>()
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [activeTarefa, setActiveTarefa] = useState<Tarefa | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    try {
      const projetoData = await api.projetos.getById(Number(id))
      setProjeto(projetoData)
      const tarefasData = await api.tarefas.getAll({ projeto_id: Number(id) })
      setTarefas(tarefasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const tarefa = tarefas.find(t => t.id === event.active.id)
    if (tarefa) setActiveTarefa(tarefa)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTarefa(null)
    const { active, over } = event

    if (!over) return

    const tarefaId = active.id as number
    const overColumn = (over.data.current as any)?.sortable?.containerId || over.id

    let newStatus: 'A fazer' | 'Em andamento' | 'Concluído'
    if (typeof overColumn === 'string' && overColumn.includes('a-fazer')) {
      newStatus = 'A fazer'
    } else if (typeof overColumn === 'string' && overColumn.includes('andamento')) {
      newStatus = 'Em andamento'
    } else {
      newStatus = 'Concluído'
    }

    try {
      await api.tarefas.update(tarefaId, { status: newStatus })
      loadData()
      toast.success('Tarefa atualizada!')
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      toast.error('Erro ao atualizar tarefa')
    }
  }

  if (!projeto) return <div>Carregando...</div>

  const tarefasAFazer = tarefas.filter(t => t.status === 'A fazer')
  const tarefasEmAndamento = tarefas.filter(t => t.status === 'Em andamento')
  const tarefasConcluidas = tarefas.filter(t => t.status === 'Concluído')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: projeto.cor }} />
        <h1 className="text-3xl font-bold">{projeto.nome}</h1>
      </div>
      {projeto.descricao && (
        <p className="text-muted-foreground">{projeto.descricao}</p>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4">
          <div id="a-fazer" className="flex-1">
            <KanbanColumn titulo="A fazer" tarefas={tarefasAFazer} />
          </div>
          <div id="em-andamento" className="flex-1">
            <KanbanColumn titulo="Em andamento" tarefas={tarefasEmAndamento} />
          </div>
          <div id="concluido" className="flex-1">
            <KanbanColumn titulo="Concluído" tarefas={tarefasConcluidas} />
          </div>
        </div>

        <DragOverlay>
          {activeTarefa && <KanbanCard tarefa={activeTarefa} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
