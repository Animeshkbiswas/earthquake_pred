import { useEffect, useMemo, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = window.localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const Icon = useMemo(() => (theme === 'dark' ? FiSun : FiMoon), [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
      aria-label="Toggle dark mode"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

