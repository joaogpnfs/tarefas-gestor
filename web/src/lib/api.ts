const API_BASE = '/api';

export interface Membro {
  id: number;
  nome: string;
  email: string;
  cargo: string | null;
  criado_em: string;
}

export interface Projeto {
  id: number;
  nome: string;
  descricao: string | null;
  cor: string;
  emoji?: string;
  capa?: string | null;
  prazo?: string | null;
  criado_em: string;
  atualizado_em: string;
  stats?: {
    total: number;
    a_fazer: number;
    em_andamento: number;
    concluido: number;
  };
}

export interface Tarefa {
  id: number;
  projeto_id: number;
  titulo: string;
  descricao: string | null;
  status: 'A fazer' | 'Em andamento' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  responsavel_id: number | null;
  data_entrega: string | null;
  etiquetas?: string;
  capa?: string | null;
  checklist_total?: number;
  checklist_feitos?: number;
  comentarios?: number;
  criado_em: string;
  atualizado_em: string;
  projeto_nome?: string;
  projeto_emoji?: string;
  projeto_cor?: string;
  responsavel_nome?: string | null;
}

export interface DashboardStats {
  total_projetos: number;
  total_membros: number;
  total_tarefas: number;
  tarefas_a_fazer: number;
  tarefas_em_andamento: number;
  tarefas_concluidas: number;
  tarefas_atrasadas: number;
  prioridades: {
    Baixa: number;
    Média: number;
    Alta: number;
  };
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    let message = `Erro HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(message);
  }
  
  if (res.status === 204) {
    return undefined as T;
  }
  
  return res.json();
}

export const api = {
  dashboard: {
    getStats: () => fetchAPI<DashboardStats>('/dashboard'),
  },
  projetos: {
    getAll: () => fetchAPI<Projeto[]>('/projetos'),
    getById: (id: number) => fetchAPI<Projeto>(`/projetos/${id}`),
    create: (data: Partial<Projeto>) => fetchAPI<Projeto>('/projetos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Projeto>) => fetchAPI<Projeto>(`/projetos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/projetos/${id}`, {
      method: 'DELETE',
    }),
  },
  tarefas: {
    getAll: (filters?: Record<string, string | number>) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, String(value));
        });
      }
      return fetchAPI<Tarefa[]>(`/tarefas?${params}`);
    },
    getById: (id: number) => fetchAPI<Tarefa>(`/tarefas/${id}`),
    create: (data: Partial<Tarefa>) => fetchAPI<Tarefa>('/tarefas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Tarefa>) => fetchAPI<Tarefa>(`/tarefas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/tarefas/${id}`, {
      method: 'DELETE',
    }),
  },
  membros: {
    getAll: () => fetchAPI<Membro[]>('/membros'),
    getById: (id: number) => fetchAPI<Membro>(`/membros/${id}`),
    create: (data: Partial<Membro>) => fetchAPI<Membro>('/membros', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Membro>) => fetchAPI<Membro>(`/membros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/membros/${id}`, {
      method: 'DELETE',
    }),
  },
};
