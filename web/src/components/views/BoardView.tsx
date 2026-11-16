import { useState } from 'react'
import {
  DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core'
import type { CollisionDetection, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'

/** Usa a posição do ponteiro e, se não houver colisão, a interseção dos retângulos. */
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  return hits.length > 0 ? hits : rectIntersection(args)
}
import { MoreHorizontal, Plus } from 'lucide-react'
import type { Tarefa } from '../../lib/api'
import { useData } from '../../lib/data'
import { cn } from '../../lib/utils'
import { STATUSES, STATUS_META } from '../../lib/ui'
import type { Status } from '../../lib/ui'
import TaskCard from '../TaskCard'

function DraggableCard({ tarefa }: { tarefa: Tarefa }) {
  const { openTask } = useData()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tarefa.id, data: { status: tarefa.status } })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => openTask(tarefa.id)}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg md:touch-none"
    >
      <TaskCard tarefa={tarefa} dragging={isDragging} />
    </div>
  )
}

const LANE_EMOJI: Record<Status, string> = { 'A fazer': '📝', 'Em andamento': '⚡', 'Concluído': '✅' }

function Lane({ status, tarefas, placeholderHeight, onAdd }: {
  status: Status
  tarefas: Tarefa[]
  placeholderHeight: number | null
  onAdd: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = STATUS_META[status]
  return (
    <div ref={setNodeRef} className={cn('flex max-h-full w-[85vw] shrink-0 snap-start flex-col rounded-xl transition-shadow md:w-[300px] md:snap-align-none', meta.lane, isOver && 'ring-2 ring-primary/40')}>
      <div className="flex items-center gap-2 px-3 pb-2 pt-3">
        <span className={cn('h-2.5 w-2.5 rounded-full', meta.accent)} />
        <span className="text-[13px] font-semibold">{LANE_EMOJI[status]} {status}</span>
        <span className="rounded-full bg-black/[0.06] px-1.5 text-[11px] font-semibold text-muted-foreground dark:bg-white/10">{tarefas.length}</span>
        <button className="ml-auto flex h-10 w-10 items-center justify-center rounded text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 md:h-auto md:w-auto md:p-1"><MoreHorizontal className="h-4 w-4" /></button>
        <button onClick={onAdd} className="flex h-10 w-10 items-center justify-center rounded text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 md:h-auto md:w-auto md:p-1"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="scrollbar-thin flex min-h-[60px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-1">
        {tarefas.map((t) => <DraggableCard key={t.id} tarefa={t} />)}
        {placeholderHeight !== null && (
          <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5" style={{ height: placeholderHeight }} />
        )}
      </div>
      <button onClick={onAdd}
        className="m-2 mt-1 flex min-h-10 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 md:min-h-0">
        <Plus className="h-4 w-4" /> Adicionar cartão
      </button>
    </div>
  )
}

export default function BoardView({ tarefas, projetoId }: { tarefas: Tarefa[]; projetoId?: number }) {
  const { updateTarefa, newTask } = useData()
  const [active, setActive] = useState<Tarefa | null>(null)
  const [activeHeight, setActiveHeight] = useState(90)
  const [over, setOver] = useState<Status | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const resolveStatus = (id: string | number | undefined | null): Status | null => {
    if (id == null) return null
    if (STATUSES.includes(id as Status)) return id as Status
    return tarefas.find((t) => t.id === id)?.status ?? null
  }

  const onStart = (e: DragStartEvent) => {
    setActive(tarefas.find((t) => t.id === e.active.id) ?? null)
    setActiveHeight(e.active.rect.current.initial?.height ?? 90)
  }
  const onOver = (e: DragOverEvent) => setOver(resolveStatus(e.over?.id))
  const onEnd = (e: DragEndEvent) => {
    const target = resolveStatus(e.over?.id)
    const t = tarefas.find((x) => x.id === e.active.id)
    if (t && target && t.status !== target) updateTarefa(t.id, { status: target })
    setActive(null)
    setOver(null)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collision} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd}
      onDragCancel={() => { setActive(null); setOver(null) }}>
      <div className="scrollbar-thin flex h-[calc(100dvh-14rem)] min-h-[360px] snap-x snap-mandatory items-start gap-3 overflow-x-auto overscroll-x-contain pb-4 md:h-[calc(100vh-120px)] md:min-h-[520px] md:snap-none">
        {STATUSES.map((s) => (
          <Lane
            key={s}
            status={s}
            tarefas={tarefas.filter((t) => t.status === s)}
            placeholderHeight={active && over === s && active.status !== s ? activeHeight : null}
            onAdd={() => newTask({ status: s, projeto_id: projetoId })}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        {active ? <div className="w-[min(284px,calc(85vw-16px))]"><TaskCard tarefa={active} overlay /></div> : null}
      </DragOverlay>
    </DndContext>
  )
}
