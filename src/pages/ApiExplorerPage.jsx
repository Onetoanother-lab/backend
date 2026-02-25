import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../store/slices/authSlice'
import { Spinner } from '../components/UI'

const ENDPOINTS = [
  { method: 'GET',    path: '/api/news',          description: 'Get all news posts' },
  { method: 'GET',    path: '/api/news/{id}',      description: 'Get news by ID' },
  { method: 'POST',   path: '/api/news',           description: 'Create news post (auth required)' },
  { method: 'PUT',    path: '/api/news/{id}',      description: 'Update news post (auth required)' },
  { method: 'DELETE', path: '/api/news/{id}',      description: 'Delete news post (auth required)' },
  { method: 'POST',   path: '/api/auth/login',     description: 'Admin login' },
  { method: 'POST',   path: '/api/auth/register',  description: 'Admin register' },
]

const METHOD_STYLES = {
  GET:    'bg-blue-900/40 text-blue-300 border-blue-800/50',
  POST:   'bg-green-900/40 text-green-300 border-green-800/50',
  PUT:    'bg-amber-900/30 text-amber-300 border-amber-800/40',
  DELETE: 'bg-red-900/30 text-red-300 border-red-800/40',
}

export default function ApiExplorerPage() {
  const token = useSelector(selectToken)
  const [selected, setSelected] = useState(ENDPOINTS[0])
  const [pathParam, setPathParam] = useState('')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState(null)
  const [respLoading, setRespLoading] = useState(false)
  const [respStatus, setRespStatus] = useState(null)
  const [respTime, setRespTime] = useState(null)

  const resolvedPath = pathParam
    ? selected.path.replace('{id}', pathParam)
    : selected.path.replace('/{id}', '').replace('{id}', '')

  const handleSend = async () => {
    setRespLoading(true)
    setResponse(null)
    setRespStatus(null)

    const url = `https://uzbekneftegaz-backend.onrender.com${resolvedPath}`
    const headers = {
      'Content-Type': 'application/json',
    }
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
      const elapsed = Date.now() - start
      setRespStatus(res.status)
      setRespTime(elapsed)
      const text = await res.text()
      try {
        setResponse(JSON.parse(text))
      } catch {
        setResponse(text)
      }
    } catch (err) {
      setResponse({ error: err.message })
      setRespTime(Date.now() - start)
    } finally {
      setRespLoading(false)
    }
  }

  const statusColor =
    !respStatus ? ''
    : respStatus < 300 ? 'text-green-400'
    : respStatus < 400 ? 'text-amber-400'
    : 'text-red-400'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-slate-100">API Explorer</h2>
        <p className="text-sm text-slate-500 mt-1">
          Interactively test backend endpoints with your current auth token.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint list */}
        <div className="glass-card p-4 space-y-1">
          <p className="label mb-3">Available Endpoints</p>
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.method + ep.path}
              onClick={() => { setSelected(ep); setResponse(null); setBody('') }}
              className={`w-full text-left flex items-start gap-2 p-2.5 rounded-xl transition-all duration-150 ${
                selected === ep ? 'bg-petroleum-900/40 border border-petroleum-700/40' : 'hover:bg-slate-800/50'
              }`}
            >
              <span className={`status-badge border shrink-0 mt-0.5 ${METHOD_STYLES[ep.method]}`}>
                {ep.method}
              </span>
              <div>
                <p className="text-xs font-mono text-slate-300">{ep.path}</p>
                <p className="text-xs text-slate-600 mt-0.5">{ep.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Request panel */}
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
                <input
                  type="text"
                  placeholder="Enter ID…"
                  value={pathParam}
                  onChange={(e) => setPathParam(e.target.value)}
                  className="input-field"
                />
              </div>
            )}

            {/* Auth token */}
            <div>
              <label className="label">Authorization</label>
              <div className="input-field text-xs font-mono text-slate-500 truncate bg-slate-800/40 cursor-default">
                {token ? `Bearer ${token.substring(0, 40)}…` : 'No token — login to authenticate'}
              </div>
            </div>

            {/* Body (POST/PUT only) */}
            {['POST', 'PUT', 'PATCH'].includes(selected.method) && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label">Request Body (JSON)</label>
                  <button
                    onClick={() => {
                      const sample = selected.path.includes('login')
                        ? { username: 'admin', password: 'password' }
                        : selected.path.includes('register')
                        ? { username: 'admin', password: 'password', role: 'admin' }
                        : { title: 'Sample Title', content: 'Sample content text', language: 'uz', published: true }
                      setBody(JSON.stringify(sample, null, 2))
                    }}
                    className="text-xs text-petroleum-400 hover:text-petroleum-300 font-mono"
                  >
                    Insert sample →
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="input-field resize-none font-mono text-xs"
                />
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={respLoading}
              className="btn-primary flex items-center gap-2"
            >
              {respLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Sending…
                </>
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
                    <span className={statusColor}>Status {respStatus}</span>
                    {respTime && <span className="text-slate-600">{respTime}ms</span>}
                  </div>
                )}
              </div>
              {respLoading ? (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Spinner size="sm" className="text-petroleum-500" />
                  Awaiting response…
                </div>
              ) : (
                <pre className="bg-slate-950/80 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto max-h-80 whitespace-pre-wrap">
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
