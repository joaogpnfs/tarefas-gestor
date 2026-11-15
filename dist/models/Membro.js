"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembroModel = void 0;
const connection_1 = require("../database/connection");
class MembroModel {
    static getAll() {
        const db = (0, connection_1.getDatabase)();
        return db.prepare('SELECT * FROM membros ORDER BY nome').all();
    }
    static getById(id) {
        const db = (0, connection_1.getDatabase)();
        return db.prepare('SELECT * FROM membros WHERE id = ?').get(id);
    }
    static create(data) {
        const db = (0, connection_1.getDatabase)();
        const { nome, email, cargo } = data;
        if (!nome || nome.trim() === '') {
            throw new Error('Nome do membro é obrigatório');
        }
        if (!email || email.trim() === '') {
            throw new Error('Email do membro é obrigatório');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new Error('Email inválido');
        }
        const stmt = db.prepare(`
      INSERT INTO membros (nome, email, cargo)
      VALUES (?, ?, ?)
    `);
        const result = stmt.run(nome.trim(), email.trim(), cargo || null);
        return this.getById(result.lastInsertRowid);
    }
    static update(id, data) {
        const db = (0, connection_1.getDatabase)();
        const { nome, email, cargo } = data;
        if (!nome || nome.trim() === '') {
            throw new Error('Nome do membro é obrigatório');
        }
        if (!email || email.trim() === '') {
            throw new Error('Email do membro é obrigatório');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new Error('Email inválido');
        }
        const stmt = db.prepare(`
      UPDATE membros 
      SET nome = ?, email = ?, cargo = ?
      WHERE id = ?
    `);
        stmt.run(nome.trim(), email.trim(), cargo || null, id);
        return this.getById(id);
    }
    static delete(id) {
        const db = (0, connection_1.getDatabase)();
        const stmt = db.prepare('DELETE FROM membros WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
    static getWithTaskCount(id) {
        const db = (0, connection_1.getDatabase)();
        const membro = this.getById(id);
        if (!membro)
            return null;
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
exports.MembroModel = MembroModel;
