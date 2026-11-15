import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './database/schema';
import projetosRouter from './routes/projetos';
import tarefasRouter from './routes/tarefas';
import membrosRouter from './routes/membros';
import dashboardRouter from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 4321;

initializeDatabase();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRouter);
app.use('/api/projetos', projetosRouter);
app.use('/api/tarefas', tarefasRouter);
app.use('/api/membros', membrosRouter);

const webDistPath = path.join(__dirname, '../web/dist');
const fs = require('fs');
if (process.env.NODE_ENV !== 'test' && fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.use((req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
