const { getDatabase } = require('../database/connection');

class Projeto {
  static getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM projetos ORDER BY criado_em DESC').all();
  }

  static getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM projetos WHERE id = ?').get(id);
  }

  static create(data) {
    const db = getDatabase();
    const { nome, descricao, cor } = data;
    
    if (!nome || nome.trim() === '') {
      throw new Error('Nome do projeto é obrigatório');
    }
    
    const stmt = db.prepare(`
      INSERT INTO projetos (nome, descricao, cor)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(nome.trim(), descricao || null, cor || '#3B82F6');
    return this.getById(result.lastInsertRowid);
  }

  static update(id, data) {
    const db = getDatabase();
    const { nome, descricao, cor } = data;
    
    if (!nome || nome.trim() === '') {
      throw new Error('Nome do projeto é obrigatório');
    }
    
    const stmt = db.prepare(`
      UPDATE projetos 
      SET nome = ?, descricao = ?, cor = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(nome.trim(), descricao || null, cor || '#3B82F6', id);
    return this.getById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM projetos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getWithTaskCount(id) {
    const db = getDatabase();
    const projeto = this.getById(id);
    if (!projeto) return null;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'A fazer' THEN 1 ELSE 0 END) as a_fazer,
        SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN status = 'Concluído' THEN 1 ELSE 0 END) as concluido
      FROM tarefas
      WHERE projeto_id = ?
    `).get(id);
    
    return { ...projeto, stats };
  }
}

module.exports = Projeto;
