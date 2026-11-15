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
  criado_em: string;
  atualizado_em: string;
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
  criado_em: string;
  atualizado_em: string;
  projeto_nome?: string;
  responsavel_nome?: string | null;
}

export interface ProjetoWithStats extends Projeto {
  stats: {
    total: number;
    a_fazer: number;
    em_andamento: number;
    concluido: number;
  };
}

export interface MembroWithStats extends Membro {
  stats: {
    total_tarefas: number;
    a_fazer: number;
    em_andamento: number;
    concluido: number;
  };
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
