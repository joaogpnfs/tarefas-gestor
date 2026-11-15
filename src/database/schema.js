const Database = require('better-sqlite3');
const path = require('path');

function initializeDatabase(dbPath = path.join(__dirname, '../../database.db')) {
  const db = new Database(dbPath);
  
  // Habilitar foreign keys
  db.pragma('foreign_keys = ON');
  
  // Criar tabelas
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
  
  return db;
}

module.exports = { initializeDatabase };
