const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');

// Listar todas as tarefas ou filtrar por projeto
router.get('/', (req, res) => {
  try {
    const { projeto_id, prioridade, responsavel_id, status } = req.query;
    
    if (projeto_id) {
      const filters = { prioridade, responsavel_id, status };
      const tarefas = Tarefa.getByProjeto(projeto_id, filters);
      return res.json(tarefas);
    }
    
    const tarefas = Tarefa.getAll();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Obter tarefas atrasadas
router.get('/atrasadas/lista', (req, res) => {
  try {
    const tarefas = Tarefa.getOverdue();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Obter tarefa por ID
router.get('/:id', (req, res) => {
  try {
    const tarefa = Tarefa.getById(req.params.id);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(tarefa);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Criar nova tarefa
router.post('/', (req, res) => {
  try {
    const tarefa = Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Atualizar tarefa
router.put('/:id', (req, res) => {
  try {
    const tarefa = Tarefa.update(req.params.id, req.body);
    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.json(tarefa);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Deletar tarefa
router.delete('/:id', (req, res) => {
  try {
    const deleted = Tarefa.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
