const express = require('express');
const router = express.Router();
const Projeto = require('../models/Projeto');

// Listar todos os projetos
router.get('/', (req, res) => {
  try {
    const projetos = Projeto.getAll();
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Obter projeto por ID com estatísticas
router.get('/:id', (req, res) => {
  try {
    const projeto = Projeto.getWithTaskCount(req.params.id);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }
    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Criar novo projeto
router.post('/', (req, res) => {
  try {
    const projeto = Projeto.create(req.body);
    res.status(201).json(projeto);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Atualizar projeto
router.put('/:id', (req, res) => {
  try {
    const projeto = Projeto.update(req.params.id, req.body);
    if (!projeto) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }
    res.json(projeto);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Deletar projeto
router.delete('/:id', (req, res) => {
  try {
    const deleted = Projeto.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ erro: 'Projeto não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
