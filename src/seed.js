const { getDatabase, closeDatabase } = require('./database/connection');
const Projeto = require('./models/Projeto');
const Membro = require('./models/Membro');
const Tarefa = require('./models/Tarefa');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    const db = getDatabase();
    
    // Limpar dados existentes
    db.exec('DELETE FROM tarefas');
    db.exec('DELETE FROM projetos');
    db.exec('DELETE FROM membros');
    
    console.log('✅ Banco de dados limpo');
    
    // Criar membros
    const membros = [
      Membro.create({
        nome: 'João Gabriel Pereira',
        email: 'joao.gabriel@unifil.br',
        cargo: 'Desenvolvedor Full Stack'
      }),
      Membro.create({
        nome: 'Maria Silva Santos',
        email: 'maria.silva@unifil.br',
        cargo: 'UI/UX Designer'
      }),
      Membro.create({
        nome: 'Pedro Henrique Costa',
        email: 'pedro.costa@unifil.br',
        cargo: 'Analista de Qualidade'
      }),
      Membro.create({
        nome: 'Ana Paula Oliveira',
        email: 'ana.oliveira@unifil.br',
        cargo: 'Gerente de Projetos'
      })
    ];
    
    console.log(`✅ ${membros.length} membros criados`);
    
    // Criar projetos
    const projeto1 = Projeto.create({
      nome: 'Sistema de Gestão Acadêmica',
      descricao: 'Desenvolvimento de plataforma para gestão de notas, frequência e documentos acadêmicos',
      cor: '#3B82F6'
    });
    
    const projeto2 = Projeto.create({
      nome: 'App Mobile de Delivery',
      descricao: 'Aplicativo mobile para pedidos e entregas de restaurantes locais',
      cor: '#10B981'
    });
    
    const projeto3 = Projeto.create({
      nome: 'Portal de Notícias Universitário',
      descricao: 'Portal web para publicação de notícias e eventos da universidade',
      cor: '#F59E0B'
    });
    
    console.log('✅ 3 projetos criados');
    
    // Criar tarefas para o Projeto 1
    const tarefas1 = [
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Levantamento de requisitos',
        descricao: 'Entrevistar coordenadores e professores para levantar necessidades do sistema',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membros[3].id,
        data_entrega: '2026-10-15'
      }),
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Modelagem do banco de dados',
        descricao: 'Criar diagrama ER e modelo relacional do banco de dados',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-10-25'
      }),
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Implementar autenticação de usuários',
        descricao: 'Sistema de login com JWT para alunos, professores e administradores',
        status: 'Em andamento',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-20'
      }),
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Desenvolver telas de lançamento de notas',
        descricao: 'Interface para professores lançarem notas dos alunos',
        status: 'Em andamento',
        prioridade: 'Média',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-25'
      }),
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Criar protótipo de alta fidelidade',
        descricao: 'Protótipo no Figma de todas as telas do sistema',
        status: 'A fazer',
        prioridade: 'Alta',
        responsavel_id: membros[1].id,
        data_entrega: '2026-11-18'
      }),
      Tarefa.create({
        projeto_id: projeto1.id,
        titulo: 'Testes de integração',
        descricao: 'Implementar testes automatizados das principais funcionalidades',
        status: 'A fazer',
        prioridade: 'Média',
        responsavel_id: membros[2].id,
        data_entrega: '2026-12-01'
      })
    ];
    
    // Criar tarefas para o Projeto 2
    const tarefas2 = [
      Tarefa.create({
        projeto_id: projeto2.id,
        titulo: 'Pesquisa de mercado',
        descricao: 'Análise de concorrentes e pesquisa com restaurantes parceiros',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membros[3].id,
        data_entrega: '2026-09-30'
      }),
      Tarefa.create({
        projeto_id: projeto2.id,
        titulo: 'Setup do projeto React Native',
        descricao: 'Configurar ambiente de desenvolvimento e estrutura inicial',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-10-10'
      }),
      Tarefa.create({
        projeto_id: projeto2.id,
        titulo: 'Integração com API de pagamentos',
        descricao: 'Implementar integração com gateway de pagamento',
        status: 'Em andamento',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-10'
      }),
      Tarefa.create({
        projeto_id: projeto2.id,
        titulo: 'Sistema de rastreamento em tempo real',
        descricao: 'Implementar rastreamento de entregadores com geolocalização',
        status: 'A fazer',
        prioridade: 'Média',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-30'
      }),
      Tarefa.create({
        projeto_id: projeto2.id,
        titulo: 'Testes com usuários reais',
        descricao: 'Realizar testes de usabilidade com clientes e restaurantes',
        status: 'A fazer',
        prioridade: 'Baixa',
        responsavel_id: membros[2].id,
        data_entrega: '2026-12-15'
      })
    ];
    
    // Criar tarefas para o Projeto 3 (algumas atrasadas)
    const tarefas3 = [
      Tarefa.create({
        projeto_id: projeto3.id,
        titulo: 'Configurar CMS WordPress',
        descricao: 'Instalar e configurar WordPress com tema personalizado',
        status: 'Concluído',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-10-01'
      }),
      Tarefa.create({
        projeto_id: projeto3.id,
        titulo: 'Desenvolver tema customizado',
        descricao: 'Criar tema WordPress seguindo identidade visual da UniFil',
        status: 'A fazer',
        prioridade: 'Alta',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-01'
      }),
      Tarefa.create({
        projeto_id: projeto3.id,
        titulo: 'Sistema de notificações por email',
        descricao: 'Implementar envio automático de newsletters',
        status: 'A fazer',
        prioridade: 'Média',
        responsavel_id: membros[0].id,
        data_entrega: '2026-11-05'
      }),
      Tarefa.create({
        projeto_id: projeto3.id,
        titulo: 'Otimização SEO',
        descricao: 'Configurar meta tags, sitemap e otimizações para motores de busca',
        status: 'A fazer',
        prioridade: 'Baixa',
        responsavel_id: membros[0].id,
        data_entrega: '2026-12-10'
      })
    ];
    
    const totalTarefas = tarefas1.length + tarefas2.length + tarefas3.length;
    console.log(`✅ ${totalTarefas} tarefas criadas`);
    
    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - ${membros.length} membros`);
    console.log(`   - 3 projetos`);
    console.log(`   - ${totalTarefas} tarefas`);
    
    closeDatabase();
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    closeDatabase();
    process.exit(1);
  }
}

seed();
