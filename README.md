# Sistema de Controle de Tarefas e Projetos

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-success)](https://joaogpnfs.github.io/tarefas-gestor/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Sistema web para gerenciamento de tarefas e projetos com visualização Kanban, desenvolvido como projeto da disciplina Projeto e Desenvolvimento de Sistemas I do curso de Engenharia de Software da UniFil.

![Dashboard](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Dashboard+do+Sistema)

## 📋 Sobre o Projeto

O Sistema de Controle de Tarefas e Projetos é uma aplicação web inspirada em ferramentas como Trello, que permite o gerenciamento visual de projetos e suas tarefas através de quadros Kanban. O sistema oferece CRUD completo para projetos, tarefas e membros da equipe, além de dashboard com estatísticas e identificação de tarefas atrasadas.

**Desenvolvido por:** João Gabriel Pereira Nascimento Feitosa da Silva  
**RA:** 263466036  
**Instituição:** Universidade Filadélfia (UniFil)  
**Ano:** 2026

## ✨ Funcionalidades

### Projetos
- ✅ Criar, listar, editar e excluir projetos
- 🎨 Personalização de cores para identificação visual
- 📊 Visualização de estatísticas por projeto

### Tarefas
- ✅ CRUD completo de tarefas
- 📋 Quadro Kanban com três colunas (A fazer, Em andamento, Concluído)
- 🏷️ Sistema de prioridades (Baixa, Média, Alta) com código de cores
- 👤 Atribuição de responsáveis
- 📅 Definição de datas de entrega
- 🔍 Filtros por prioridade, responsável e status
- ⚠️ Identificação automática de tarefas atrasadas

### Membros
- ✅ Gerenciamento de membros da equipe
- ✉️ Validação de email com verificação de duplicidade
- 👥 Atribuição de cargos

### Dashboard
- 📊 Estatísticas gerais do sistema
- 📈 Contadores por status
- 🚨 Lista de tarefas atrasadas

### Interface
- 📱 Design responsivo para desktop e mobile
- 🎨 Interface moderna e intuitiva
- ⚡ Feedback visual com mensagens toast
- 🎯 Navegação fluida entre páginas

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm (gerenciador de pacotes do Node.js)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaogpnfs/tarefas-gestor.git
cd tarefas-gestor
```

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Popule o banco com dados de exemplo:
```bash
npm run seed
```

4. Inicie o servidor:
```bash
npm start
```

5. Acesse no navegador:
```
http://localhost:4321
```

## 🧪 Como Executar os Testes

Execute os testes automatizados da API:

```bash
npm test
```

Os testes cobrem:
- ✅ Todas as operações CRUD
- ✅ Validações de dados
- ✅ Regras de negócio
- ✅ Filtros e consultas especializadas
- ✅ Estatísticas e agregações

## 📁 Estrutura do Projeto

```
tarefas-gestor/
├── src/
│   ├── database/
│   │   ├── schema.js          # Schema do banco SQLite
│   │   └── connection.js      # Gerenciamento de conexão
│   ├── models/
│   │   ├── Projeto.js         # Model de Projeto
│   │   ├── Tarefa.js          # Model de Tarefa
│   │   └── Membro.js          # Model de Membro
│   ├── routes/
│   │   ├── projetos.js        # Rotas da API de projetos
│   │   ├── tarefas.js         # Rotas da API de tarefas
│   │   ├── membros.js         # Rotas da API de membros
│   │   └── dashboard.js       # Rotas do dashboard
│   ├── server.js              # Configuração do servidor Express
│   └── seed.js                # Script de dados de exemplo
├── public/
│   ├── index.html             # Página principal
│   ├── css/
│   │   └── style.css          # Estilos da aplicação
│   └── js/
│       └── app.js             # Lógica do frontend
├── test/
│   └── api.test.js            # Testes da API
├── docs/
│   └── index.html             # Landing page (GitHub Pages)
├── documentacao/
│   ├── documentacao.md        # Documentação técnica completa
│   └── roteiro-video.md       # Roteiro para vídeo de defesa
├── package.json               # Dependências e scripts
└── README.md                  # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para APIs
- **better-sqlite3** - Driver SQLite para Node.js
- **cors** - Middleware para CORS

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e layout responsivo
- **JavaScript (ES6+)** - Interatividade e comunicação com API

### Testes
- **Mocha** - Framework de testes
- **Chai** - Biblioteca de asserções
- **Supertest** - Testes de API HTTP

### Banco de Dados
- **SQLite** - Banco de dados relacional leve

## 📡 Endpoints da API

### Projetos
- `GET /api/projetos` - Listar todos os projetos
- `GET /api/projetos/:id` - Buscar projeto por ID
- `POST /api/projetos` - Criar novo projeto
- `PUT /api/projetos/:id` - Atualizar projeto
- `DELETE /api/projetos/:id` - Deletar projeto

### Tarefas
- `GET /api/tarefas` - Listar todas as tarefas
- `GET /api/tarefas/:id` - Buscar tarefa por ID
- `GET /api/tarefas?projeto_id={id}` - Filtrar tarefas por projeto
- `GET /api/tarefas/atrasadas/lista` - Listar tarefas atrasadas
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/:id` - Atualizar tarefa
- `DELETE /api/tarefas/:id` - Deletar tarefa

### Membros
- `GET /api/membros` - Listar todos os membros
- `GET /api/membros/:id` - Buscar membro por ID
- `POST /api/membros` - Criar novo membro
- `PUT /api/membros/:id` - Atualizar membro
- `DELETE /api/membros/:id` - Deletar membro

### Dashboard
- `GET /api/dashboard/stats` - Obter estatísticas gerais

## 📚 Documentação

A documentação técnica completa do projeto está disponível em:
- [Documentação Técnica](documentacao/documentacao.md)
- [Roteiro para Vídeo](documentacao/roteiro-video.md)

A documentação inclui:
- Requisitos funcionais e não funcionais
- Casos de uso
- Diagrama de classes
- Modelo Entidade-Relacionamento
- Arquitetura do sistema
- Análise de riscos (FMEA)
- Plano de testes

## 🎯 Scripts Disponíveis

```bash
# Iniciar o servidor
npm start

# Executar testes
npm test

# Popular banco com dados de exemplo
npm run seed
```

## 🌐 Links

- **Repositório GitHub:** https://github.com/joaogpnfs/tarefas-gestor
- **GitHub Pages:** https://joaogpnfs.github.io/tarefas-gestor/

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina Projeto e Desenvolvimento de Sistemas I.

---

**Universidade Filadélfia (UniFil)** | Engenharia de Software | 2026
