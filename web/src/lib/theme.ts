import { useEffect, useState } from 'react'

const KEY = 'taskora-theme'
export type Theme = 'light' | 'dark'

function getStored(): Theme {
  const v = localStorage.getItem(KEY)
  if (v === 'light' || v === 'dark') return v
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyStoredTheme() {
  document.documentElement.classList.toggle('dark', getStored() === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStored)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(KEY, theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
