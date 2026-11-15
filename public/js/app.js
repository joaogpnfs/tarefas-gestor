const API_URL = 'http://localhost:4321/api';

const app = {
  currentProjeto: null,
  membros: [],
  theme: localStorage.getItem('theme') || 'dark',

  init() {
    this.applyTheme();
    this.setupNavigation();
    this.setupDragAndDrop();
    this.loadDashboard();
    this.loadMembros();
  },

  // Theme Management
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const label = document.getElementById('theme-label');
    const icon = document.querySelector('.theme-toggle svg use');
    if (this.theme === 'dark') {
      label.textContent = 'Modo Claro';
      icon.setAttribute('href', '#icon-sun');
    } else {
      label.textContent = 'Modo Escuro';
      icon.setAttribute('href', '#icon-moon');
    }
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  },

  // Navigation
  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    document.getElementById(`${page}-page`).classList.add('active');

    if (page === 'dashboard') {
      this.loadDashboard();
    } else if (page === 'projetos') {
      this.loadProjetos();
    } else if (page === 'membros') {
      this.loadMembrosPage();
    }
  },

  // Drag and Drop for Kanban
  setupDragAndDrop() {
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('task-card')) {
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
        e.dataTransfer.setData('taskId', e.target.dataset.taskId);
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('task-card')) {
        e.target.classList.remove('dragging');
      }
    });

    document.addEventListener('dragover', (e) => {
      if (e.target.classList.contains('kanban-tasks')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    });

    document.addEventListener('dragenter', (e) => {
      if (e.target.classList.contains('kanban-tasks')) {
        e.target.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      if (e.target.classList.contains('kanban-tasks')) {
        e.target.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', async (e) => {
      if (e.target.classList.contains('kanban-tasks')) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const taskId = e.dataTransfer.getData('taskId');
        const newStatus = e.target.dataset.status;
        
        if (taskId && newStatus) {
          await this.updateTaskStatus(taskId, newStatus);
        }
      }
    });
  },

  async updateTaskStatus(taskId, newStatus) {
    try {
      const tarefa = await this.fetch(`/tarefas/${taskId}`);
      await this.fetch(`/tarefas/${taskId}`, 'PUT', {
        ...tarefa,
        status: newStatus
      });
      this.showToast('Status atualizado!', 'success');
      this.loadTarefas();
    } catch (error) {
      this.showToast('Erro ao atualizar status', 'error');
    }
  },

  // Dashboard
  async loadDashboard() {
    try {
      const stats = await this.fetch('/dashboard/stats');
      
      document.getElementById('stat-projetos').textContent = stats.total_projetos;
      document.getElementById('stat-tarefas').textContent = stats.total_tarefas;
      document.getElementById('stat-membros').textContent = stats.total_membros;
      document.getElementById('stat-atrasadas').textContent = stats.tarefas_atrasadas;
      
      document.getElementById('count-a-fazer').textContent = stats.tarefas_a_fazer;
      document.getElementById('count-em-andamento').textContent = stats.tarefas_em_andamento;
      document.getElementById('count-concluido').textContent = stats.tarefas_concluidas;

      const atrasadas = await this.fetch('/tarefas/atrasadas/lista');
      this.renderTarefasAtrasadas(atrasadas);
    } catch (error) {
      this.showToast('Erro ao carregar dashboard', 'error');
    }
  },

  renderTarefasAtrasadas(tarefas) {
    const container = document.getElementById('tarefas-atrasadas-list');
    
    if (tarefas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎉</div>
          <div class="empty-state-text">Nenhuma tarefa atrasada</div>
          <div class="empty-state-hint">Todas as tarefas estão em dia!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = tarefas.map(t => `
      <div class="task-card" style="margin-bottom: 12px;">
        <h4>${t.titulo}</h4>
        <div class="task-meta">
          <div class="task-meta-row">
            <span class="task-info">
              <svg width="14" height="14"><use href="#icon-grid"/></svg>
              ${t.projeto_nome}
            </span>
          </div>
          <div class="task-meta-row">
            <span class="task-info">
              <svg width="14" height="14"><use href="#icon-calendar"/></svg>
              ${this.formatDate(t.data_entrega)}
            </span>
            ${t.responsavel_nome ? `
              <span class="task-info">
                <svg width="14" height="14"><use href="#icon-user"/></svg>
                ${t.responsavel_nome}
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  },

  // Projetos
  async loadProjetos() {
    try {
      const projetos = await this.fetch('/projetos');
      this.renderProjetos(projetos);
    } catch (error) {
      this.showToast('Erro ao carregar projetos', 'error');
    }
  },

  renderProjetos(projetos) {
    const container = document.getElementById('projetos-list');
    
    if (projetos.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📁</div>
          <div class="empty-state-text">Nenhum projeto cadastrado</div>
          <div class="empty-state-hint">Crie seu primeiro projeto para começar</div>
        </div>
      `;
      return;
    }

    container.innerHTML = projetos.map(p => `
      <div class="project-card" onclick="app.viewProjeto(${p.id})">
        <div class="project-color-bar" style="background: ${p.cor}"></div>
        <div class="project-content">
          <h3>${p.nome}</h3>
          <p>${p.descricao || 'Sem descrição'}</p>
          <div class="project-meta">
            <span>
              <svg width="14" height="14"><use href="#icon-calendar"/></svg>
              ${this.formatDate(p.criado_em)}
            </span>
          </div>
        </div>
      </div>
    `).join('');
  },

  async viewProjeto(id) {
    try {
      const projeto = await this.fetch(`/projetos/${id}`);
      this.currentProjeto = projeto;
      
      document.getElementById('view-projeto-nome').textContent = projeto.nome;
      document.getElementById('view-projeto-descricao').textContent = projeto.descricao || 'Sem descrição';
      
      await this.loadMembrosSelect();
      await this.loadTarefas();
      
      this.showModal('view-projeto-modal');
    } catch (error) {
      this.showToast('Erro ao carregar projeto', 'error');
    }
  },

  async loadTarefas() {
    if (!this.currentProjeto) return;

    const filters = {
      projeto_id: this.currentProjeto.id,
      status: document.getElementById('filter-status').value,
      prioridade: document.getElementById('filter-prioridade').value,
      responsavel_id: document.getElementById('filter-responsavel').value
    };

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const tarefas = await this.fetch(`/tarefas?${params}`);
      this.renderKanban(tarefas);
    } catch (error) {
      this.showToast('Erro ao carregar tarefas', 'error');
    }
  },

  renderKanban(tarefas) {
    const aFazer = tarefas.filter(t => t.status === 'A fazer');
    const emAndamento = tarefas.filter(t => t.status === 'Em andamento');
    const concluido = tarefas.filter(t => t.status === 'Concluído');

    document.getElementById('count-todo').textContent = aFazer.length;
    document.getElementById('count-doing').textContent = emAndamento.length;
    document.getElementById('count-done').textContent = concluido.length;

    document.getElementById('kanban-a-fazer').innerHTML = this.renderTarefaCards(aFazer);
    document.getElementById('kanban-em-andamento').innerHTML = this.renderTarefaCards(emAndamento);
    document.getElementById('kanban-concluido').innerHTML = this.renderTarefaCards(concluido);
  },

  renderTarefaCards(tarefas) {
    if (tarefas.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon" style="font-size: 32px;">📝</div>
          <div class="empty-state-text" style="font-size: 13px;">Nenhuma tarefa</div>
        </div>
      `;
    }

    return tarefas.map(t => {
      const prioClass = t.prioridade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      return `
        <div class="task-card" draggable="true" data-task-id="${t.id}" onclick="app.editTarefa(${t.id})">
          <h4>${t.titulo}</h4>
          <div class="task-meta">
            <div class="task-meta-row">
              <span class="priority-badge ${prioClass}">${t.prioridade}</span>
            </div>
            ${t.responsavel_nome || t.data_entrega ? `
              <div class="task-meta-row">
                ${t.responsavel_nome ? `
                  <span class="task-info">
                    <svg width="14" height="14"><use href="#icon-user"/></svg>
                    ${t.responsavel_nome}
                  </span>
                ` : ''}
                ${t.data_entrega ? `
                  <span class="task-info">
                    <svg width="14" height="14"><use href="#icon-calendar"/></svg>
                    ${this.formatDate(t.data_entrega)}
                  </span>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // Membros
  async loadMembrosPage() {
    try {
      const membros = await this.fetch('/membros');
      this.renderMembros(membros);
    } catch (error) {
      this.showToast('Erro ao carregar membros', 'error');
    }
  },

  renderMembros(membros) {
    const container = document.getElementById('membros-list');
    
    if (membros.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-text">Nenhum membro cadastrado</div>
          <div class="empty-state-hint">Adicione membros à sua equipe</div>
        </div>
      `;
      return;
    }

    container.innerHTML = membros.map(m => `
      <div class="member-card">
        <div class="member-avatar">${this.getInitials(m.nome)}</div>
        <h3>${m.nome}</h3>
        <p class="member-email">${m.email}</p>
        ${m.cargo ? `<p class="member-role">${m.cargo}</p>` : ''}
        <div class="member-actions">
          <button class="btn-icon" onclick="app.editMembroModal(${m.id})" title="Editar">
            <svg width="16" height="16"><use href="#icon-edit"/></svg>
          </button>
          <button class="btn-icon" onclick="app.deleteMembro(${m.id})" title="Excluir">
            <svg width="16" height="16"><use href="#icon-trash"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  },

  async loadMembrosSelect() {
    const responsavelSelect = document.getElementById('tarefa-responsavel');
    const filterSelect = document.getElementById('filter-responsavel');
    
    const options = this.membros.map(m => 
      `<option value="${m.id}">${m.nome}</option>`
    ).join('');
    
    responsavelSelect.innerHTML = '<option value="">Sem responsável</option>' + options;
    filterSelect.innerHTML = '<option value="">Todos os Responsáveis</option>' + options;
  },

  async loadMembros() {
    try {
      this.membros = await this.fetch('/membros');
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    }
  },

  // Modals - Projeto
  showProjetoModal(projeto = null) {
    document.getElementById('projeto-modal-title').textContent = projeto ? 'Editar Projeto' : 'Novo Projeto';
    document.getElementById('projeto-id').value = projeto ? projeto.id : '';
    document.getElementById('projeto-nome').value = projeto ? projeto.nome : '';
    document.getElementById('projeto-descricao').value = projeto ? projeto.descricao || '' : '';
    document.getElementById('projeto-cor').value = projeto ? projeto.cor : '#8b5cf6';
    
    this.showModal('projeto-modal');
  },

  async saveProjeto(event) {
    event.preventDefault();
    
    const id = document.getElementById('projeto-id').value;
    const data = {
      nome: document.getElementById('projeto-nome').value,
      descricao: document.getElementById('projeto-descricao').value,
      cor: document.getElementById('projeto-cor').value
    };

    try {
      if (id) {
        await this.fetch(`/projetos/${id}`, 'PUT', data);
        this.showToast('Projeto atualizado!', 'success');
      } else {
        await this.fetch('/projetos', 'POST', data);
        this.showToast('Projeto criado!', 'success');
      }
      
      this.closeModal('projeto-modal');
      this.loadProjetos();
    } catch (error) {
      this.showToast(error.message || 'Erro ao salvar projeto', 'error');
    }
  },

  editProjeto() {
    this.closeModal('view-projeto-modal');
    this.showProjetoModal(this.currentProjeto);
  },

  // Modals - Tarefa
  showTarefaModal(tarefa = null) {
    document.getElementById('tarefa-modal-title').textContent = tarefa ? 'Editar Tarefa' : 'Nova Tarefa';
    document.getElementById('tarefa-id').value = tarefa ? tarefa.id : '';
    document.getElementById('tarefa-projeto-id').value = tarefa ? tarefa.projeto_id : this.currentProjeto.id;
    document.getElementById('tarefa-titulo').value = tarefa ? tarefa.titulo : '';
    document.getElementById('tarefa-descricao').value = tarefa ? tarefa.descricao || '' : '';
    document.getElementById('tarefa-status').value = tarefa ? tarefa.status : 'A fazer';
    document.getElementById('tarefa-prioridade').value = tarefa ? tarefa.prioridade : 'Média';
    document.getElementById('tarefa-responsavel').value = tarefa ? tarefa.responsavel_id || '' : '';
    document.getElementById('tarefa-data-entrega').value = tarefa ? tarefa.data_entrega || '' : '';
    
    this.showModal('tarefa-modal');
  },

  async saveTarefa(event) {
    event.preventDefault();
    
    const id = document.getElementById('tarefa-id').value;
    const data = {
      projeto_id: parseInt(document.getElementById('tarefa-projeto-id').value),
      titulo: document.getElementById('tarefa-titulo').value,
      descricao: document.getElementById('tarefa-descricao').value,
      status: document.getElementById('tarefa-status').value,
      prioridade: document.getElementById('tarefa-prioridade').value,
      responsavel_id: document.getElementById('tarefa-responsavel').value || null,
      data_entrega: document.getElementById('tarefa-data-entrega').value || null
    };

    try {
      if (id) {
        await this.fetch(`/tarefas/${id}`, 'PUT', data);
        this.showToast('Tarefa atualizada!', 'success');
      } else {
        await this.fetch('/tarefas', 'POST', data);
        this.showToast('Tarefa criada!', 'success');
      }
      
      this.closeModal('tarefa-modal');
      this.loadTarefas();
    } catch (error) {
      this.showToast(error.message || 'Erro ao salvar tarefa', 'error');
    }
  },

  async editTarefa(id) {
    try {
      const tarefa = await this.fetch(`/tarefas/${id}`);
      this.showTarefaModal(tarefa);
    } catch (error) {
      this.showToast('Erro ao carregar tarefa', 'error');
    }
  },

  // Modals - Membro
  showMembroModal(membro = null) {
    document.getElementById('membro-modal-title').textContent = membro ? 'Editar Membro' : 'Novo Membro';
    document.getElementById('membro-id').value = membro ? membro.id : '';
    document.getElementById('membro-nome').value = membro ? membro.nome : '';
    document.getElementById('membro-email').value = membro ? membro.email : '';
    document.getElementById('membro-cargo').value = membro ? membro.cargo || '' : '';
    
    this.showModal('membro-modal');
  },

  async saveMembro(event) {
    event.preventDefault();
    
    const id = document.getElementById('membro-id').value;
    const data = {
      nome: document.getElementById('membro-nome').value,
      email: document.getElementById('membro-email').value,
      cargo: document.getElementById('membro-cargo').value
    };

    try {
      if (id) {
        await this.fetch(`/membros/${id}`, 'PUT', data);
        this.showToast('Membro atualizado!', 'success');
      } else {
        await this.fetch('/membros', 'POST', data);
        this.showToast('Membro criado!', 'success');
      }
      
      this.closeModal('membro-modal');
      await this.loadMembros();
      this.loadMembrosPage();
    } catch (error) {
      this.showToast(error.message || 'Erro ao salvar membro', 'error');
    }
  },

  async editMembroModal(id) {
    try {
      const membro = await this.fetch(`/membros/${id}`);
      this.showMembroModal(membro);
    } catch (error) {
      this.showToast('Erro ao carregar membro', 'error');
    }
  },

  async deleteMembro(id) {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;

    try {
      await this.fetch(`/membros/${id}`, 'DELETE');
      this.showToast('Membro excluído!', 'success');
      await this.loadMembros();
      this.loadMembrosPage();
    } catch (error) {
      this.showToast('Erro ao excluir membro', 'error');
    }
  },

  // Modal helpers
  showModal(id) {
    document.getElementById(id).classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  // Toast
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  },

  // API
  async fetch(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro na requisição');
    }

    if (method === 'DELETE') {
      return null;
    }

    return response.json();
  },

  // Helpers
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  },

  getInitials(name) {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
};

window.addEventListener('DOMContentLoaded', () => app.init());
