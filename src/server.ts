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

app.use('/api/projetos', projetosRouter);
app.use('/api/tarefas', tarefasRouter);
app.use('/api/membros', membrosRouter);
app.use('/api/dashboard', dashboardRouter);

const webDistPath = path.join(__dirname, '../web/dist');
if (process.env.NODE_ENV !== 'test') {
  app.use(express.static(webDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
