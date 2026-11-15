const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDatabase } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 4321;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar banco de dados
getDatabase();

// Rotas da API
app.use('/api/projetos', require('./routes/projetos'));
app.use('/api/tarefas', require('./routes/tarefas'));
app.use('/api/membros', require('./routes/membros'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Rota raiz serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Acesse o sistema de controle de tarefas e projetos`);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  server.close(() => {
    const { closeDatabase } = require('./database/connection');
    closeDatabase();
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

module.exports = app;
