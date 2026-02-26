import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLang } from '../context/LangContext'

const BREADCRUMB_MAP = {
  '/dashboard':              'Overview',
  '/dashboard/post-news':    'Post News',
  '/dashboard/manage-posts': 'Manage Posts',
  '/dashboard/api-explorer': 'API Explorer',
  '/dashboard/news':         'News',
  '/dashboard/localnews':    'Local News',
  '/dashboard/industry-news':'Industry News',
  '/dashboard/banners':      'Banners',
  '/dashboard/leaders':      'Leaders',
  '/dashboard/honorary':     'Honorary',
  '/dashboard/bolimlar':     'Bolimlar',
  '/dashboard/vacancies':    'Vacancies',
  '/dashboard/gender':       'Gender Policy',
  '/dashboard/xotin-qizlar': 'Xotin-Qizlar',
  '/dashboard/yoshlar':      'Yoshlar Siyosati',
  '/dashboard/normative':    'Normative Documents',
  '/dashboard/plans-reports':'Plans & Reports',
}

const LANGS = [
  { code: 'uz', label: "O'z", flag: '🇺🇿', full: "O'zbek" },
  { code: 'oz', label: 'Oz',  flag: '🇺🇿', full: 'Lotin' },
  { code: 'ru', label: 'Ру',  flag: '🇷🇺', full: 'Русский' },
]

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const pageTitle = BREADCRUMB_MAP[location.pathname] || 'Dashboard'
  const { lang, setLang } = useLang()

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center px-6 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/40">
          <div>
            <h1 className="font-display text-lg font-semibold text-slate-100">{pageTitle}</h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Language switcher */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/40 rounded-xl p-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  title={l.full}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium
                    transition-all duration-200
                    ${lang === l.code
                      ? 'bg-petroleum-600 text-white shadow-lg shadow-petroleum-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }
                  `}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>

            {/* API status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petroleum-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-petroleum-500"></span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:block">API Connected</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
