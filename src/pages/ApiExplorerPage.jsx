import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../store/slices/authSlice'
import { Spinner } from '../components/UI'

// ─── All endpoints grouped by resource ───────────────────────────────────────

const ENDPOINT_GROUPS = [
  {
    group: 'Auth',
    items: [
      { method: 'POST',   path: '/api/auth/login',              description: 'Admin login' },
      { method: 'POST',   path: '/api/auth/register',           description: 'Register admin' },
    ],
  },
  {
    group: 'Banner',
    items: [
      { method: 'GET',    path: '/api/banner',                  description: 'Get all banners' },
      { method: 'POST',   path: '/api/banner',                  description: 'Create banner' },
      { method: 'PUT',    path: '/api/banner/{id}',             description: 'Update banner' },
      { method: 'DELETE', path: '/api/banner/{id}',             description: 'Delete banner' },
    ],
  },
  {
    group: 'News',
    items: [
      { method: 'GET',    path: '/api/news',                    description: 'Get all news' },
      { method: 'GET',    path: '/api/news/{id}',               description: 'Get news by ID' },
      { method: 'POST',   path: '/api/news',                    description: 'Create news' },
      { method: 'PUT',    path: '/api/news/{id}',               description: 'Update news' },
      { method: 'DELETE', path: '/api/news/{id}',               description: 'Delete news' },
    ],
  },
  {
    group: 'Local News',
    items: [
      { method: 'GET',    path: '/api/localnews',               description: 'Get all local news' },
      { method: 'GET',    path: '/api/localnews/{id}',          description: 'Get local news by ID' },
      { method: 'POST',   path: '/api/localnews',               description: 'Create local news' },
      { method: 'PUT',    path: '/api/localnews/{id}',          description: 'Update local news' },
      { method: 'DELETE', path: '/api/localnews/{id}',          description: 'Delete local news' },
    ],
  },
  {
    group: 'Industry News',
    items: [
      { method: 'GET',    path: '/api/IndustryNews',            description: 'Get all industry news' },
      { method: 'GET',    path: '/api/IndustryNews/{id}',       description: 'Get industry news by ID' },
      { method: 'POST',   path: '/api/IndustryNews',            description: 'Create industry news' },
      { method: 'PUT',    path: '/api/IndustryNews/{id}',       description: 'Update industry news' },
      { method: 'DELETE', path: '/api/IndustryNews/{id}',       description: 'Delete industry news' },
    ],
  },
  {
    group: 'Leader',
    items: [
      { method: 'GET',    path: '/api/leader',                  description: 'Get all leaders' },
      { method: 'GET',    path: '/api/leader/{id}',             description: 'Get leader by ID' },
      { method: 'POST',   path: '/api/leader/create',           description: 'Create leader' },
      { method: 'PUT',    path: '/api/leader/{id}',             description: 'Update leader' },
      { method: 'DELETE', path: '/api/leader/{id}',             description: 'Delete leader' },
    ],
  },
  {
    group: 'Honorary',
    items: [
      { method: 'GET',    path: '/api/honorary',                description: 'Get all honorary members' },
      { method: 'GET',    path: '/api/honorary/{id}',           description: 'Get honorary by ID' },
      { method: 'POST',   path: '/api/honorary/create',         description: 'Create honorary member' },
      { method: 'PUT',    path: '/api/honorary/{id}',           description: 'Update honorary member' },
      { method: 'DELETE', path: '/api/honorary/{id}',           description: 'Delete honorary member' },
    ],
  },
  {
    group: 'Gender',
    items: [
      { method: 'GET',    path: '/api/gender',                  description: 'Get all gender policy' },
      { method: 'GET',    path: '/api/gender/{id}',             description: 'Get gender policy by ID' },
      { method: 'POST',   path: '/api/gender',                  description: 'Create gender policy' },
      { method: 'PUT',    path: '/api/gender/{id}',             description: 'Update gender policy' },
      { method: 'DELETE', path: '/api/gender/{id}',             description: 'Delete gender policy' },
    ],
  },
  {
    group: 'Xotin-Qizlar',
    items: [
      { method: 'GET',    path: '/api/xotinQizlar',             description: 'Get all xotin-qizlar' },
      { method: 'GET',    path: '/api/xotinQizlar/{id}',        description: 'Get by ID' },
      { method: 'POST',   path: '/api/xotinQizlar',             description: 'Create xotin-qizlar' },
      { method: 'PUT',    path: '/api/xotinQizlar/{id}',        description: 'Update xotin-qizlar' },
      { method: 'DELETE', path: '/api/xotinQizlar/{id}',        description: 'Delete xotin-qizlar' },
    ],
  },
  {
    group: 'Yoshlar Siyosati',
    items: [
      { method: 'GET',    path: '/api/yoshlarSiyosati',          description: 'Get all yoshlar siyosati' },
      { method: 'GET',    path: '/api/yoshlarSiyosati/{id}',     description: 'Get by ID' },
      { method: 'POST',   path: '/api/yoshlarSiyosati',          description: 'Create yoshlar siyosati' },
      { method: 'PUT',    path: '/api/yoshlarSiyosati/{id}',     description: 'Update yoshlar siyosati' },
      { method: 'DELETE', path: '/api/yoshlarSiyosati/{id}',     description: 'Delete yoshlar siyosati' },
    ],
  },
  {
    group: 'Normative',
    items: [
      { method: 'GET',    path: '/api/normative/all',            description: 'Get all normative docs' },
      { method: 'GET',    path: '/api/normative/{id}',           description: 'Get normative by ID' },
      { method: 'POST',   path: '/api/normative/create',         description: 'Create normative doc' },
      { method: 'PUT',    path: '/api/normative/{id}',           description: 'Update normative doc' },
      { method: 'DELETE', path: '/api/normative/{id}',           description: 'Delete normative doc' },
    ],
  },
  {
    group: 'Bolimlar',
    items: [
      { method: 'GET',    path: '/api/bolimlar',                 description: 'Get all bolimlar' },
      { method: 'GET',    path: '/api/bolimlar/{id}',            description: 'Get bolimlar by ID' },
      { method: 'POST',   path: '/api/bolimlar',                 description: 'Create bolimlar' },
      { method: 'PUT',    path: '/api/bolimlar/{id}',            description: 'Update bolimlar' },
      { method: 'DELETE', path: '/api/bolimlar/{id}',            description: 'Delete bolimlar' },
    ],
  },
  {
    group: 'Vacancies',
    items: [
      { method: 'GET',    path: '/api/vacancies',                description: 'Get all vacancies' },
      { method: 'GET',    path: '/api/vacancies/{id}',           description: 'Get vacancy by ID' },
      { method: 'POST',   path: '/api/vacancies',                description: 'Create vacancy' },
      { method: 'PUT',    path: '/api/vacancies/{id}',           description: 'Update vacancy' },
      { method: 'DELETE', path: '/api/vacancies/{id}',           description: 'Delete vacancy' },
    ],
  },
  {
    group: 'Plans & Reports',
    items: [
      { method: 'GET',    path: '/api/plansReports',             description: 'Get all plans & reports' },
      { method: 'GET',    path: '/api/plansReports/{id}',        description: 'Get by ID' },
      { method: 'POST',   path: '/api/plansReports',             description: 'Create plan/report' },
      { method: 'PUT',    path: '/api/plansReports/{id}',        description: 'Update plan/report' },
      { method: 'DELETE', path: '/api/plansReports/{id}',        description: 'Delete plan/report' },
    ],
  },
]

// Flat list for selection logic
const ALL_ENDPOINTS = ENDPOINT_GROUPS.flatMap(g => g.items)

// ─── Styles ───────────────────────────────────────────────────────────────────

const METHOD_STYLES = {
  GET:    'bg-blue-900/40 text-blue-300 border-blue-800/50',
  POST:   'bg-green-900/40 text-green-300 border-green-800/50',
  PUT:    'bg-amber-900/30 text-amber-300 border-amber-800/40',
  DELETE: 'bg-red-900/30 text-red-300 border-red-800/40',
}

const SAMPLE_BODIES = {
  '/api/auth/login':           { phone: '998901234567', password: 'password' },
  '/api/auth/register':        { phone: '998901234567', password: 'password' },
  '/api/news':                 { title_uz: 'Sarlavha', desc_uz: 'Tavsif', title_ru: '', desc_ru: '' },
  '/api/localnews':            { title_uz: 'Sarlavha', desc_uz: 'Tavsif' },
  '/api/IndustryNews':         { title_uz: 'Sarlavha', desc_uz: 'Tavsif' },
  '/api/gender':               { title_uz: 'Sarlavha', description_uz: 'Tavsif' },
  '/api/bolimlar':             { title_uz: 'Sarlavha', employees_uz: '', leader_uz: '', desc_uz: '' },
  '/api/vacancies':            { title: { uz: '', ru: '', oz: '' }, description: { uz: '', ru: '', oz: '' }, salary: { uz: '', ru: '', oz: '' }, deadline: '' },
  '/api/plansReports':         { title_uz: '', category_uz: '', description_uz: '', participantsCount: 0 },
  '/api/xotinQizlar':          { title_uz: '', decree_uz: '', description_uz: '' },
  '/api/yoshlarSiyosati':      { title_uz: '', decree_uz: '', description_uz: '' },
  '/api/normative/create':     { title_uz: '', decree_uz: '', description_uz: '' },
  '/api/honorary/create':      { fullName_uz: '', specialist_uz: '', grade_uz: '' },
  '/api/leader/create':        { fullName_uz: '', grade_uz: '', phone: '', email: '' },
  '/api/banner':               { title_uz: '', desc_uz: '' },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ApiExplorerPage() {
  const token = useSelector(selectToken)
  const [selected, setSelected] = useState(ALL_ENDPOINTS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [pathParam, setPathParam] = useState('')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState(null)
  const [respLoading, setRespLoading] = useState(false)
  const [respStatus, setRespStatus] = useState(null)
  const [respTime, setRespTime] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState(
    Object.fromEntries(ENDPOINT_GROUPS.map(g => [g.group, true]))
  )

  const resolvedPath = pathParam
    ? selected.path.replace('{id}', pathParam)
    : selected.path.replace('/{id}', '').replace('{id}', '')

  const filteredGroups = ENDPOINT_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(ep =>
      !searchQuery ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(g => g.items.length > 0)

  const toggleGroup = (group) =>
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))

  const handleSelect = (ep) => {
    setSelected(ep)
    setResponse(null)
    setPathParam('')
    // Auto-populate sample body for POST/PUT
    if (['POST', 'PUT'].includes(ep.method)) {
      const basePath = ep.path.replace('/{id}', '')
      const sample = SAMPLE_BODIES[basePath]
      setBody(sample ? JSON.stringify(sample, null, 2) : '')
    } else {
      setBody('')
    }
  }

  const handleSend = async () => {
    setRespLoading(true)
    setResponse(null)
    setRespStatus(null)

    const BASE = import.meta.env.DEV ? 'https://uzbekneftegaz-backend.onrender.com' : ''
    const url = `${BASE}${resolvedPath}`
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    let parsedBody
    if (body.trim()) {
      try {
        parsedBody = JSON.parse(body)
      } catch {
        setResponse({ error: 'Invalid JSON in request body' })
        setRespLoading(false)
        return
      }
    }

    const start = Date.now()
    try {
      const res = await fetch(url, {
        method: selected.method,
        headers,
        body: parsedBody ? JSON.stringify(parsedBody) : undefined,
      })
      setRespStatus(res.status)
      setRespTime(Date.now() - start)
      const text = await res.text()
      try { setResponse(JSON.parse(text)) } catch { setResponse(text) }
    } catch (err) {
      setResponse({ error: err.message })
      setRespTime(Date.now() - start)
    } finally {
      setRespLoading(false)
    }
  }

  const statusColor = !respStatus ? '' : respStatus < 300 ? 'text-green-400' : respStatus < 400 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-slate-100">API Explorer</h2>
        <p className="text-sm text-slate-500 mt-1">
          {ALL_ENDPOINTS.length} endpoints across {ENDPOINT_GROUPS.length} resources.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Sidebar ── */}
        <div className="glass-card flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {/* Search */}
          <div className="p-3 border-b border-slate-700/40 shrink-0">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search endpoints…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-8 py-2 text-xs"
              />
            </div>
          </div>

          {/* Endpoint list */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredGroups.map(({ group, items }) => (
              <div key={group}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>{group}</span>
                  <svg className={`w-3 h-3 transition-transform ${expandedGroups[group] ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedGroups[group] && items.map((ep) => (
                  <button
                    key={ep.method + ep.path}
                    onClick={() => handleSelect(ep)}
                    className={`w-full text-left flex items-start gap-2 px-2 py-2 rounded-xl transition-all duration-150 ${
                      selected === ep
                        ? 'bg-petroleum-900/40 border border-petroleum-700/40'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={`status-badge border shrink-0 mt-0.5 text-[10px] px-1.5 ${METHOD_STYLES[ep.method]}`}>
                      {ep.method}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-slate-300 truncate">{ep.path}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{ep.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Request / Response panel ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <p className="label">Request</p>

            {/* URL bar */}
            <div className="flex items-center gap-2">
              <span className={`status-badge border shrink-0 ${METHOD_STYLES[selected.method]}`}>
                {selected.method}
              </span>
              <code className="flex-1 bg-slate-800/70 border border-slate-700/40 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono truncate">
                https://uzbekneftegaz-backend.onrender.com{resolvedPath}
              </code>
            </div>

            {/* Path param */}
            {selected.path.includes('{id}') && (
              <div>
                <label className="label">Resource ID</label>
                <input type="text" placeholder="Enter ID…" value={pathParam}
                  onChange={e => setPathParam(e.target.value)} className="input-field" />
              </div>
            )}

            {/* Auth token */}
            <div>
              <label className="label">Authorization</label>
              <div className="input-field text-xs font-mono text-slate-500 truncate bg-slate-800/40 cursor-default">
                {token ? `Bearer ${token.substring(0, 48)}…` : 'No token — login first'}
              </div>
            </div>

            {/* Body */}
            {['POST', 'PUT', 'PATCH'].includes(selected.method) && (
              <div>
                <label className="label">Request Body (JSON)</label>
                <textarea rows={8} placeholder='{"key": "value"}' value={body}
                  onChange={e => setBody(e.target.value)}
                  className="input-field resize-none font-mono text-xs" />
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Note: endpoints requiring file upload (binary fields) must be tested via the form pages.
                </p>
              </div>
            )}

            <button onClick={handleSend} disabled={respLoading}
              className="btn-primary flex items-center gap-2">
              {respLoading ? (
                <><Spinner size="sm" className="text-white" /> Sending…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Request
                </>
              )}
            </button>
          </div>

          {/* Response */}
          {(response !== null || respLoading) && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="label">Response</p>
                {respStatus && (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className={respStatus < 300 ? 'text-green-400' : 'text-red-400'}>
                      {respStatus < 300 ? '✓' : '✗'} {respStatus}
                    </span>
                    {respTime && <span className="text-slate-600">{respTime}ms</span>}
                  </div>
                )}
              </div>
              {respLoading ? (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Spinner size="sm" className="text-petroleum-500" /> Awaiting response…
                </div>
              ) : (
                <pre className="bg-slate-950/80 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-96 whitespace-pre-wrap">
                  {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
