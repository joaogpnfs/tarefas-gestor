const request = require('supertest');
const { expect } = require('chai');
const { initializeDatabase } = require('../src/database/schema');
const path = require('path');

const testDbPath = path.join(__dirname, '../database-test.db');
let app;

describe('API REST - Testes de Integração', () => {
  before(() => {
    process.env.NODE_ENV = 'test';
    initializeDatabase(testDbPath);
    app = require('../src/server');
  });

  describe('Projetos', () => {
    let projetoId;

    it('POST /api/projetos - deve criar um novo projeto', async () => {
      const res = await request(app)
        .post('/api/projetos')
        .send({
          nome: 'Projeto Teste',
          descricao: 'Descrição do projeto teste',
          cor: '#3B82F6'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.nome).to.equal('Projeto Teste');
      projetoId = res.body.id;
    });

    it('POST /api/projetos - deve retornar erro quando nome é vazio', async () => {
      const res = await request(app)
        .post('/api/projetos')
        .send({
          nome: '',
          descricao: 'Teste'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('erro');
    });

    it('GET /api/projetos - deve listar todos os projetos', async () => {
      const res = await request(app).get('/api/projetos');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('GET /api/projetos/:id - deve retornar um projeto específico', async () => {
      const res = await request(app).get(`/api/projetos/${projetoId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', projetoId);
      expect(res.body).to.have.property('stats');
    });

    it('PUT /api/projetos/:id - deve atualizar um projeto', async () => {
      const res = await request(app)
        .put(`/api/projetos/${projetoId}`)
        .send({
          nome: 'Projeto Atualizado',
          descricao: 'Nova descrição',
          cor: '#10B981'
        });

      expect(res.status).to.equal(200);
      expect(res.body.nome).to.equal('Projeto Atualizado');
    });

    it('DELETE /api/projetos/:id - deve deletar um projeto', async () => {
      const res = await request(app).delete(`/api/projetos/${projetoId}`);

      expect(res.status).to.equal(204);
    });
  });

  describe('Membros', () => {
    let membroId;

    it('POST /api/membros - deve criar um novo membro', async () => {
      const res = await request(app)
        .post('/api/membros')
        .send({
          nome: 'João Gabriel',
          email: 'joao.test@unifil.br',
          cargo: 'Desenvolvedor'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.nome).to.equal('João Gabriel');
      membroId = res.body.id;
    });

    it('POST /api/membros - deve retornar erro com email inválido', async () => {
      const res = await request(app)
        .post('/api/membros')
        .send({
          nome: 'Teste',
          email: 'email-invalido'
        });

      expect(res.status).to.equal(400);
      expect(res.body.erro).to.include('Email inválido');
    });

    it('POST /api/membros - deve retornar erro com email duplicado', async () => {
      const res = await request(app)
        .post('/api/membros')
        .send({
          nome: 'Outro Nome',
          email: 'joao.test@unifil.br'
        });

      expect(res.status).to.equal(400);
      expect(res.body.erro).to.include('Email já cadastrado');
    });

    it('GET /api/membros - deve listar todos os membros', async () => {
      const res = await request(app).get('/api/membros');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('GET /api/membros/:id - deve retornar um membro específico', async () => {
      const res = await request(app).get(`/api/membros/${membroId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', membroId);
      expect(res.body).to.have.property('stats');
    });

    it('PUT /api/membros/:id - deve atualizar um membro', async () => {
      const res = await request(app)
        .put(`/api/membros/${membroId}`)
        .send({
          nome: 'João Gabriel Atualizado',
          email: 'joao.updated@unifil.br',
          cargo: 'Tech Lead'
        });

      expect(res.status).to.equal(200);
      expect(res.body.cargo).to.equal('Tech Lead');
    });
  });

  describe('Tarefas', () => {
    let projetoId, membroId, tarefaId;

    before(async () => {
      const projeto = await request(app)
        .post('/api/projetos')
        .send({ nome: 'Projeto para Tarefas', cor: '#3B82F6' });
      projetoId = projeto.body.id;

      const membro = await request(app)
        .post('/api/membros')
        .send({ nome: 'Responsável', email: 'resp@test.com' });
      membroId = membro.body.id;
    });

    it('POST /api/tarefas - deve criar uma nova tarefa', async () => {
      const res = await request(app)
        .post('/api/tarefas')
        .send({
          projeto_id: projetoId,
          titulo: 'Tarefa Teste',
          descricao: 'Descrição da tarefa',
          status: 'A fazer',
          prioridade: 'Alta',
          responsavel_id: membroId,
          data_entrega: '2026-12-31'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.titulo).to.equal('Tarefa Teste');
      tarefaId = res.body.id;
    });

    it('POST /api/tarefas - deve retornar erro quando título é vazio', async () => {
      const res = await request(app)
        .post('/api/tarefas')
        .send({
          projeto_id: projetoId,
          titulo: '',
          status: 'A fazer'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('erro');
    });

    it('POST /api/tarefas - deve retornar erro com status inválido', async () => {
      const res = await request(app)
        .post('/api/tarefas')
        .send({
          projeto_id: projetoId,
          titulo: 'Teste',
          status: 'Status Inválido'
        });

      expect(res.status).to.equal(400);
      expect(res.body.erro).to.include('Status inválido');
    });

    it('GET /api/tarefas - deve listar todas as tarefas', async () => {
      const res = await request(app).get('/api/tarefas');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('GET /api/tarefas?projeto_id - deve filtrar tarefas por projeto', async () => {
      const res = await request(app).get(`/api/tarefas?projeto_id=${projetoId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      res.body.forEach(tarefa => {
        expect(tarefa.projeto_id).to.equal(projetoId);
      });
    });

    it('GET /api/tarefas?prioridade - deve filtrar tarefas por prioridade', async () => {
      const res = await request(app).get(`/api/tarefas?projeto_id=${projetoId}&prioridade=Alta`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      res.body.forEach(tarefa => {
        expect(tarefa.prioridade).to.equal('Alta');
      });
    });

    it('GET /api/tarefas/:id - deve retornar uma tarefa específica', async () => {
      const res = await request(app).get(`/api/tarefas/${tarefaId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', tarefaId);
    });

    it('PUT /api/tarefas/:id - deve atualizar uma tarefa', async () => {
      const res = await request(app)
        .put(`/api/tarefas/${tarefaId}`)
        .send({
          titulo: 'Tarefa Atualizada',
          status: 'Em andamento',
          prioridade: 'Média',
          responsavel_id: membroId
        });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('Em andamento');
    });

    it('GET /api/tarefas/atrasadas/lista - deve retornar tarefas atrasadas', async () => {
      const res = await request(app).get('/api/tarefas/atrasadas/lista');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('DELETE /api/tarefas/:id - deve deletar uma tarefa', async () => {
      const res = await request(app).delete(`/api/tarefas/${tarefaId}`);

      expect(res.status).to.equal(204);
    });
  });

  describe('Dashboard', () => {
    it('GET /api/dashboard/stats - deve retornar estatísticas gerais', async () => {
      const res = await request(app).get('/api/dashboard/stats');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('total_projetos');
      expect(res.body).to.have.property('total_tarefas');
      expect(res.body).to.have.property('total_membros');
      expect(res.body).to.have.property('tarefas_a_fazer');
      expect(res.body).to.have.property('tarefas_em_andamento');
      expect(res.body).to.have.property('tarefas_concluidas');
      expect(res.body).to.have.property('tarefas_atrasadas');
      expect(res.body).to.have.property('prioridades');
    });
  });
});
