import { Router, Request, Response } from 'express';
import { TarefaModel } from '../models/Tarefa';

const router = Router();

router.get('/atrasadas/lista', (_req: Request, res: Response) => {
  try {
    const { getDatabase } = require('../database/connection');
    const db = getDatabase();
    const tarefas = db.prepare(`
      SELECT t.*, 
             p.nome as projeto_nome,
             m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.data_entrega < date('now') AND t.status != 'Concluído'
      ORDER BY t.data_entrega ASC
    `).all();
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao buscar tarefas atrasadas:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas atrasadas' });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const filters: any = {};
    
    if (req.query.projeto_id) {
      filters.projeto_id = parseInt(req.query.projeto_id as string);
    }
    
    if (req.query.responsavel_id) {
      filters.responsavel_id = parseInt(req.query.responsavel_id as string);
    }
    
    if (req.query.status) {
      filters.status = req.query.status as string;
    }
    
    if (req.query.prioridade) {
      filters.prioridade = req.query.prioridade as string;
    }
    
    const tarefas = TarefaModel.getAll(filters);
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const tarefa = TarefaModel.getById(id);
    
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(tarefa);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const tarefa = TarefaModel.create(req.body);
    res.status(201).json(tarefa);
  } catch (error: any) {
    console.error('Erro ao criar tarefa:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar tarefa' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const tarefa = TarefaModel.update(id, req.body);
    
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(tarefa);
  } catch (error: any) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar tarefa' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const deleted = TarefaModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

export default router;
