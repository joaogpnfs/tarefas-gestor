# Roteiro do Vídeo de Defesa – Taskora

**Aluno:** João Gabriel Pereira Nascimento Feitosa da Silva – RA 263466036
**Curso:** Engenharia de Software – UniFil
**Disciplinas:** Projeto e Desenvolvimento de Sistemas I e II
**Duração máxima:** 10 minutos (meta: 8 a 9 minutos)

Este roteiro é um guia. Grave com a sua voz e fale com as suas palavras: as falas sugeridas servem só de apoio, não precisam ser lidas ao pé da letra.

---

## Preparação (antes de gravar)

1. Rode o projeto do zero para garantir que está tudo funcionando:
   ```bash
   npm install
   cd web && npm install && npm run build && cd ..
   npm run build
   npm run seed
   npm start
   ```
2. Abra **http://localhost:4321** no navegador, no modo claro, com zoom em 100%.
3. Deixe abertos o VS Code (com a pasta do projeto) e um terminal na raiz do projeto.
4. Feche notificações, abas pessoais e programas que não serão usados.
5. Use um gravador de tela com microfone (OBS Studio, ou Cmd + Shift + 5 no Mac) em 1080p.
6. Faça um teste de 20 segundos para conferir o áudio.

> Dica: rode `npm run seed` de novo logo antes de gravar, para os dados de demonstração estarem completos e as datas atualizadas.

---

## Estrutura e tempos

| Bloco | Tema | Tempo |
|-------|------|-------|
| 1 | Apresentação e problema | 0:00 – 0:45 |
| 2 | Arquitetura, stack e banco de dados | 0:45 – 2:30 |
| 3 | Demonstração da interface | 2:30 – 6:30 |
| 4 | Código: rota, modelo e arrastar e soltar | 6:30 – 8:15 |
| 5 | Testes automatizados | 8:15 – 9:00 |
| 6 | Conclusão | 9:00 – 9:40 |

---

## Bloco 1 – Apresentação e problema (0:00 – 0:45)

**Na tela:** tela inicial do Taskora.

**Fala sugerida:**
"Olá, meu nome é João Gabriel Pereira Nascimento Feitosa da Silva, RA 263466036, do curso de Engenharia de Software da UniFil. Este é o Taskora, o meu projeto para as disciplinas de Projeto e Desenvolvimento de Sistemas I e II. É um sistema de controle de tarefas e projetos. A ideia surgiu porque equipes pequenas costumam organizar tarefas em planilhas ou grupos de mensagem, e fica difícil saber quem está fazendo o quê e o que está atrasado. Por isso eu me inspirei em duas ferramentas: o Notion, nas páginas de projeto, e o Trello, no quadro Kanban."

---

## Bloco 2 – Arquitetura, stack e banco de dados (0:45 – 2:30)

**Na tela:** documentação (PDF) no diagrama de arquitetura e depois no modelo ER. Se preferir, mostre a árvore de pastas no VS Code.

**Pontos para falar:**
- Arquitetura cliente-servidor em camadas: o frontend em React chama a API REST, a API tem rotas, modelos e a camada de acesso ao banco.
- **Backend:** Node.js, Express 5 e TypeScript, com banco **SQLite** pelo `better-sqlite3`.
- **Frontend:** React 19 com TypeScript e Vite, Tailwind CSS, componentes no padrão shadcn/ui, ícones lucide-react, gráficos com recharts, arrastar e soltar com @dnd-kit e notificações com sonner.
- No modelo ER, mostrar as três tabelas: **projetos**, **tarefas** e **membros**.
- Um projeto tem muitas tarefas, com **ON DELETE CASCADE**. Um membro pode ser responsável por várias tarefas, com **ON DELETE SET NULL**.
- Status e prioridade têm **CHECK** no banco, e o e-mail do membro é **UNIQUE**.
- As colunas novas (emoji, capa, etiquetas, checklist) são adicionadas por uma **migração automática** em `schema.ts`, então um banco antigo continua funcionando.

**Fala de apoio:** "Eu escolhi o SQLite porque ele não precisa de servidor instalado, então qualquer pessoa consegue rodar o projeto, mas ele continua sendo um banco relacional de verdade, com chave estrangeira e restrições."

---

## Bloco 3 – Demonstração da interface (2:30 – 6:30)

### 3.1. Tela inicial (30 s)
- Mostre a saudação, os quatro indicadores, o gráfico de rosca por status e o de barras por prioridade.
- Mostre o progresso dos projetos, "Minhas tarefas" (Hoje, Atrasadas, Próximas) e os prazos da semana.

### 3.2. Criar um projeto (40 s)
- Clique em **Novo projeto** na barra lateral.
- Preencha o nome (por exemplo, "Projeto da Defesa"), escolha um emoji, uma capa e um prazo, e crie.
- Mostre que ele aparece na barra lateral e abre a página com capa e ícone.
- Edite o título ou a descrição direto na página para mostrar o **Update**.

### 3.3. Criar e mover cartões (1 min 10 s)
- Abra um projeto com dados, como o **Portal Acadêmico**, na visualização **Quadro**.
- Clique em **Adicionar cartão** na lista "A fazer", preencha título, prioridade, responsável, data de entrega e etiquetas, e crie (**Create**).
- **Arraste o cartão** para "Em andamento" e depois para "Concluído". Comente que o status é salvo no banco na hora.
- Recarregue a página (F5) para provar que a mudança ficou gravada.

### 3.4. Detalhe do cartão (40 s)
- Clique em um cartão para abrir o detalhe.
- Mostre responsável, etiquetas (adicione uma), data de entrega, descrição e a barra do checklist (clique em "Adicionar item" e "Marcar concluído").
- Use **Mover** e **Prioridade** na coluna de ações.
- No final, **exclua** o cartão de teste (**Delete**) e mostre a notificação.

### 3.5. Outras visualizações (40 s)
- Troque para **Tabela**, **Lista** e **Calendário** no mesmo projeto.
- Vá em **Todas as tarefas** e use os filtros de prioridade, responsável e projeto.
- Aperte **Ctrl + K** (ou Cmd + K) e busque uma tarefa.

### 3.6. Membros e modo escuro (20 s)
- Abra **Membros**, mostre a galeria e cadastre um membro rápido. Se quiser, mostre o erro de e-mail inválido.
- Clique no ícone da lua no canto superior direito para mostrar o **modo escuro**.

---

## Bloco 4 – Código (6:30 – 8:15)

**Na tela:** VS Code. Aumente a fonte do editor para ficar legível no vídeo.

1. **`src/server.ts`** (20 s): mostre o Express registrando as rotas `/api/projetos`, `/api/tarefas`, `/api/membros` e `/api/dashboard`, e servindo o `web/dist` do frontend.
2. **`src/database/schema.ts`** (25 s): mostre o `CREATE TABLE` das tarefas com as chaves estrangeiras e os CHECKs, e a função `migrateOptionalColumns`.
3. **`src/models/Tarefa.ts`** (25 s): mostre a validação do título no `create` e o `update` parcial, que monta o SQL só com os campos enviados e usa parâmetros `?` (evita SQL injection).
4. **`web/src/components/views/BoardView.tsx`** (20 s): mostre o `DndContext` do @dnd-kit e o `onDragEnd`, que descobre a lista de destino e chama `updateTarefa` com o novo status.
5. **`web/src/lib/data.tsx`** (15 s): mostre o `updateTarefa` com atualização otimista: a tela muda na hora e, se a API der erro, volta ao estado anterior e mostra uma notificação.

**Fala de apoio:** "Essa é a sequência que está no diagrama de sequência da documentação: o quadro chama o estado global, que chama a API, que chama o modelo, que atualiza o banco."

---

## Bloco 5 – Testes automatizados (8:15 – 9:00)

**Na tela:** terminal e `test/api.test.ts`.

- Mostre rapidamente o arquivo de testes e os grupos: Projetos, Membros, Tarefas, Campos opcionais e Dashboard.
- Rode:
  ```bash
  npm test
  ```
- Mostre o resultado **28 passing**.
- Explique que os testes usam um banco separado (`database-test.db`), então não mexem nos dados reais, e que as mensagens de erro no console são dos testes que enviam dados inválidos de propósito.

---

## Bloco 6 – Conclusão (9:00 – 9:40)

**Na tela:** repositório no GitHub (https://github.com/joaogpnfs/tarefas-gestor) mostrando o histórico de commits, e depois a página https://joaogpnfs.github.io/tarefas-gestor/.

**Fala sugerida (adapte com a sua opinião):**
"Para concluir: o Taskora tem CRUD completo de projetos, tarefas e membros, banco relacional, quatro visualizações, arrastar e soltar e 28 testes automatizados. O projeto começou em JavaScript puro, versão que ficou guardada na tag v1.0-vanilla, e depois eu migrei tudo para TypeScript e React. O que eu mais aprendi foi [fale aqui, com as suas palavras, o que foi mais importante para você]. Como próximos passos, eu colocaria autenticação de usuários e notificações de prazo. Obrigado!"

---

## Depois de gravar

1. Assista ao vídeo inteiro e confira o áudio e o tempo (até 10 minutos).
2. Envie ao YouTube como **Não listado** e copie o link.
3. Na entrega do Canvas, coloque o link do repositório, o link do commit ou da tag e o link do vídeo.

## Checklist

- [ ] Projeto roda do zero com os comandos da preparação
- [ ] `npm run seed` executado antes de gravar
- [ ] Nome e RA falados no começo
- [ ] Arquitetura, stack e banco explicados
- [ ] Create, Read, Update e Delete demonstrados na interface
- [ ] Arrastar e soltar demonstrado e conferido após recarregar a página
- [ ] Quadro, tabela, lista, calendário e modo escuro mostrados
- [ ] Código do backend e do arrastar e soltar mostrado
- [ ] `npm test` com 28 testes passando
- [ ] Vídeo com até 10 minutos, enviado como não listado
