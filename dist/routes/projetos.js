"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Projeto_1 = require("../models/Projeto");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    try {
        const projetos = Projeto_1.ProjetoModel.getAll();
        res.json(projetos);
    }
    catch (error) {
        console.error('Erro ao buscar projetos:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const projeto = Projeto_1.ProjetoModel.getWithTaskCount(id);
        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }
        res.json(projeto);
    }
    catch (error) {
        console.error('Erro ao buscar projeto:', error);
        res.status(500).json({ error: 'Erro ao buscar projeto' });
    }
});
router.post('/', (req, res) => {
    try {
        const projeto = Projeto_1.ProjetoModel.create(req.body);
        res.status(201).json(projeto);
    }
    catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(400).json({ error: error.message || 'Erro ao criar projeto' });
    }
});
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const projeto = Projeto_1.ProjetoModel.update(id, req.body);
        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }
        res.json(projeto);
    }
    catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        res.status(400).json({ error: error.message || 'Erro ao atualizar projeto' });
    }
});
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deleted = Projeto_1.ProjetoModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar projeto:', error);
        res.status(500).json({ error: 'Erro ao deletar projeto' });
    }
});
exports.default = router;
