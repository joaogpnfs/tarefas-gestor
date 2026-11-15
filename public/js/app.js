const API_URL = 'http://localhost:4321/api';

const app = {
  currentProjeto: null,
  membros: [],

  init() {
    this.setupNavigation();
    this.loadDashboard();
    this.loadMembros();
  },

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
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
      container.innerHTML = '<p class="empty-state">Nenhuma tarefa atrasada 🎉</p>';
      return;
    }

    container.innerHTML = tarefas.map(t => `
      <div class="tarefa-atrasada-card">
        <h4>${t.titulo}</h4>
        <p><strong>Projeto:</strong> ${t.projeto_nome}</p>
        <p><strong>Data de Entrega:</strong> ${this.formatDate(t.data_entrega)}</p>
        ${t.responsavel_nome ? `<p><strong>Responsável:</strong> ${t.responsavel_nome}</p>` : ''}
      </div>
    `).join('');
  },

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
      container.innerHTML = '<p class="empty-state">Nenhum projeto cadastrado</p>';
      return;
    }

    container.innerHTML = projetos.map(p => `
      <div class="projeto-card" style="border-left-color: ${p.cor}" onclick="app.viewProjeto(${p.id})">
        <h3>${p.nome}</h3>
        <p>${p.descricao || 'Sem descrição'}</p>
        <div class="projeto-stats">
          <span>📅 ${this.formatDate(p.criado_em)}</span>
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

    document.getElementById('kanban-a-fazer').innerHTML = this.renderTarefaCards(aFazer);
    document.getElementById('kanban-em-andamento').innerHTML = this.renderTarefaCards(emAndamento);
    document.getElementById('kanban-concluido').innerHTML = this.renderTarefaCards(concluido);
  },

  renderTarefaCards(tarefas) {
    if (tarefas.length === 0) {
      return '<p class="empty-state">Nenhuma tarefa</p>';
    }

    return tarefas.map(t => {
      const prioClass = t.prioridade.toLowerCase().replace('é', 'e').replace('á', 'a');
      const badgeClass = prioClass === 'baixa' ? 'badge-baixa' : prioClass === 'media' ? 'badge-media' : 'badge-alta';
      
      return `
        <div class="tarefa-card prioridade-${prioClass}" onclick="app.editTarefa(${t.id})">
          <h4>${t.titulo}</h4>
          <div class="tarefa-info">
            <span class="tarefa-badge ${badgeClass}">${t.prioridade}</span>
            ${t.responsavel_nome ? `<span>👤 ${t.responsavel_nome}</span>` : '<span>👤 Sem responsável</span>'}
            ${t.data_entrega ? `<span>📅 ${this.formatDate(t.data_entrega)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

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
      container.innerHTML = '<p class="empty-state">Nenhum membro cadastrado</p>';
      return;
    }

    container.innerHTML = membros.map(m => `
      <div class="membro-card">
        <div class="membro-avatar">${this.getInitials(m.nome)}</div>
        <h3>${m.nome}</h3>
        <p class="email">${m.email}</p>
        ${m.cargo ? `<p class="cargo">${m.cargo}</p>` : ''}
        <div class="membro-actions">
          <button class="btn-icon" onclick="app.editMembroModal(${m.id})" title="Editar">✏️</button>
          <button class="btn-icon" onclick="app.deleteMembro(${m.id})" title="Excluir">🗑️</button>
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

  showProjetoModal(projeto = null) {
    document.getElementById('projeto-modal-title').textContent = projeto ? 'Editar Projeto' : 'Novo Projeto';
    document.getElementById('projeto-id').value = projeto ? projeto.id : '';
    document.getElementById('projeto-nome').value = projeto ? projeto.nome : '';
    document.getElementById('projeto-descricao').value = projeto ? projeto.descricao || '' : '';
    document.getElementById('projeto-cor').value = projeto ? projeto.cor : '#3B82F6';
    
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
        this.showToast('Projeto atualizado com sucesso', 'success');
      } else {
        await this.fetch('/projetos', 'POST', data);
        this.showToast('Projeto criado com sucesso', 'success');
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
        this.showToast('Tarefa atualizada com sucesso', 'success');
      } else {
        await this.fetch('/tarefas', 'POST', data);
        this.showToast('Tarefa criada com sucesso', 'success');
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
        this.showToast('Membro atualizado com sucesso', 'success');
      } else {
        await this.fetch('/membros', 'POST', data);
        this.showToast('Membro criado com sucesso', 'success');
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
      this.showToast('Membro excluído com sucesso', 'success');
      await this.loadMembros();
      this.loadMembrosPage();
    } catch (error) {
      this.showToast('Erro ao excluir membro', 'error');
    }
  },

  showModal(id) {
    document.getElementById(id).classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  },

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
