const { getDatabase } = require('../database/connection');

class Tarefa {
  static getAll() {
    const db = getDatabase();
    return db.prepare(`
      SELECT t.*, p.nome as projeto_nome, m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      ORDER BY t.criado_em DESC
    `).all();
  }

  static getById(id) {
    const db = getDatabase();
    return db.prepare(`
      SELECT t.*, p.nome as projeto_nome, m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.id = ?
    `).get(id);
  }

  static getByProjeto(projetoId, filters = {}) {
    const db = getDatabase();
    let query = `
      SELECT t.*, m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.projeto_id = ?
    `;
    
    const params = [projetoId];
    
    if (filters.prioridade) {
      query += ' AND t.prioridade = ?';
      params.push(filters.prioridade);
    }
    
    if (filters.responsavel_id) {
      query += ' AND t.responsavel_id = ?';
      params.push(filters.responsavel_id);
    }
    
    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }
    
    query += ' ORDER BY t.criado_em DESC';
    
    return db.prepare(query).all(...params);
  }

  static create(data) {
    const db = getDatabase();
    const { projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega } = data;
    
    if (!projeto_id) {
      throw new Error('ID do projeto é obrigatório');
    }
    
    if (!titulo || titulo.trim() === '') {
      throw new Error('Título da tarefa é obrigatório');
    }
    
    const validStatus = ['A fazer', 'Em andamento', 'Concluído'];
    if (status && !validStatus.includes(status)) {
      throw new Error('Status inválido');
    }
    
    const validPrioridade = ['Baixa', 'Média', 'Alta'];
    if (prioridade && !validPrioridade.includes(prioridade)) {
      throw new Error('Prioridade inválida');
    }
    
    const stmt = db.prepare(`
      INSERT INTO tarefas (projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      projeto_id,
      titulo.trim(),
      descricao || null,
      status || 'A fazer',
      prioridade || 'Média',
      responsavel_id || null,
      data_entrega || null
    );
    
    return this.getById(result.lastInsertRowid);
  }

  static update(id, data) {
    const db = getDatabase();
    const { titulo, descricao, status, prioridade, responsavel_id, data_entrega } = data;
    
    if (!titulo || titulo.trim() === '') {
      throw new Error('Título da tarefa é obrigatório');
    }
    
    const validStatus = ['A fazer', 'Em andamento', 'Concluído'];
    if (status && !validStatus.includes(status)) {
      throw new Error('Status inválido');
    }
    
    const validPrioridade = ['Baixa', 'Média', 'Alta'];
    if (prioridade && !validPrioridade.includes(prioridade)) {
      throw new Error('Prioridade inválida');
    }
    
    const stmt = db.prepare(`
      UPDATE tarefas 
      SET titulo = ?, descricao = ?, status = ?, prioridade = ?, 
          responsavel_id = ?, data_entrega = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      titulo.trim(),
      descricao || null,
      status || 'A fazer',
      prioridade || 'Média',
      responsavel_id || null,
      data_entrega || null,
      id
    );
    
    return this.getById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM tarefas WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getOverdue() {
    const db = getDatabase();
    return db.prepare(`
      SELECT t.*, p.nome as projeto_nome, m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.status != 'Concluído' 
        AND t.data_entrega IS NOT NULL 
        AND DATE(t.data_entrega) < DATE('now')
      ORDER BY t.data_entrega ASC
    `).all();
  }
}

module.exports = Tarefa;
