"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
function initializeDatabase(dbPath = path_1.default.join(__dirname, '../../database.db')) {
    const db = new better_sqlite3_1.default(dbPath);
    db.pragma('foreign_keys = ON');
    db.exec(`
    CREATE TABLE IF NOT EXISTS membros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      cargo TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projetos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      cor TEXT DEFAULT '#3B82F6',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projeto_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      status TEXT CHECK(status IN ('A fazer', 'Em andamento', 'Concluído')) DEFAULT 'A fazer',
      prioridade TEXT CHECK(prioridade IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
      responsavel_id INTEGER,
      data_entrega DATE,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
      FOREIGN KEY (responsavel_id) REFERENCES membros(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tarefas_projeto ON tarefas(projeto_id);
    CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);
    CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON tarefas(responsavel_id);
  `);
    migrateOptionalColumns(db);
    return db;
}
/**
 * Adiciona colunas opcionais introduzidas depois da primeira versão.
 * Todas possuem valor padrão, então bancos antigos continuam funcionando.
 */
function migrateOptionalColumns(db) {
    const optionalColumns = {
        projetos: [
            ['emoji', "TEXT DEFAULT '📁'"],
            ['capa', 'TEXT'],
            ['prazo', 'DATE'],
        ],
        tarefas: [
            ['etiquetas', "TEXT DEFAULT ''"],
            ['capa', 'TEXT'],
            ['checklist_total', 'INTEGER DEFAULT 0'],
            ['checklist_feitos', 'INTEGER DEFAULT 0'],
            ['comentarios', 'INTEGER DEFAULT 0'],
        ],
    };
    for (const [table, columns] of Object.entries(optionalColumns)) {
        const existing = db.prepare(`PRAGMA table_info(${table})`).all()
            .map((c) => c.name);
        for (const [name, definition] of columns) {
            if (!existing.includes(name)) {
                db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
            }
        }
    }
}
