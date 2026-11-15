"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./database/schema");
const Projeto_1 = require("./models/Projeto");
const Membro_1 = require("./models/Membro");
const Tarefa_1 = require("./models/Tarefa");
function seed() {
    console.log('Inicializando banco de dados...');
    const db = (0, schema_1.initializeDatabase)();
    db.exec('DELETE FROM tarefas');
    db.exec('DELETE FROM projetos');
    db.exec('DELETE FROM membros');
    console.log('Criando membros...');
    const membro1 = Membro_1.MembroModel.create({
        nome: 'Ana Silva',
        email: 'ana.silva@example.com',
        cargo: 'Desenvolvedora Frontend'
    });
    const membro2 = Membro_1.MembroModel.create({
        nome: 'Carlos Santos',
        email: 'carlos.santos@example.com',
        cargo: 'Desenvolvedor Backend'
    });
    const membro3 = Membro_1.MembroModel.create({
        nome: 'Mariana Costa',
        email: 'mariana.costa@example.com',
        cargo: 'Designer UI/UX'
    });
    console.log('Criando projetos...');
    const projeto1 = Projeto_1.ProjetoModel.create({
        nome: 'Sistema de Gestão Acadêmica',
        descricao: 'Plataforma completa para gerenciamento de cursos, alunos e notas',
        cor: '#3B82F6'
    });
    const projeto2 = Projeto_1.ProjetoModel.create({
        nome: 'App Mobile de Delivery',
        descricao: 'Aplicativo para pedidos e entregas de restaurantes',
        cor: '#10B981'
    });
    const projeto3 = Projeto_1.ProjetoModel.create({
        nome: 'Portal de E-commerce',
        descricao: 'Loja virtual com carrinho e pagamento online',
        cor: '#8B5CF6'
    });
    console.log('Criando tarefas...');
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto1.id,
        titulo: 'Implementar tela de login',
        descricao: 'Criar interface de autenticação com validação',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membro1.id,
        data_entrega: '2024-11-10'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto1.id,
        titulo: 'Desenvolver API de usuários',
        descricao: 'Endpoints REST para CRUD de usuários',
        status: 'Em andamento',
        prioridade: 'Alta',
        responsavel_id: membro2.id,
        data_entrega: '2024-11-20'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto1.id,
        titulo: 'Design do dashboard',
        descricao: 'Protótipos no Figma das telas principais',
        status: 'A fazer',
        prioridade: 'Média',
        responsavel_id: membro3.id,
        data_entrega: '2024-11-25'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto2.id,
        titulo: 'Configurar estrutura React Native',
        descricao: 'Setup inicial com navigation e state',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membro1.id,
        data_entrega: '2024-11-05'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto2.id,
        titulo: 'Integração com API de mapas',
        descricao: 'Google Maps para rastreamento de entrega',
        status: 'Em andamento',
        prioridade: 'Alta',
        responsavel_id: membro2.id,
        data_entrega: '2024-11-18'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto2.id,
        titulo: 'Telas de catálogo de produtos',
        descricao: 'Lista de restaurantes e cardápios',
        status: 'A fazer',
        prioridade: 'Média',
        responsavel_id: membro1.id,
        data_entrega: '2024-11-22'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto3.id,
        titulo: 'Implementar carrinho de compras',
        descricao: 'Funcionalidade de adicionar/remover produtos',
        status: 'A fazer',
        prioridade: 'Alta',
        responsavel_id: membro2.id,
        data_entrega: '2024-11-30'
    });
    Tarefa_1.TarefaModel.create({
        projeto_id: projeto3.id,
        titulo: 'Integração com gateway de pagamento',
        descricao: 'Stripe ou Mercado Pago',
        status: 'A fazer',
        prioridade: 'Alta',
        responsavel_id: membro2.id,
        data_entrega: '2024-12-05'
    });
    console.log('Seed concluído com sucesso!');
    console.log(`- ${Membro_1.MembroModel.getAll().length} membros`);
    console.log(`- ${Projeto_1.ProjetoModel.getAll().length} projetos`);
    console.log(`- ${Tarefa_1.TarefaModel.getAll({}).length} tarefas`);
}
seed();
