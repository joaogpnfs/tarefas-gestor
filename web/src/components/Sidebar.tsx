import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown, ChevronRight, ChevronsUpDown, Home, CheckSquare, Users, Search, Plus, LayoutGrid,
  Settings, Inbox, X,
} from 'lucide-react'
import { useData } from '../lib/data'
import { cn } from '../lib/utils'
import { Avatar } from './Avatar'

function Logo() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#2383e2] to-[#7c5cff] text-[13px] font-bold text-white shadow-sm">
      T
    </span>
  )
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { projetos, tarefas, currentUser, setProjectDialogOpen, setSearchOpen } = useData()
  const [projectsOpen, setProjectsOpen] = useState(true)
  const location = useLocation()

  const minhas = tarefas.filter((t) => t.responsavel_id === currentUser?.id && t.status !== 'Concluído').length

  const nav = [
    { to: '/', label: 'Início', icon: Home, end: true },
    { to: '/tarefas', label: 'Todas as tarefas', icon: CheckSquare, badge: tarefas.filter((t) => t.status !== 'Concluído').length },
    { to: '/minhas', label: 'Minhas tarefas', icon: Inbox, badge: minhas },
    { to: '/projetos', label: 'Projetos', icon: LayoutGrid, end: true },
    { to: '/membros', label: 'Membros', icon: Users },
  ]

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-[248px] shrink-0 flex-col border-r bg-sidebar transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'md:sticky md:top-0 md:z-auto md:translate-x-0',
        )}
      >
        {/* Workspace switcher */}
        <div className="px-2 pt-2">
          <div className="flex items-center gap-1">
            <button className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-hover">
              <Logo />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold leading-tight">Taskora</div>
                <div className="truncate text-[11px] leading-tight text-muted-foreground">Equipe UniFil · Grátis</div>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-hover md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-0.5 px-2 pt-2">
          <button onClick={() => { setSearchOpen(true); onClose() }} className="nav-item">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Buscar</span>
            <kbd className="rounded border bg-card px-1 text-[10px] font-medium text-muted-foreground">Ctrl K</kbd>
          </button>
          <button className="nav-item">
            <Settings className="h-4 w-4" />
            <span className="flex-1 text-left">Configurações</span>
          </button>
        </div>

        <nav className="mt-3 space-y-0.5 px-2">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="block" onClick={onClose}>
                {({ isActive }) => (
                  <span className="nav-item" data-active={isActive}>
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {!!item.badge && (
                      <span className="rounded-full bg-sidebar-hover px-1.5 text-[11px] font-medium text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Projetos */}
        <div className="mt-5 flex min-h-0 flex-1 flex-col px-2">
          <div className="group flex items-center justify-between px-2 pb-1">
            <button
              onClick={() => setProjectsOpen((o) => !o)}
              className="flex min-h-10 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground md:min-h-0"
            >
              Projetos
              {projectsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            <button
              onClick={() => { setProjectDialogOpen(true); onClose() }}
              title="Novo projeto"
              className="flex h-10 w-10 items-center justify-center rounded text-muted-foreground transition hover:bg-sidebar-hover md:h-auto md:w-auto md:p-0.5 md:opacity-0 md:group-hover:opacity-100"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {projectsOpen && (
            <div className="scrollbar-thin -mr-1 min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
              {projetos.map((p) => {
                const count = tarefas.filter((t) => t.projeto_id === p.id && t.status !== 'Concluído').length
                const active = location.pathname === `/projetos/${p.id}`
                return (
                  <NavLink key={p.id} to={`/projetos/${p.id}`} className="block" onClick={onClose}>
                    <span className="nav-item group/item" data-active={active}>
                      <span className="flex h-5 w-5 items-center justify-center text-[15px] leading-none">{p.emoji || '📁'}</span>
                      <span className="flex-1 truncate">{p.nome}</span>
                      <span className="text-[11px] text-muted-foreground/80">{count || ''}</span>
                    </span>
                  </NavLink>
                )
              })}
              <button onClick={() => { setProjectDialogOpen(true); onClose() }} className="nav-item text-muted-foreground">
                <Plus className="h-4 w-4" />
                Novo projeto
              </button>
            </div>
          )}
        </div>

        {/* Usuário */}
        <div className={cn('border-t p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]')}>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Avatar name={currentUser?.nome ?? 'João Feitosa'} size={26} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium leading-tight">{currentUser?.nome ?? 'João Feitosa'}</div>
              <div className="truncate text-[11px] leading-tight text-muted-foreground">{currentUser?.cargo ?? 'Líder técnico'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
