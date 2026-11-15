"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Membro_1 = require("../models/Membro");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    try {
        const membros = Membro_1.MembroModel.getAll();
        res.json(membros);
    }
    catch (error) {
        console.error('Erro ao buscar membros:', error);
        res.status(500).json({ error: 'Erro ao buscar membros' });
    }
});
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const membro = Membro_1.MembroModel.getWithTaskCount(id);
        if (!membro) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }
        res.json(membro);
    }
    catch (error) {
        console.error('Erro ao buscar membro:', error);
        res.status(500).json({ error: 'Erro ao buscar membro' });
    }
});
router.post('/', (req, res) => {
    try {
        const membro = Membro_1.MembroModel.create(req.body);
        res.status(201).json(membro);
    }
    catch (error) {
        console.error('Erro ao criar membro:', error);
        res.status(400).json({ error: error.message || 'Erro ao criar membro' });
    }
});
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const membro = Membro_1.MembroModel.update(id, req.body);
        if (!membro) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }
        res.json(membro);
    }
    catch (error) {
        console.error('Erro ao atualizar membro:', error);
        res.status(400).json({ error: error.message || 'Erro ao atualizar membro' });
    }
});
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(String(req.params.id));
        const deleted = Membro_1.MembroModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Membro não encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Erro ao deletar membro:', error);
        res.status(500).json({ error: 'Erro ao deletar membro' });
    }
});
exports.default = router;
