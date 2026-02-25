// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Error Alert ──────────────────────────────────────────────────────────────

export function ErrorAlert({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-950/40 border border-red-700/40 rounded-xl p-4 text-sm animate-slide-up">
      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-300 flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 hover:text-red-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Success Alert ────────────────────────────────────────────────────────────

export function SuccessAlert({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-petroleum-950/40 border border-petroleum-700/40 rounded-xl p-4 text-sm animate-slide-up">
      <svg className="w-4 h-4 text-petroleum-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-petroleum-200 flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-petroleum-500 hover:text-petroleum-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export function StatCard({ label, value, icon, trend, color = 'petroleum' }) {
  const colorMap = {
    petroleum: 'text-petroleum-400 bg-petroleum-900/30',
    amber: 'text-amber-400 bg-amber-900/20',
    green: 'text-green-400 bg-green-900/20',
    red: 'text-red-400 bg-red-900/20',
  }

  return (
    <div className="glass-card p-5 hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">{label}</p>
          <p className="text-3xl font-display font-semibold text-slate-100 mt-1">{value}</p>
          {trend && <p className="text-xs text-slate-500 mt-1 font-mono">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="font-display text-lg text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 rounded-lg bg-slate-800 shimmer-bg"
              style={{ flex: j === 0 ? '0.5' : '1', animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300',
    success: 'bg-petroleum-900/50 text-petroleum-300 border border-petroleum-800/50',
    warning: 'bg-amber-900/30 text-amber-300',
    error: 'bg-red-900/30 text-red-300',
  }
  return (
    <span className={`status-badge ${variants[variant]}`}>
      {children}
    </span>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-lg mx-4 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-700/40">
          <h2 className="font-display text-lg text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
