import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Moon, Sun, Star, MessageSquare, Clock, Share2 } from 'lucide-react'
import { useData } from '../lib/data'
import { useTheme } from '../lib/theme'
import { Button } from './ui/button'

interface Crumb { label: string; to?: string; emoji?: string }

export default function Topbar() {
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
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between gap-4 border-b border-transparent bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="flex min-w-0 items-center gap-0.5 text-sm">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="flex items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                {c.emoji && <span className="text-[13px]">{c.emoji}</span>}
                {c.label}
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 truncate px-1.5 py-0.5 font-medium">
                {c.emoji && <span className="text-[13px]">{c.emoji}</span>}
                {c.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
      <div className="flex items-center gap-0.5 text-muted-foreground">
        <span className="mr-2 hidden text-xs lg:inline">Editado agora</span>
        <Button variant="ghost" size="sm" className="text-muted-foreground"><Share2 />Compartilhar</Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground" title="Comentários"><MessageSquare /></Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground" title="Histórico"><Clock /></Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground" title="Favoritar"><Star /></Button>
        <Button variant="ghost" size="icon" onClick={toggle} title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'} className="text-muted-foreground">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  )
}
