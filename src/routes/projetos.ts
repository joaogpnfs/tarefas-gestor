import { Router, Request, Response } from 'express';
import { ProjetoModel } from '../models/Projeto';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const projetos = ProjetoModel.getAll();
    res.json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const projeto = ProjetoModel.getWithTaskCount(id);
    
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json(projeto);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const projeto = ProjetoModel.create(req.body);
    res.status(201).json(projeto);
  } catch (error: any) {
    console.error('Erro ao criar projeto:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar projeto' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const projeto = ProjetoModel.update(id, req.body);
    
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json(projeto);
  } catch (error: any) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar projeto' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deleted = ProjetoModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto' });
  }
});

export default router;
