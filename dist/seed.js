"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./database/schema");
const Projeto_1 = require("./models/Projeto");
const Membro_1 = require("./models/Membro");
const Tarefa_1 = require("./models/Tarefa");
/** Data relativa a hoje (YYYY-MM-DD), para a demonstração sempre parecer atual. */
function dia(offset) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}
function seed() {
    console.log('Inicializando banco de dados...');
    const db = (0, schema_1.initializeDatabase)();
    db.exec('DELETE FROM tarefas');
    db.exec('DELETE FROM projetos');
    db.exec('DELETE FROM membros');
    db.exec("DELETE FROM sqlite_sequence WHERE name IN ('tarefas', 'projetos', 'membros')");
    console.log('Criando membros...');
    const membrosData = [
        { nome: 'João Feitosa', email: 'joao.feitosa@example.com', cargo: 'Líder técnico' },
        { nome: 'Ana Ribeiro', email: 'ana.ribeiro@example.com', cargo: 'Desenvolvedora Frontend' },
        { nome: 'Carlos Menezes', email: 'carlos.menezes@example.com', cargo: 'Desenvolvedor Backend' },
        { nome: 'Mariana Lopes', email: 'mariana.lopes@example.com', cargo: 'Designer UI/UX' },
        { nome: 'Rafael Tanaka', email: 'rafael.tanaka@example.com', cargo: 'Engenheiro de QA' },
        { nome: 'Beatriz Moraes', email: 'beatriz.moraes@example.com', cargo: 'Analista de Requisitos' },
        { nome: 'Lucas Andrade', email: 'lucas.andrade@example.com', cargo: 'DevOps' },
    ];
    const membros = {};
    for (const m of membrosData) {
        membros[m.nome.split(' ')[0]] = Membro_1.MembroModel.create(m).id;
    }
    console.log('Criando projetos...');
    const projetos = [
        {
            nome: 'Portal Acadêmico',
            descricao: 'Plataforma para alunos acompanharem disciplinas, notas, frequência e entregas em um só lugar.',
            cor: '#6366F1', emoji: '🎓', capa: 'aurora', prazo: 32,
            tarefas: [
                { titulo: 'Tela de login com SSO institucional', descricao: 'Autenticação com e-mail institucional, recuperação de senha e validação de campos.', status: 'Concluído', prioridade: 'Alta', resp: 'Ana', prazo: -9, etiquetas: ['frontend', 'segurança'], checklist: [5, 5], comentarios: 4 },
                { titulo: 'API de matrículas e disciplinas', descricao: 'Endpoints REST para listar disciplinas, matricular e trancar, com paginação.', status: 'Em andamento', prioridade: 'Alta', resp: 'Carlos', prazo: 2, etiquetas: ['backend', 'api'], checklist: [3, 6], comentarios: 7 },
                { titulo: 'Protótipo do boletim no Figma', descricao: 'Tela de notas por bimestre com média parcial e gráfico de evolução.', status: 'Concluído', prioridade: 'Média', resp: 'Mariana', prazo: -5, etiquetas: ['ux', 'design'], capa: '#A855F7', comentarios: 3 },
                { titulo: 'Calendário de provas e entregas', descricao: 'Visualização mensal com filtros por disciplina e lembretes por e-mail.', status: 'A fazer', prioridade: 'Média', resp: 'Ana', prazo: 6, etiquetas: ['frontend'], checklist: [0, 4] },
                { titulo: 'Testes de integração do módulo de notas', descricao: 'Cobrir lançamento, edição e cálculo de média com Mocha e Supertest.', status: 'A fazer', prioridade: 'Alta', resp: 'Rafael', prazo: 4, etiquetas: ['testes', 'backend'], checklist: [1, 8], comentarios: 1 },
                { titulo: 'Corrigir cálculo de frequência', descricao: 'Faltas justificadas estão sendo contadas no percentual final.', status: 'Em andamento', prioridade: 'Alta', resp: 'Carlos', prazo: -1, etiquetas: ['bug', 'backend'], capa: '#EF4444', comentarios: 5 },
                { titulo: 'Levantamento de requisitos com coordenação', descricao: 'Entrevista com coordenadores para validar fluxos de rematrícula.', status: 'Concluído', prioridade: 'Média', resp: 'Beatriz', prazo: -14, etiquetas: ['pesquisa', 'docs'], comentarios: 2 },
                { titulo: 'Modo escuro e acessibilidade (WCAG)', descricao: 'Contraste AA, navegação por teclado e leitores de tela.', status: 'A fazer', prioridade: 'Baixa', resp: 'Mariana', prazo: 18, etiquetas: ['ux', 'frontend'] },
                { titulo: 'Documentar API com OpenAPI', descricao: 'Gerar especificação e publicar a documentação interativa.', status: 'A fazer', prioridade: 'Baixa', resp: 'João', prazo: 12, etiquetas: ['docs', 'api'], checklist: [0, 3] },
            ],
        },
        {
            nome: 'App de Delivery',
            descricao: 'Aplicativo mobile para pedidos em restaurantes da região, com rastreamento em tempo real.',
            cor: '#F97316', emoji: '🛵', capa: 'por-do-sol', prazo: 45,
            tarefas: [
                { titulo: 'Estrutura inicial em React Native', descricao: 'Navegação, gerenciamento de estado e tema base do app.', status: 'Concluído', prioridade: 'Alta', resp: 'Ana', prazo: -12, etiquetas: ['mobile', 'frontend'], checklist: [4, 4], comentarios: 2 },
                { titulo: 'Integração com API de mapas', descricao: 'Rastreamento do entregador e cálculo de tempo estimado.', status: 'Em andamento', prioridade: 'Alta', resp: 'Carlos', prazo: 3, etiquetas: ['backend', 'mobile'], capa: '#F59E0B', checklist: [2, 5], comentarios: 6 },
                { titulo: 'Catálogo de restaurantes e cardápios', descricao: 'Lista com busca, filtros por categoria e avaliação.', status: 'Em andamento', prioridade: 'Média', resp: 'Ana', prazo: 5, etiquetas: ['frontend', 'mobile'], checklist: [3, 7], comentarios: 3 },
                { titulo: 'Fluxo de pagamento com Pix', descricao: 'Geração de QR Code e confirmação via webhook.', status: 'A fazer', prioridade: 'Alta', resp: 'João', prazo: 8, etiquetas: ['backend', 'pagamentos'], checklist: [0, 6] },
                { titulo: 'Notificações push de status do pedido', descricao: 'Avisos de pedido aceito, saiu para entrega e entregue.', status: 'A fazer', prioridade: 'Média', resp: 'Lucas', prazo: 10, etiquetas: ['infra', 'mobile'] },
                { titulo: 'Ícones e ilustrações do onboarding', descricao: 'Três telas de boas-vindas com ilustrações próprias.', status: 'Concluído', prioridade: 'Baixa', resp: 'Mariana', prazo: -3, etiquetas: ['design', 'ux'], capa: '#EC4899', comentarios: 1 },
                { titulo: 'Testes E2E do carrinho', descricao: 'Adicionar, remover itens e aplicar cupom com Detox.', status: 'A fazer', prioridade: 'Média', resp: 'Rafael', prazo: -2, etiquetas: ['testes', 'mobile'], checklist: [1, 5] },
                { titulo: 'App travando ao trocar endereço', descricao: 'Crash em Android 12 quando o CEP não é encontrado.', status: 'A fazer', prioridade: 'Alta', resp: 'Carlos', prazo: 0, etiquetas: ['bug', 'mobile'], capa: '#EF4444', comentarios: 8 },
            ],
        },
        {
            nome: 'E-commerce Artesanal',
            descricao: 'Loja virtual para artesãos locais com carrinho, frete calculado e painel do vendedor.',
            cor: '#0EA5E9', emoji: '🛍️', capa: 'oceano', prazo: 60,
            tarefas: [
                { titulo: 'Carrinho de compras persistente', descricao: 'Salvar itens no navegador e sincronizar ao fazer login.', status: 'Em andamento', prioridade: 'Alta', resp: 'Ana', prazo: 1, etiquetas: ['frontend'], checklist: [4, 6], comentarios: 2 },
                { titulo: 'Gateway de pagamento (Mercado Pago)', descricao: 'Checkout transparente com cartão e boleto.', status: 'A fazer', prioridade: 'Alta', resp: 'Carlos', prazo: 9, etiquetas: ['backend', 'pagamentos'], checklist: [0, 5] },
                { titulo: 'Cálculo de frete pelos Correios', descricao: 'Consulta de prazo e valor a partir do CEP.', status: 'A fazer', prioridade: 'Média', resp: 'João', prazo: 14, etiquetas: ['backend', 'api'] },
                { titulo: 'Página de produto com galeria', descricao: 'Zoom nas fotos, variações de cor e avaliações.', status: 'Concluído', prioridade: 'Média', resp: 'Mariana', prazo: -6, etiquetas: ['ux', 'frontend'], capa: '#06B6D4', comentarios: 4 },
                { titulo: 'Painel do vendedor', descricao: 'Cadastro de produtos, estoque e relatório de vendas.', status: 'A fazer', prioridade: 'Média', resp: 'Ana', prazo: 20, etiquetas: ['frontend', 'backend'], checklist: [0, 9] },
                { titulo: 'SEO e meta tags das páginas', descricao: 'Sitemap, dados estruturados e Open Graph.', status: 'A fazer', prioridade: 'Baixa', resp: 'Beatriz', prazo: 25, etiquetas: ['docs'] },
                { titulo: 'Pipeline de deploy com GitHub Actions', descricao: 'Build, testes e deploy automático em cada push na main.', status: 'Concluído', prioridade: 'Alta', resp: 'Lucas', prazo: -4, etiquetas: ['infra'], checklist: [3, 3], comentarios: 2 },
            ],
        },
        {
            nome: 'Dashboard de Indicadores',
            descricao: 'Painel de BI com métricas de evasão, desempenho e engajamento dos cursos.',
            cor: '#10B981', emoji: '📊', capa: 'floresta', prazo: 28,
            tarefas: [
                { titulo: 'Modelagem do data warehouse', descricao: 'Esquema estrela com fatos de matrícula e frequência.', status: 'Concluído', prioridade: 'Alta', resp: 'Carlos', prazo: -10, etiquetas: ['backend', 'dados'], comentarios: 3 },
                { titulo: 'ETL dos dados de frequência', descricao: 'Rotina diária de extração e limpeza dos registros.', status: 'Em andamento', prioridade: 'Alta', resp: 'Lucas', prazo: -3, etiquetas: ['dados', 'infra'], checklist: [2, 4], comentarios: 2 },
                { titulo: 'Gráficos de evasão por curso', descricao: 'Séries temporais com comparação entre semestres.', status: 'Em andamento', prioridade: 'Média', resp: 'Ana', prazo: 4, etiquetas: ['frontend', 'dados'], capa: '#10B981', checklist: [1, 3] },
                { titulo: 'Validar indicadores com a reitoria', descricao: 'Apresentar protótipo e coletar feedback dos gestores.', status: 'A fazer', prioridade: 'Média', resp: 'Beatriz', prazo: 7, etiquetas: ['pesquisa'], comentarios: 1 },
                { titulo: 'Exportar relatórios em PDF', descricao: 'Gerar relatório mensal com os principais indicadores.', status: 'A fazer', prioridade: 'Baixa', resp: 'João', prazo: 16, etiquetas: ['backend'] },
                { titulo: 'Testes de carga das consultas', descricao: 'Garantir resposta abaixo de 500 ms com 1 milhão de linhas.', status: 'A fazer', prioridade: 'Média', resp: 'Rafael', prazo: 11, etiquetas: ['testes', 'dados'] },
            ],
        },
        {
            nome: 'TCC — Plataforma de Monitoria',
            descricao: 'Trabalho de conclusão: conecta monitores e alunos para agendar sessões de dúvidas.',
            cor: '#A855F7', emoji: '📚', capa: 'lavanda', prazo: 21,
            tarefas: [
                { titulo: 'Revisão bibliográfica', descricao: 'Levantar artigos sobre monitoria acadêmica e aprendizagem entre pares.', status: 'Concluído', prioridade: 'Alta', resp: 'Beatriz', prazo: -20, etiquetas: ['pesquisa', 'docs'], checklist: [6, 6], comentarios: 5 },
                { titulo: 'Diagramas UML (casos de uso e classes)', descricao: 'Modelar atores, casos de uso e principais entidades.', status: 'Concluído', prioridade: 'Média', resp: 'João', prazo: -7, etiquetas: ['docs'], comentarios: 2 },
                { titulo: 'Agenda de sessões de monitoria', descricao: 'Monitor publica horários e aluno reserva com confirmação.', status: 'Em andamento', prioridade: 'Alta', resp: 'João', prazo: 0, etiquetas: ['frontend', 'backend'], capa: '#8B5CF6', checklist: [3, 7], comentarios: 4 },
                { titulo: 'Escrever capítulo de metodologia', descricao: 'Descrever abordagem ágil, ferramentas e critérios de avaliação.', status: 'A fazer', prioridade: 'Alta', resp: 'João', prazo: 3, etiquetas: ['docs'], checklist: [1, 4] },
                { titulo: 'Questionário de validação com alunos', descricao: 'Aplicar formulário SUS para medir usabilidade.', status: 'A fazer', prioridade: 'Média', resp: 'Mariana', prazo: 9, etiquetas: ['pesquisa', 'ux'] },
                { titulo: 'Slides da banca', descricao: 'Apresentação de 15 minutos com demonstração ao vivo.', status: 'A fazer', prioridade: 'Média', resp: 'João', prazo: 19, etiquetas: ['docs', 'design'] },
                { titulo: 'Ajustar formatação ABNT', descricao: 'Referências, sumário automático e numeração de páginas.', status: 'A fazer', prioridade: 'Baixa', resp: 'João', prazo: -1, etiquetas: ['docs'] },
            ],
        },
    ];
    console.log('Criando tarefas...');
    for (const p of projetos) {
        const projeto = Projeto_1.ProjetoModel.create({
            nome: p.nome, descricao: p.descricao, cor: p.cor, emoji: p.emoji, capa: p.capa, prazo: dia(p.prazo),
        });
        for (const t of p.tarefas) {
            Tarefa_1.TarefaModel.create({
                projeto_id: projeto.id,
                titulo: t.titulo,
                descricao: t.descricao,
                status: t.status,
                prioridade: t.prioridade,
                responsavel_id: membros[t.resp],
                data_entrega: t.prazo === null ? undefined : dia(t.prazo),
                etiquetas: t.etiquetas,
                capa: t.capa,
                checklist_total: t.checklist?.[1] ?? 0,
                checklist_feitos: t.checklist?.[0] ?? 0,
                comentarios: t.comentarios ?? 0,
            });
        }
    }
    console.log('Seed concluído com sucesso!');
    console.log(`- ${Membro_1.MembroModel.getAll().length} membros`);
    console.log(`- ${Projeto_1.ProjetoModel.getAll().length} projetos`);
    console.log(`- ${Tarefa_1.TarefaModel.getAll({}).length} tarefas`);
}
seed();
