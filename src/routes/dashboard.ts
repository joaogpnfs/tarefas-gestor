import { Router, Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { DashboardStats } from '../types';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const totais = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM projetos) as total_projetos,
        (SELECT COUNT(*) FROM membros) as total_membros,
        (SELECT COUNT(*) FROM tarefas) as total_tarefas,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'A fazer') as tarefas_a_fazer,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'Em andamento') as tarefas_em_andamento,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'Concluído') as tarefas_concluidas,
        (SELECT COUNT(*) FROM tarefas WHERE data_entrega < date('now') AND status != 'Concluído') as tarefas_atrasadas
    `).get() as any;
    
    const prioridades = db.prepare(`
      SELECT 
        prioridade,
        COUNT(*) as count
      FROM tarefas
      GROUP BY prioridade
    `).all() as Array<{ prioridade: string; count: number }>;
    
    const prioridadesMap = {
      Baixa: 0,
      Média: 0,
      Alta: 0
    };
    
    prioridades.forEach(p => {
      if (p.prioridade in prioridadesMap) {
        prioridadesMap[p.prioridade as keyof typeof prioridadesMap] = p.count;
      }
    });
    
    const stats: DashboardStats = {
      ...totais,
      prioridades: prioridadesMap
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;
