# Roteiro para Vídeo de Defesa do Projeto

**Projeto:** Sistema de Controle de Tarefas e Projetos

**Aluno:** João Gabriel Pereira Nascimento Feitosa da Silva

**RA:** 263466036

**Disciplina:** Projeto e Desenvolvimento de Sistemas I

**Duração Total:** 6-9 minutos

---

## Estrutura do Vídeo

### 1. Introdução (1 minuto)

**Tempo:** 00:00 - 01:00

**Conteúdo:**
- Apresentação pessoal
- Nome do projeto: "Sistema de Controle de Tarefas e Projetos"
- Contexto: projeto desenvolvido para a disciplina de Projeto e Desenvolvimento de Sistemas I
- Objetivo geral: criar um sistema web de gestão de projetos e tarefas com visualização Kanban

**Roteiro sugerido:**

> "Olá, meu nome é João Gabriel Pereira Nascimento Feitosa da Silva, RA 263466036, estudante de Engenharia de Software na UniFil. Hoje vou apresentar o Sistema de Controle de Tarefas e Projetos, desenvolvido como trabalho prático da disciplina Projeto e Desenvolvimento de Sistemas I.
>
> O objetivo deste sistema é facilitar o gerenciamento de projetos e tarefas através de uma interface visual intuitiva, inspirada em ferramentas como o Trello, utilizando quadros Kanban para organização e acompanhamento do progresso das atividades."

---

### 2. Problema e Justificativa (1 minuto)

**Tempo:** 01:00 - 02:00

**Conteúdo:**
- Problema: necessidade de organização e acompanhamento visual de tarefas
- Justificativa: aprendizado prático de desenvolvimento web full-stack
- Benefícios: melhor produtividade, comunicação e visibilidade do progresso

**Roteiro sugerido:**

> "A gestão eficiente de projetos é fundamental para equipes de desenvolvimento. Este projeto justifica-se pela necessidade de aplicar na prática conceitos de engenharia de software, incluindo arquitetura de sistemas, modelagem de dados, desenvolvimento de APIs e criação de interfaces de usuário responsivas.
>
> O sistema permite que equipes organizem suas atividades, acompanhem o progresso visualmente e identifiquem rapidamente gargalos e tarefas atrasadas."

---

### 3. Arquitetura e Tecnologias (1-1.5 minutos)

**Tempo:** 02:00 - 03:30

**Conteúdo:**
- Arquitetura em camadas (apresentação, aplicação, negócio, dados)
- Tecnologias backend: Node.js, Express, SQLite (better-sqlite3)
- Tecnologias frontend: HTML5, CSS3, JavaScript
- API RESTful
- Padrões: MVC, Repository Pattern

**Roteiro sugerido:**

> "O sistema foi desenvolvido seguindo uma arquitetura em camadas com separação clara de responsabilidades.
>
> No backend, utilizei Node.js com Express para criar uma API REST, e SQLite como banco de dados. A escolha do SQLite facilita a execução do projeto, pois não requer servidor de banco de dados separado.
>
> No frontend, utilizei HTML5, CSS3 e JavaScript puro, sem frameworks, para focar nos fundamentos e manter a simplicidade.
>
> A comunicação entre frontend e backend ocorre através de uma API RESTful, seguindo as melhores práticas de desenvolvimento web. O código está organizado seguindo o padrão MVC, com Models para lógica de negócio, Views para apresentação e Controllers nas rotas."

**Tela a mostrar:**
- Diagrama de arquitetura (pode ser mostrado do documento)
- Estrutura de pastas do projeto no VS Code

---

### 4. Modelagem de Dados (1 minuto)

**Tempo:** 03:30 - 04:30

**Conteúdo:**
- Três entidades principais: Projetos, Tarefas, Membros
- Relacionamentos: Projeto 1:N Tarefas, Membro 1:N Tarefas
- Mostrar diagrama ER

**Roteiro sugerido:**

> "O banco de dados foi modelado com três entidades principais: Projetos, Tarefas e Membros.
>
> Cada projeto pode ter múltiplas tarefas. Cada tarefa pertence obrigatoriamente a um projeto e pode ter um membro responsável. Implementei integridade referencial com cascade delete, de forma que ao excluir um projeto, suas tarefas são automaticamente removidas.
>
> As tarefas possuem atributos como título, descrição, status (A fazer, Em andamento ou Concluído), prioridade (Baixa, Média ou Alta), responsável e data de entrega. Todas as validações são feitas tanto no backend quanto no banco de dados."

**Tela a mostrar:**
- Diagrama ER do documento
- Schema do banco de dados (schema.js)

---

### 5. Demonstração Prática - CRUD (3-4 minutos)

**Tempo:** 04:30 - 08:00

Este é o core do vídeo. Demonstre todas as funcionalidades principais.

#### 5.1 Dashboard (30 segundos)

**Roteiro sugerido:**

> "Vou iniciar a demonstração pelo dashboard, que oferece uma visão geral do sistema. Aqui vemos estatísticas gerais: total de projetos, tarefas, membros e tarefas atrasadas. Logo abaixo, temos contadores por status e uma lista de tarefas que estão atrasadas."

**Ações:**
- Abrir o navegador em http://localhost:4321
- Mostrar o dashboard com os dados de exemplo

---

#### 5.2 CRUD de Projetos (45 segundos)

**Roteiro sugerido:**

> "Agora vou demonstrar o gerenciamento de projetos. Aqui temos a listagem de todos os projetos cadastrados. Vou criar um novo projeto..."
>
> [Criar projeto]
>
> "Preencho o nome, descrição e posso personalizar a cor que aparecerá na interface. Ao salvar, o projeto é adicionado à lista. Também posso editar um projeto existente alterando suas informações, e deletar projetos que não são mais necessários."

**Ações:**
1. Navegar para página de Projetos
2. Clicar em "Novo Projeto"
3. Preencher formulário (ex: "Novo Projeto Demo", descrição, escolher cor)
4. Salvar e mostrar projeto criado
5. Abrir um projeto para demonstrar edição (opcional)

---

#### 5.3 CRUD de Membros (45 segundos)

**Roteiro sugerido:**

> "Na seção de membros, gerencio a equipe que trabalhará nos projetos. Vou adicionar um novo membro..."
>
> [Criar membro]
>
> "Informo nome, email e cargo. O sistema valida o formato do email e impede cadastros duplicados. Cada membro pode ser atribuído como responsável por tarefas. Também é possível editar informações ou remover membros."

**Ações:**
1. Navegar para página de Membros
2. Clicar em "Novo Membro"
3. Preencher formulário (nome, email válido, cargo)
4. Salvar e mostrar membro criado
5. Opcionalmente, tentar criar com email duplicado para mostrar validação

---

#### 5.4 CRUD de Tarefas e Kanban (1.5-2 minutos)

**Roteiro sugerido:**

> "Agora a funcionalidade principal: o gerenciamento de tarefas com quadro Kanban. Vou abrir um projeto..."
>
> [Abrir projeto]
>
> "Aqui vemos o quadro Kanban dividido em três colunas: A fazer, Em andamento e Concluído. Cada card de tarefa exibe título, prioridade com código de cores, responsável e data de entrega."
>
> "Vou criar uma nova tarefa..."
>
> [Criar tarefa]
>
> "Preencho título, descrição, seleciono o status inicial, defino a prioridade, atribuo um responsável e defino data de entrega. Ao salvar, a tarefa aparece na coluna correspondente ao seu status."
>
> "O sistema oferece filtros que permitem visualizar apenas tarefas de determinada prioridade, responsável ou status. Isso facilita muito quando temos muitas tarefas."
>
> [Demonstrar filtros]
>
> "Posso clicar em uma tarefa para editá-la. Por exemplo, vou mudar o status desta tarefa de 'A fazer' para 'Em andamento'..."
>
> [Editar tarefa, mudar status]
>
> "E ela automaticamente se move para a coluna correspondente. Esta visualização facilita muito o acompanhamento do progresso do projeto."

**Ações:**
1. Clicar em um projeto para abrir o Kanban
2. Mostrar as três colunas com tarefas
3. Criar nova tarefa com todos os campos preenchidos
4. Demonstrar filtros (escolher um filtro de prioridade, depois limpar)
5. Clicar em uma tarefa e editar seu status
6. Mostrar que a tarefa mudou de coluna

---

### 6. Testes Automatizados (30-45 segundos)

**Tempo:** 08:00 - 08:45

**Conteúdo:**
- Demonstrar execução dos testes
- Mostrar que todos passam
- Explicar cobertura (CRUD completo, validações)

**Roteiro sugerido:**

> "Um aspecto importante do projeto é a qualidade de código. Implementei testes automatizados para toda a API REST, cobrindo todas as operações CRUD, validações de dados e regras de negócio.
>
> Vou executar os testes..."
>
> [Executar npm test]
>
> "Como podem ver, todos os testes passaram com sucesso. Isso garante que as funcionalidades estão funcionando conforme esperado e facilita futuras manutenções."

**Ações:**
1. Abrir terminal
2. Executar `npm test`
3. Mostrar resultado dos testes passando
4. Comentar brevemente sobre os casos de teste

---

### 7. Conclusão (30-45 segundos)

**Tempo:** 08:45 - 09:30

**Conteúdo:**
- Resumo das funcionalidades implementadas
- Aprendizados obtidos
- Agradecimento

**Roteiro sugerido:**

> "Para concluir, este projeto implementou com sucesso um sistema completo de controle de tarefas e projetos, com:
>
> - CRUD completo para projetos, tarefas e membros
> - Visualização em quadro Kanban com três status
> - Sistema de filtros por prioridade, responsável e status
> - Dashboard com estatísticas e identificação de tarefas atrasadas
> - API REST bem estruturada
> - Interface responsiva e intuitiva
> - Testes automatizados garantindo qualidade
>
> Este trabalho proporcionou grande aprendizado sobre desenvolvimento web full-stack, arquitetura de software, modelagem de dados e boas práticas de programação.
>
> O código-fonte completo, documentação e instruções de instalação estão disponíveis no GitHub no repositório joaogpnfs/tarefas-gestor.
>
> Agradeço a atenção e fico à disposição para perguntas."

---

## Dicas de Gravação

### Antes de Gravar

- [ ] Executar `npm run seed` para popular com dados de exemplo
- [ ] Iniciar o servidor com `npm start`
- [ ] Testar todas as funcionalidades que serão demonstradas
- [ ] Limpar histórico e abas desnecessárias do navegador
- [ ] Aumentar zoom do navegador para melhor visualização
- [ ] Preparar janelas: navegador, VS Code, terminal
- [ ] Testar microfone e qualidade de áudio

### Durante a Gravação

- [ ] Falar de forma clara e pausada
- [ ] Manter ritmo constante (não muito rápido nem lento)
- [ ] Mostrar cursor do mouse para facilitar acompanhamento
- [ ] Evitar longos silêncios
- [ ] Se errar, pode pausar e recomeçar a seção
- [ ] Manter energia e entusiasmo na voz
- [ ] Não ultrapassar 9 minutos

### Após a Gravação

- [ ] Revisar o vídeo completo
- [ ] Verificar se áudio está claro
- [ ] Verificar se todas as funcionalidades foram demonstradas
- [ ] Adicionar vinheta com dados do projeto (opcional)
- [ ] Exportar em formato compatível (MP4, 1080p recomendado)

---

## Estrutura de Pastas para Referência

Durante a explicação da arquitetura, pode ser útil mostrar:

```
tarefas-gestor/
├── src/
│   ├── database/        # Banco de dados
│   ├── models/          # Lógica de negócio
│   ├── routes/          # API REST
│   ├── server.js        # Servidor Express
│   └── seed.js          # Dados de exemplo
├── public/              # Frontend
│   ├── index.html
│   ├── css/
│   └── js/
├── test/                # Testes automatizados
├── docs/                # Landing page
└── documentacao/        # Documentação técnica
```

---

## Checklist Final

Antes de gravar, confirme que:

- [ ] Banco de dados populado com dados de exemplo (`npm run seed`)
- [ ] Servidor rodando (`npm start`)
- [ ] Todos os CRUDs funcionam
- [ ] Filtros funcionam
- [ ] Dashboard mostra estatísticas corretas
- [ ] Testes passam (`npm test`)
- [ ] Navegador configurado (zoom, abas limpas)
- [ ] Roteiro revisado
- [ ] Tempo cronometrado (6-9 minutos)

---

**Boa sorte na gravação! 🎬**
