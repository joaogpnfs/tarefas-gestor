"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarefaModel = void 0;
const connection_1 = require("../database/connection");
class TarefaModel {
    static getAll(filters = {}) {
        const db = (0, connection_1.getDatabase)();
        let query = `
      SELECT t.*, 
             p.nome as projeto_nome,
             m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE 1=1
    `;
        const params = [];
        if (filters.projeto_id) {
            query += ' AND t.projeto_id = ?';
            params.push(filters.projeto_id);
        }
        if (filters.responsavel_id) {
            query += ' AND t.responsavel_id = ?';
            params.push(filters.responsavel_id);
        }
        if (filters.status) {
            query += ' AND t.status = ?';
            params.push(filters.status);
        }
        if (filters.prioridade) {
            query += ' AND t.prioridade = ?';
            params.push(filters.prioridade);
        }
        query += ' ORDER BY t.criado_em DESC';
        return db.prepare(query).all(...params);
    }
    static getById(id) {
        const db = (0, connection_1.getDatabase)();
        return db.prepare(`
      SELECT t.*, 
             p.nome as projeto_nome,
             m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.id = ?
    `).get(id);
    }
    static create(data) {
        const db = (0, connection_1.getDatabase)();
        const { projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega } = data;
        if (!titulo || titulo.trim() === '') {
            throw new Error('Título da tarefa é obrigatório');
        }
        if (!projeto_id) {
            throw new Error('Projeto é obrigatório');
        }
        const stmt = db.prepare(`
      INSERT INTO tarefas (projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(projeto_id, titulo.trim(), descricao || null, status || 'A fazer', prioridade || 'Média', responsavel_id || null, data_entrega || null);
        return this.getById(result.lastInsertRowid);
    }
    static update(id, data) {
        const db = (0, connection_1.getDatabase)();
        const existing = this.getById(id);
        if (!existing)
            return undefined;
        const updates = [];
        const params = [];
        if (data.titulo !== undefined) {
            if (!data.titulo || data.titulo.trim() === '') {
                throw new Error('Título da tarefa é obrigatório');
            }
            updates.push('titulo = ?');
            params.push(data.titulo.trim());
        }
        if (data.descricao !== undefined) {
            updates.push('descricao = ?');
            params.push(data.descricao || null);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            params.push(data.status);
        }
        if (data.prioridade !== undefined) {
            updates.push('prioridade = ?');
            params.push(data.prioridade);
        }
        if (data.responsavel_id !== undefined) {
            updates.push('responsavel_id = ?');
            params.push(data.responsavel_id);
        }
        if (data.data_entrega !== undefined) {
            updates.push('data_entrega = ?');
            params.push(data.data_entrega);
        }
        if (updates.length === 0)
            return existing;
        updates.push('atualizado_em = CURRENT_TIMESTAMP');
        params.push(id);
        const query = `UPDATE tarefas SET ${updates.join(', ')} WHERE id = ?`;
        db.prepare(query).run(...params);
        return this.getById(id);
    }
    static delete(id) {
        const db = (0, connection_1.getDatabase)();
        const stmt = db.prepare('DELETE FROM tarefas WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
}
exports.TarefaModel = TarefaModel;
