import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getCurrentShift(): 'shift_1' | 'shift_2' {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 14 ? 'shift_1' : 'shift_2'
}

export function getShiftLabel(shift: 'shift_1' | 'shift_2'): string {
  return shift === 'shift_1' ? '🌅 Turno 1 (06h–14h)' : '🌙 Turno 2 (14h–22h)'
}

export function calculateMargin(price: number, cost: number): number {
  if (price === 0) return 0
  return ((price - cost) / price) * 100
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'zero': return 'text-gray-400 bg-gray-900'
    case 'critical': return 'text-red-400 bg-red-950'
    case 'low': return 'text-yellow-400 bg-yellow-950'
    case 'normal': return 'text-green-400 bg-green-950'
    default: return 'text-gray-400 bg-gray-900'
  }
}

export function getAlertColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'border-red-500 bg-red-950/30'
    case 'warning': return 'border-yellow-500 bg-yellow-950/30'
    case 'positive': return 'border-green-500 bg-green-950/30'
    case 'info': return 'border-blue-500 bg-blue-950/30'
    default: return 'border-gray-700 bg-gray-900'
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
