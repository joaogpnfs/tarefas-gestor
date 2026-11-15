import { initializeDatabase } from './database/schema';
import { ProjetoModel } from './models/Projeto';
import { MembroModel } from './models/Membro';
import { TarefaModel } from './models/Tarefa';

function seed() {
  console.log('Inicializando banco de dados...');
  const db = initializeDatabase();
  
  db.exec('DELETE FROM tarefas');
  db.exec('DELETE FROM projetos');
  db.exec('DELETE FROM membros');
  
  console.log('Criando membros...');
  const membro1 = MembroModel.create({
    nome: 'Ana Silva',
    email: 'ana.silva@example.com',
    cargo: 'Desenvolvedora Frontend'
  });
  
  const membro2 = MembroModel.create({
    nome: 'Carlos Santos',
    email: 'carlos.santos@example.com',
    cargo: 'Desenvolvedor Backend'
  });
  
  const membro3 = MembroModel.create({
    nome: 'Mariana Costa',
    email: 'mariana.costa@example.com',
    cargo: 'Designer UI/UX'
  });
  
  console.log('Criando projetos...');
  const projeto1 = ProjetoModel.create({
    nome: 'Sistema de Gestão Acadêmica',
    descricao: 'Plataforma completa para gerenciamento de cursos, alunos e notas',
    cor: '#3B82F6'
  });
  
  const projeto2 = ProjetoModel.create({
    nome: 'App Mobile de Delivery',
    descricao: 'Aplicativo para pedidos e entregas de restaurantes',
    cor: '#10B981'
  });
  
  const projeto3 = ProjetoModel.create({
    nome: 'Portal de E-commerce',
    descricao: 'Loja virtual com carrinho e pagamento online',
    cor: '#8B5CF6'
  });
  
  console.log('Criando tarefas...');
  TarefaModel.create({
    projeto_id: projeto1.id,
    titulo: 'Implementar tela de login',
    descricao: 'Criar interface de autenticação com validação',
    status: 'Concluído',
    prioridade: 'Alta',
    responsavel_id: membro1.id,
    data_entrega: '2024-11-10'
  });
  
  TarefaModel.create({
    projeto_id: projeto1.id,
    titulo: 'Desenvolver API de usuários',
    descricao: 'Endpoints REST para CRUD de usuários',
    status: 'Em andamento',
    prioridade: 'Alta',
    responsavel_id: membro2.id,
    data_entrega: '2024-11-20'
  });
  
  TarefaModel.create({
    projeto_id: projeto1.id,
    titulo: 'Design do dashboard',
    descricao: 'Protótipos no Figma das telas principais',
    status: 'A fazer',
    prioridade: 'Média',
    responsavel_id: membro3.id,
    data_entrega: '2024-11-25'
  });
  
  TarefaModel.create({
    projeto_id: projeto2.id,
    titulo: 'Configurar estrutura React Native',
    descricao: 'Setup inicial com navigation e state',
    status: 'Concluído',
    prioridade: 'Alta',
    responsavel_id: membro1.id,
    data_entrega: '2024-11-05'
  });
  
  TarefaModel.create({
    projeto_id: projeto2.id,
    titulo: 'Integração com API de mapas',
    descricao: 'Google Maps para rastreamento de entrega',
    status: 'Em andamento',
    prioridade: 'Alta',
    responsavel_id: membro2.id,
    data_entrega: '2024-11-18'
  });
  
  TarefaModel.create({
    projeto_id: projeto2.id,
    titulo: 'Telas de catálogo de produtos',
    descricao: 'Lista de restaurantes e cardápios',
    status: 'A fazer',
    prioridade: 'Média',
    responsavel_id: membro1.id,
    data_entrega: '2024-11-22'
  });
  
  TarefaModel.create({
    projeto_id: projeto3.id,
    titulo: 'Implementar carrinho de compras',
    descricao: 'Funcionalidade de adicionar/remover produtos',
    status: 'A fazer',
    prioridade: 'Alta',
    responsavel_id: membro2.id,
    data_entrega: '2024-11-30'
  });
  
  TarefaModel.create({
    projeto_id: projeto3.id,
    titulo: 'Integração com gateway de pagamento',
    descricao: 'Stripe ou Mercado Pago',
    status: 'A fazer',
    prioridade: 'Alta',
    responsavel_id: membro2.id,
    data_entrega: '2024-12-05'
  });
  
  console.log('Seed concluído com sucesso!');
  console.log(`- ${MembroModel.getAll().length} membros`);
  console.log(`- ${ProjetoModel.getAll().length} projetos`);
  console.log(`- ${TarefaModel.getAll({}).length} tarefas`);
}

seed();
