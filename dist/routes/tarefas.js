"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Tarefa_1 = require("../models/Tarefa");
const router = (0, express_1.Router)();
router.get('/atrasadas/lista', (_req, res) => {
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
    }
    catch (error) {
        console.error('Erro ao buscar tarefas atrasadas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas atrasadas' });
    }
});
router.get('/', (req, res) => {
    try {
        const filters = {};
        if (req.query.projeto_id) {
            filters.projeto_id = parseInt(req.query.projeto_id);
        }
        if (req.query.responsavel_id) {
            filters.responsavel_id = parseInt(req.query.responsavel_id);
        }
        if (req.query.status) {
            filters.status = req.query.status;
        }
        if (req.query.prioridade) {
            filters.prioridade = req.query.prioridade;
        }
        const tarefas = Tarefa_1.TarefaModel.getAll(filters);
        res.json(tarefas);
    }
    catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const tarefa = Tarefa_1.TarefaModel.getById(id);
        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json(tarefa);
    }
    catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});
router.post('/', (req, res) => {
    try {
        const tarefa = Tarefa_1.TarefaModel.create(req.body);
        res.status(201).json(tarefa);
    }
    catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(400).json({ error: error.message || 'Erro ao criar tarefa' });
    }
});
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const tarefa = Tarefa_1.TarefaModel.update(id, req.body);
        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json(tarefa);
    }
    catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(400).json({ error: error.message || 'Erro ao atualizar tarefa' });
    }
});
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deleted = Tarefa_1.TarefaModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});
exports.default = router;
