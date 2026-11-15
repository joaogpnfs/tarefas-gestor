import { getDatabase } from '../database/connection';
import { Tarefa, TarefaInput } from '../types';

/** Normaliza etiquetas recebidas como array ou texto separado por vírgulas. */
export function normalizeEtiquetas(value: string | string[] | undefined | null): string {
  if (!value) return '';
  const list = Array.isArray(value) ? value : String(value).split(',');
  return Array.from(new Set(list.map((e) => String(e).trim()).filter(Boolean))).join(',');
}

function toCount(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

interface TarefaFilters {
  projeto_id?: number;
  responsavel_id?: number;
  status?: string;
  prioridade?: string;
}

export class TarefaModel {
  static getAll(filters: TarefaFilters = {}): Tarefa[] {
    const db = getDatabase();
    let query = `
      SELECT t.*, 
             p.nome as projeto_nome,
             p.emoji as projeto_emoji,
             p.cor as projeto_cor,
             m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
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
    
    return db.prepare(query).all(...params) as Tarefa[];
  }

  static getById(id: number): Tarefa | undefined {
    const db = getDatabase();
    return db.prepare(`
      SELECT t.*, 
             p.nome as projeto_nome,
             p.emoji as projeto_emoji,
             p.cor as projeto_cor,
             m.nome as responsavel_nome
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN membros m ON t.responsavel_id = m.id
      WHERE t.id = ?
    `).get(id) as Tarefa | undefined;
  }

  static create(data: TarefaInput & { projeto_id: number; titulo: string }): Tarefa {
    const db = getDatabase();
    const { projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega } = data;
    
    if (!titulo || titulo.trim() === '') {
      throw new Error('Título da tarefa é obrigatório');
    }
    
    if (!projeto_id) {
      throw new Error('Projeto é obrigatório');
    }
    
    const stmt = db.prepare(`
      INSERT INTO tarefas (projeto_id, titulo, descricao, status, prioridade, responsavel_id, data_entrega,
                           etiquetas, capa, checklist_total, checklist_feitos, comentarios)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      projeto_id,
      titulo.trim(),
      descricao || null,
      status || 'A fazer',
      prioridade || 'Média',
      responsavel_id || null,
      data_entrega || null,
      normalizeEtiquetas(data.etiquetas),
      data.capa || null,
      toCount(data.checklist_total),
      toCount(data.checklist_feitos),
      toCount(data.comentarios)
    );
    
    return this.getById(result.lastInsertRowid as number)!;
  }

  static update(id: number, data: TarefaInput): Tarefa | undefined {
    const db = getDatabase();
    const existing = this.getById(id);
    if (!existing) return undefined;
    
    const updates: string[] = [];
    const params: any[] = [];
    
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
    
    if (data.etiquetas !== undefined) {
      updates.push('etiquetas = ?');
      params.push(normalizeEtiquetas(data.etiquetas));
    }

    if (data.capa !== undefined) {
      updates.push('capa = ?');
      params.push(data.capa || null);
    }

    for (const field of ['checklist_total', 'checklist_feitos', 'comentarios'] as const) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(toCount(data[field]));
      }
    }
    
    if (updates.length === 0) return existing;
    
    updates.push('atualizado_em = CURRENT_TIMESTAMP');
    params.push(id);
    
    const query = `UPDATE tarefas SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    return this.getById(id);
  }

  static delete(id: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM tarefas WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
