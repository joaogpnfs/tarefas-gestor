import { useData } from '../lib/data'
import ProjectGallery from '../components/ProjectGallery'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'

export default function Projetos() {
  const { projetos, setProjectDialogOpen } = useData()
  return (
    <div className="mx-auto max-w-[1120px] animate-fade-up px-10 pb-16 pt-10">
      <div className="text-5xl">🗂️</div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight">Projetos</h1>
          <p className="text-[15px] text-muted-foreground">{projetos.length} projetos no espaço de trabalho da equipe.</p>
        </div>
        <Button onClick={() => setProjectDialogOpen(true)}><Plus />Novo projeto</Button>
      </div>
      <div className="mt-6"><ProjectGallery /></div>
    </div>
  )
}
