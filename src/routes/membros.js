const express = require('express');
const router = express.Router();
const Membro = require('../models/Membro');

// Listar todos os membros
router.get('/', (req, res) => {
  try {
    const membros = Membro.getAll();
    res.json(membros);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Obter membro por ID com estatísticas
router.get('/:id', (req, res) => {
  try {
    const membro = Membro.getWithTaskCount(req.params.id);
    if (!membro) {
      return res.status(404).json({ erro: 'Membro não encontrado' });
    }
    res.json(membro);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Criar novo membro
router.post('/', (req, res) => {
  try {
    const membro = Membro.create(req.body);
    res.status(201).json(membro);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Atualizar membro
router.put('/:id', (req, res) => {
  try {
    const membro = Membro.update(req.params.id, req.body);
    if (!membro) {
      return res.status(404).json({ erro: 'Membro não encontrado' });
    }
    res.json(membro);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Deletar membro
router.delete('/:id', (req, res) => {
  try {
    const deleted = Membro.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ erro: 'Membro não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
