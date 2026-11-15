const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');

// Obter estatísticas gerais
router.get('/stats', (req, res) => {
  try {
    const db = getDatabase();
    
    // Contadores gerais
    const stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM projetos) as total_projetos,
        (SELECT COUNT(*) FROM membros) as total_membros,
        (SELECT COUNT(*) FROM tarefas) as total_tarefas,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'A fazer') as tarefas_a_fazer,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'Em andamento') as tarefas_em_andamento,
        (SELECT COUNT(*) FROM tarefas WHERE status = 'Concluído') as tarefas_concluidas,
        (SELECT COUNT(*) FROM tarefas WHERE status != 'Concluído' AND data_entrega IS NOT NULL AND DATE(data_entrega) < DATE('now')) as tarefas_atrasadas
    `).get();
    
    // Tarefas por prioridade
    const prioridades = db.prepare(`
      SELECT prioridade, COUNT(*) as count
      FROM tarefas
      WHERE status != 'Concluído'
      GROUP BY prioridade
    `).all();
    
    res.json({
      ...stats,
      prioridades: {
        'Baixa': prioridades.find(p => p.prioridade === 'Baixa')?.count || 0,
        'Média': prioridades.find(p => p.prioridade === 'Média')?.count || 0,
        'Alta': prioridades.find(p => p.prioridade === 'Alta')?.count || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
