import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { api } from '../lib/api'
import type { Membro } from '../lib/api'
import { toast } from 'sonner'

export default function Membros() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nome: '', email: '', cargo: '' })

  useEffect(() => {
    loadMembros()
  }, [])

  async function loadMembros() {
    try {
      const data = await api.membros.getAll()
      setMembros(data)
    } catch (error) {
      console.error('Erro ao carregar membros:', error)
      toast.error('Erro ao carregar membros')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await api.membros.update(editingId, formData)
        toast.success('Membro atualizado com sucesso!')
      } else {
        await api.membros.create(formData)
        toast.success('Membro criado com sucesso!')
      }
      setOpen(false)
      setEditingId(null)
      setFormData({ nome: '', email: '', cargo: '' })
      loadMembros()
    } catch (error) {
      console.error('Erro ao salvar membro:', error)
      toast.error('Erro ao salvar membro')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return
    try {
      await api.membros.delete(id)
      toast.success('Membro excluído com sucesso!')
      loadMembros()
    } catch (error) {
      console.error('Erro ao excluir membro:', error)
      toast.error('Erro ao excluir membro')
    }
  }

  function handleEdit(membro: Membro) {
    setEditingId(membro.id)
    setFormData({
      nome: membro.nome,
      email: membro.email,
      cargo: membro.cargo || '',
    })
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setEditingId(null)
    setFormData({ nome: '', email: '', cargo: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Membros</h1>
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Membro' : 'Criar Novo Membro'}
              </DialogTitle>
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
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? 'Atualizar' : 'Criar'} Membro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membros.map((membro) => (
              <TableRow key={membro.id}>
                <TableCell className="font-medium">{membro.nome}</TableCell>
                <TableCell>{membro.email}</TableCell>
                <TableCell>{membro.cargo || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(membro)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(membro.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
