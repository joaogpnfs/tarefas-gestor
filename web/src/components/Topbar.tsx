import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Menu, Moon, Sun, Star, MessageSquare, Clock, Share2 } from 'lucide-react'
import { useData } from '../lib/data'
import { useTheme } from '../lib/theme'
import { Button } from './ui/button'

interface Crumb { label: string; to?: string; emoji?: string }

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation()
  const { projetos } = useData()
  const { theme, toggle } = useTheme()

  const crumbs: Crumb[] = [{ label: 'Taskora', to: '/', emoji: '✨' }]
  if (pathname === '/') crumbs.push({ label: 'Início', emoji: '🏠' })
  else if (pathname === '/tarefas') crumbs.push({ label: 'Todas as tarefas', emoji: '✅' })
  else if (pathname === '/minhas') crumbs.push({ label: 'Minhas tarefas', emoji: '📥' })
  else if (pathname === '/membros') crumbs.push({ label: 'Membros', emoji: '👥' })
  else if (pathname === '/projetos') crumbs.push({ label: 'Projetos', emoji: '🗂️' })
  else if (pathname.startsWith('/projetos/')) {
    const p = projetos.find((x) => String(x.id) === pathname.split('/')[2])
    crumbs.push({ label: 'Projetos', to: '/projetos', emoji: '🗂️' })
    crumbs.push({ label: p?.nome ?? '…', emoji: p?.emoji || '📁' })
  }

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-2 border-b border-transparent bg-background/80 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:h-11 md:gap-4 md:px-3">
      <div className="flex min-w-0 items-center gap-0.5">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="flex min-w-0 items-center gap-0.5 overflow-hidden text-sm">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <Fragment key={i}>
                {i > 0 && <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/60 md:block" />}
                {c.to && !last ? (
                  <Link to={c.to} className="hidden items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex">
                    {c.emoji && <span className="text-[13px]">{c.emoji}</span>}
                    {c.label}
                  </Link>
                ) : (
                  <span className="flex min-w-0 items-center gap-1.5 truncate px-1.5 py-0.5 font-medium">
                    {c.emoji && <span className="text-[13px]">{c.emoji}</span>}
                    <span className="truncate">{c.label}</span>
                  </span>
                )}
              </Fragment>
            )
          })}
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
        <span className="mr-2 hidden text-xs lg:inline">Editado agora</span>
        <Button variant="ghost" size="sm" className="hidden text-muted-foreground md:inline-flex"><Share2 />Compartilhar</Button>
        <Button variant="ghost" size="icon" className="hidden text-muted-foreground md:inline-flex" title="Comentários"><MessageSquare /></Button>
        <Button variant="ghost" size="icon" className="hidden text-muted-foreground md:inline-flex" title="Histórico"><Clock /></Button>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground md:h-8 md:w-8" title="Favoritar"><Star /></Button>
        <Button variant="ghost" size="icon" onClick={toggle} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'} className="h-10 w-10 text-muted-foreground md:h-8 md:w-8">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  )
}
