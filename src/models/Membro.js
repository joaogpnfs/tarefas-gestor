const { getDatabase } = require('../database/connection');

class Membro {
  static getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM membros ORDER BY nome ASC').all();
  }

  static getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM membros WHERE id = ?').get(id);
  }

  static create(data) {
    const db = getDatabase();
    const { nome, email, cargo } = data;
    
    if (!nome || nome.trim() === '') {
      throw new Error('Nome do membro é obrigatório');
    }
    
    if (!email || email.trim() === '') {
      throw new Error('Email é obrigatório');
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Email inválido');
    }
    
    try {
      const stmt = db.prepare(`
        INSERT INTO membros (nome, email, cargo)
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(nome.trim(), email.trim().toLowerCase(), cargo || null);
      return this.getById(result.lastInsertRowid);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email já cadastrado');
      }
      throw error;
    }
  }

  static update(id, data) {
    const db = getDatabase();
    const { nome, email, cargo } = data;
    
    if (!nome || nome.trim() === '') {
      throw new Error('Nome do membro é obrigatório');
    }
    
    if (!email || email.trim() === '') {
      throw new Error('Email é obrigatório');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Email inválido');
    }
    
    try {
      const stmt = db.prepare(`
        UPDATE membros 
        SET nome = ?, email = ?, cargo = ?
        WHERE id = ?
      `);
      
      stmt.run(nome.trim(), email.trim().toLowerCase(), cargo || null, id);
      return this.getById(id);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email já cadastrado');
      }
      throw error;
    }
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM membros WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getWithTaskCount(id) {
    const db = getDatabase();
    const membro = this.getById(id);
    if (!membro) return null;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_tarefas,
        SUM(CASE WHEN status = 'A fazer' THEN 1 ELSE 0 END) as a_fazer,
        SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN status = 'Concluído' THEN 1 ELSE 0 END) as concluido
      FROM tarefas
      WHERE responsavel_id = ?
    `).get(id);
    
    return { ...membro, stats };
  }
}

module.exports = Membro;
