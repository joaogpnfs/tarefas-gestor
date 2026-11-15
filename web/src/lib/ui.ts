import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Tarefa } from './api'

export type PillColor = 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red'
export type Status = Tarefa['status']
export type Prioridade = Tarefa['prioridade']

export const STATUSES: Status[] = ['A fazer', 'Em andamento', 'Concluído']
export const PRIORIDADES: Prioridade[] = ['Alta', 'Média', 'Baixa']

export const STATUS_META: Record<Status, { color: PillColor; lane: string; accent: string; hex: string }> = {
  'A fazer': { color: 'gray', lane: 'bg-[hsl(var(--lane-todo))]', accent: 'bg-[#91918e]', hex: '#a3a29e' },
  'Em andamento': { color: 'blue', lane: 'bg-[hsl(var(--lane-doing))]', accent: 'bg-[#2e7cd1]', hex: '#2e7cd1' },
  'Concluído': { color: 'green', lane: 'bg-[hsl(var(--lane-done))]', accent: 'bg-[#3c8a5a]', hex: '#3c8a5a' },
}

export const PRIORIDADE_META: Record<Prioridade, { color: PillColor; hex: string; label: string }> = {
  Alta: { color: 'red', hex: '#e03e3e', label: 'Alta' },
  Média: { color: 'yellow', hex: '#dfab01', label: 'Média' },
  Baixa: { color: 'green', hex: '#3c8a5a', label: 'Baixa' },
}

const TAG_COLORS: Record<string, PillColor> = {
  frontend: 'blue', backend: 'purple', api: 'orange', ux: 'pink', design: 'pink', bug: 'red',
  testes: 'yellow', docs: 'gray', infra: 'brown', pesquisa: 'green', mobile: 'orange', dados: 'green',
  pagamentos: 'yellow', 'segurança': 'red',
}
const PALETTE: PillColor[] = ['blue', 'purple', 'pink', 'orange', 'green', 'yellow', 'brown', 'red']

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function tagColor(tag: string): PillColor {
  return TAG_COLORS[tag.toLowerCase()] ?? PALETTE[hash(tag) % PALETTE.length]
}

export function parseTags(value?: string | null): string[] {
  return (value ?? '').split(',').map((t) => t.trim()).filter(Boolean)
}

/* ---------- Avatares ---------- */
const AVATAR_COLORS = ['#e16259', '#d9730d', '#cb912f', '#448361', '#337ea9', '#9065b0', '#c14c8a', '#2f9e8f']

export function avatarColor(name?: string | null): string {
  return AVATAR_COLORS[hash(name ?? '?') % AVATAR_COLORS.length]
}

export function initials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/* ---------- Capas ---------- */
export const COVERS: Record<string, { label: string; css: string }> = {
  aurora: { label: 'Aurora', css: 'linear-gradient(120deg, #6a5af9 0%, #a855f7 45%, #f472b6 100%)' },
  'por-do-sol': { label: 'Pôr do sol', css: 'linear-gradient(120deg, #f59e0b 0%, #f97316 45%, #ef4444 100%)' },
  oceano: { label: 'Oceano', css: 'linear-gradient(120deg, #06b6d4 0%, #3b82f6 55%, #6366f1 100%)' },
  floresta: { label: 'Floresta', css: 'linear-gradient(120deg, #059669 0%, #10b981 50%, #84cc16 100%)' },
  lavanda: { label: 'Lavanda', css: 'linear-gradient(120deg, #c084fc 0%, #a78bfa 50%, #818cf8 100%)' },
  grafite: { label: 'Grafite', css: 'linear-gradient(120deg, #1f2937 0%, #374151 55%, #4b5563 100%)' },
  pessego: { label: 'Pêssego', css: 'linear-gradient(120deg, #fecaca 0%, #fdba74 50%, #fde68a 100%)' },
}

export function coverCss(capa?: string | null, cor?: string): string {
  if (capa && COVERS[capa]) return COVERS[capa].css
  const c = cor || '#2383e2'
  return `linear-gradient(120deg, ${c} 0%, ${c}cc 60%, ${c}88 100%)`
}

export const EMOJIS = ['📁', '🚀', '🎓', '📚', '🛵', '🛍️', '📊', '💡', '🧪', '🎨', '⚙️', '🌱', '🔥', '🧭', '📱', '🏆']

/* ---------- Datas ---------- */
export function toDate(value?: string | null): Date | null {
  if (!value) return null
  const d = parseISO(value.slice(0, 10))
  return isValid(d) ? d : null
}

export function daysUntil(value?: string | null): number | null {
  const d = toDate(value)
  return d ? differenceInCalendarDays(d, new Date()) : null
}

export function isOverdue(t: Pick<Tarefa, 'data_entrega' | 'status'>): boolean {
  const n = daysUntil(t.data_entrega)
  return n !== null && n < 0 && t.status !== 'Concluído'
}

export function formatShort(value?: string | null): string {
  const d = toDate(value)
  return d ? format(d, "d 'de' MMM", { locale: ptBR }).replace('.', '') : ''
}

export function formatLong(value?: string | null): string {
  const d = toDate(value)
  return d ? format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''
}

export function relativeDue(value?: string | null): string {
  const n = daysUntil(value)
  if (n === null) return ''
  if (n === 0) return 'Hoje'
  if (n === 1) return 'Amanhã'
  if (n === -1) return 'Ontem'
  if (n < 0) return `${Math.abs(n)} dias atrás`
  if (n < 7) return `Em ${n} dias`
  return formatShort(value)
}

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const CURRENT_USER_FIRST_NAME = 'João'
