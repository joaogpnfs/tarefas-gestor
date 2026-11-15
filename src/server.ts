import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { getDatabase } from './database/connection';
import projetosRouter from './routes/projetos';
import tarefasRouter from './routes/tarefas';
import membrosRouter from './routes/membros';
import dashboardRouter from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 4321;

getDatabase();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRouter);
app.use('/api/projetos', projetosRouter);
app.use('/api/tarefas', tarefasRouter);
app.use('/api/membros', membrosRouter);

const webDistPath = path.join(__dirname, '../web/dist');
if (process.env.NODE_ENV !== 'test' && fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Rota não encontrada' });
      return;
    }
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app;
