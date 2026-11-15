import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { api } from './api'
import type { Membro, Projeto, Tarefa } from './api'
import { CURRENT_USER_FIRST_NAME } from './ui'

type TaskDraft = Partial<Tarefa>

interface DataContextValue {
  projetos: Projeto[]
  membros: Membro[]
  tarefas: Tarefa[]
  loading: boolean
  currentUser: Membro | null
  refresh: () => Promise<void>
  updateTarefa: (id: number, data: Partial<Tarefa>) => Promise<void>
  createTarefa: (data: Partial<Tarefa>) => Promise<Tarefa | undefined>
  deleteTarefa: (id: number) => Promise<void>
  updateProjeto: (id: number, data: Partial<Projeto>) => Promise<void>
  /* Modais globais */
  openTaskId: number | null
  taskDraft: TaskDraft | null
  openTask: (id: number) => void
  newTask: (defaults?: TaskDraft) => void
  closeTask: () => void
  projectDialogOpen: boolean
  setProjectDialogOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [membros, setMembros] = useState<Membro[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [openTaskId, setOpenTaskId] = useState<number | null>(null)
  const [taskDraft, setTaskDraft] = useState<TaskDraft | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [p, m, t] = await Promise.all([api.projetos.getAll(), api.membros.getAll(), api.tarefas.getAll()])
      setProjetos([...p].sort((a, b) => a.id - b.id))
      setMembros(m)
      setTarefas(t)
    } catch {
      toast.error('Não foi possível carregar os dados')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateTarefa = useCallback(async (id: number, data: Partial<Tarefa>) => {
    const previous = tarefas
    setTarefas((ts) => ts.map((t) => (t.id === id ? { ...t, ...data } : t)))
    try {
      const updated = await api.tarefas.update(id, data)
      setTarefas((ts) => ts.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setTarefas(previous)
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar tarefa')
    }
  }, [tarefas])

  const createTarefa = useCallback(async (data: Partial<Tarefa>) => {
    try {
      const created = await api.tarefas.create(data)
      setTarefas((ts) => [created, ...ts])
      toast.success('Cartão criado')
      return created
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar tarefa')
      return undefined
    }
  }, [])

  const deleteTarefa = useCallback(async (id: number) => {
    try {
      await api.tarefas.delete(id)
      setTarefas((ts) => ts.filter((t) => t.id !== id))
      toast.success('Tarefa excluída')
    } catch {
      toast.error('Erro ao excluir tarefa')
    }
  }, [])

  const updateProjeto = useCallback(async (id: number, data: Partial<Projeto>) => {
    const current = projetos.find((p) => p.id === id)
    if (!current) return
    const payload = { nome: current.nome, descricao: current.descricao ?? '', cor: current.cor, ...data }
    setProjetos((ps) => ps.map((p) => (p.id === id ? { ...p, ...payload } : p)))
    try {
      const updated = await api.projetos.update(id, payload)
      setProjetos((ps) => ps.map((p) => (p.id === id ? { ...p, ...updated } : p)))
      if (data.nome !== undefined) {
        setTarefas((ts) => ts.map((t) => (t.projeto_id === id ? { ...t, projeto_nome: updated.nome } : t)))
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar projeto')
      refresh()
    }
  }, [projetos, refresh])

  const currentUser = useMemo(
    () => membros.find((m) => m.nome.startsWith(CURRENT_USER_FIRST_NAME)) ?? null,
    [membros],
  )

  const value: DataContextValue = {
    projetos, membros, tarefas, loading, currentUser, refresh,
    updateTarefa, createTarefa, deleteTarefa, updateProjeto,
    openTaskId, taskDraft,
    openTask: (id) => { setTaskDraft(null); setOpenTaskId(id) },
    newTask: (defaults = {}) => { setOpenTaskId(null); setTaskDraft(defaults) },
    closeTask: () => { setOpenTaskId(null); setTaskDraft(null) },
    projectDialogOpen, setProjectDialogOpen,
    searchOpen, setSearchOpen,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider')
  return ctx
}
