import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import TaskModal from './TaskModal'
import ProjectDialog from './ProjectDialog'
import SearchDialog from './SearchDialog'
import { useData } from '../lib/data'

export default function Layout({ children }: { children: ReactNode }) {
  const { setSearchOpen } = useData()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <TaskModal />
      <ProjectDialog />
      <SearchDialog />
    </div>
  )
}
