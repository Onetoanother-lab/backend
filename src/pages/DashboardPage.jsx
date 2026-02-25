import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentUser } from '../store/slices/authSlice'
import { StatCard } from '../components/UI'

const QUICK_ACTIONS = [
  {
    label: 'Post News',
    description: 'Publish a new article or announcement',
    path: '/dashboard/post-news',
    color: 'petroleum',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Manage Posts',
    description: 'View, edit, or delete existing content',
    path: '/dashboard/manage-posts',
    color: 'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: 'API Explorer',
    description: 'Browse and test backend endpoints',
    path: '/dashboard/api-explorer',
    color: 'green',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
]

const colorMap = {
  petroleum: 'from-petroleum-900/40 to-petroleum-800/20 border-petroleum-700/40 hover:border-petroleum-600/60 text-petroleum-400',
  amber: 'from-amber-900/20 to-amber-800/10 border-amber-700/30 hover:border-amber-600/50 text-amber-400',
  green: 'from-green-900/20 to-green-800/10 border-green-700/30 hover:border-green-600/50 text-green-400',
}

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl text-slate-100">
          {greeting},{' '}
          <span className="text-petroleum-400">{user?.username || user?.name || 'Admin'}</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here's what's happening in your admin panel today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Posts"
          value="—"
          trend="Connect API to see data"
          color="petroleum"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Published"
          value="—"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Draft"
          value="—"
          color="amber"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
        />
        <StatCard
          label="API Status"
          value="Live"
          trend="uzbekneftegaz-backend.onrender.com"
          color="petroleum"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12h.01" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display text-lg text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`
                text-left p-5 rounded-2xl border bg-gradient-to-br
                transition-all duration-300 group
                ${colorMap[action.color]}
              `}
            >
              <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center mb-3 ${colorMap[action.color].split(' ').pop()}`}>
                {action.icon}
              </div>
              <h4 className="font-display font-semibold text-slate-100 group-hover:text-white transition-colors">
                {action.label}
              </h4>
              <p className="text-xs text-slate-500 mt-1">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* API Base URL Info */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-4 h-4 text-petroleum-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-display text-base text-slate-200">Backend Configuration</h3>
        </div>
        <div className="space-y-2">
          {[
            ['Base URL', 'https://uzbekneftegaz-backend.onrender.com'],
            ['API Docs', 'https://uzbekneftegaz-backend.onrender.com/api-docs'],
            ['Auth Method', 'Bearer Token (JWT)'],
          ].map(([key, value]) => (
            <div key={key} className="flex items-center gap-4 text-sm">
              <span className="font-mono text-xs text-slate-500 w-28 shrink-0">{key}</span>
              <code className="text-petroleum-300 font-mono text-xs bg-slate-800/60 px-2 py-1 rounded-lg flex-1 truncate">
                {value}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
