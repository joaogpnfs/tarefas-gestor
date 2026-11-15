import { Router, Request, Response } from 'express';
import { MembroModel } from '../models/Membro';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const membros = MembroModel.getAll();
    res.json(membros);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const membro = MembroModel.getWithTaskCount(id);
    
    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    
    res.json(membro);
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    res.status(500).json({ error: 'Erro ao buscar membro' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const membro = MembroModel.create(req.body);
    res.status(201).json(membro);
  } catch (error: any) {
    console.error('Erro ao criar membro:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar membro' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const membro = MembroModel.update(id, req.body);
    
    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    
    res.json(membro);
  } catch (error: any) {
    console.error('Erro ao atualizar membro:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar membro' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deleted = MembroModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    res.status(500).json({ error: 'Erro ao deletar membro' });
  }
});

export default router;
