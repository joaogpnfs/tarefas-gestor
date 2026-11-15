"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoModel = void 0;
const connection_1 = require("../database/connection");
class ProjetoModel {
    static getAll() {
        const db = (0, connection_1.getDatabase)();
        return db.prepare('SELECT * FROM projetos ORDER BY criado_em DESC').all();
    }
    static getById(id) {
        const db = (0, connection_1.getDatabase)();
        return db.prepare('SELECT * FROM projetos WHERE id = ?').get(id);
    }
    static create(data) {
        const db = (0, connection_1.getDatabase)();
        const { nome, descricao, cor, emoji, capa, prazo } = data;
        if (!nome || nome.trim() === '') {
            throw new Error('Nome do projeto é obrigatório');
        }
        const stmt = db.prepare(`
      INSERT INTO projetos (nome, descricao, cor, emoji, capa, prazo)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(nome.trim(), descricao || null, cor || '#3B82F6', emoji || '📁', capa || null, prazo || null);
        return this.getById(result.lastInsertRowid);
    }
    static update(id, data) {
        const db = (0, connection_1.getDatabase)();
        const { nome, descricao, cor } = data;
        if (!nome || nome.trim() === '') {
            throw new Error('Nome do projeto é obrigatório');
        }
        const existing = this.getById(id);
        if (!existing)
            return undefined;
        // Campos opcionais: se não forem enviados, mantém o valor atual
        const emoji = data.emoji !== undefined ? data.emoji || '📁' : existing.emoji;
        const capa = data.capa !== undefined ? data.capa || null : existing.capa;
        const prazo = data.prazo !== undefined ? data.prazo || null : existing.prazo;
        const stmt = db.prepare(`
      UPDATE projetos 
      SET nome = ?, descricao = ?, cor = ?, emoji = ?, capa = ?, prazo = ?,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
        stmt.run(nome.trim(), descricao || null, cor || '#3B82F6', emoji, capa, prazo, id);
        return this.getById(id);
    }
    static delete(id) {
        const db = (0, connection_1.getDatabase)();
        const stmt = db.prepare('DELETE FROM projetos WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
    static getWithTaskCount(id) {
        const db = (0, connection_1.getDatabase)();
        const projeto = this.getById(id);
        if (!projeto)
            return null;
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
exports.ProjetoModel = ProjetoModel;
