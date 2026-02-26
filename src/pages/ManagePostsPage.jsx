import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { newsAPI } from '../services/api'
import { useApiCall } from '../hooks/useApi'
import { Spinner, EmptyState, TableSkeleton, Badge, Modal } from '../components/UI'

// Extracts a displayable string from a field that may be a plain string
// OR a multilingual object like { uz: "...", ru: "...", oz: "..." }
const getText = (field, lang = 'uz') => {
  if (!field) return '—'
  if (typeof field === 'string') return field
  if (typeof field === 'object')
    return field[lang] || field.uz || field.ru || field.oz || field.en || Object.values(field)[0] || '—'
  return String(field)
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null) // post to delete
  const [editModal, setEditModal] = useState(null)   // post to edit
  const [editValues, setEditValues] = useState({})
  const { execute: deletePost, loading: deleteLoading } = useApiCall(newsAPI.delete)
  const { execute: updatePost, loading: updateLoading } = useApiCall(newsAPI.update)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await newsAPI.getAll()
      const result =
        data?.data ?? data?.items ?? data?.result ?? data?.news ??
        (typeof data === 'object' && !Array.isArray(data)
          ? Object.values(data).find(v => Array.isArray(v))
          : null) ??
        data
      setPosts(Array.isArray(result) ? result : [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load posts'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async () => {
    if (!deleteModal) return
    const result = await deletePost(deleteModal._id || deleteModal.id)
    if (result.success) {
      toast.success('Post deleted')
      setPosts((prev) => prev.filter((p) => (p._id || p.id) !== (deleteModal._id || deleteModal.id)))
    } else {
      toast.error(result.error)
    }
    setDeleteModal(null)
  }

  const handleEditOpen = (post) => {
    setEditModal(post)
    setEditValues({
      title: getText(post.title),
      content: getText(post.content),
      category: getText(post.category),
      published: post.published ?? true,
    })
  }

  const handleEditSave = async () => {
    if (!editModal) return
    const result = await updatePost(editModal._id || editModal.id, editValues)
    if (result.success) {
      toast.success('Post updated!')
      setPosts((prev) =>
        prev.map((p) =>
          (p._id || p.id) === (editModal._id || editModal.id) ? { ...p, ...editValues } : p
        )
      )
      setEditModal(null)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-slate-100">Manage Posts</h2>
          <p className="text-sm text-slate-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Start by creating your first news post or announcement."
            action={
              <a href="/dashboard/post-news" className="btn-primary text-sm">
                Create Post
              </a>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/40">
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Date</th>
                  <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map((post, i) => (
                  <tr
                    key={post._id || post.id || i}
                    className="hover:bg-slate-800/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-sm text-slate-200 font-medium truncate">{getText(post.title)}</p>
                      {post.language && (
                        <p className="text-xs text-slate-600 font-mono mt-0.5 uppercase">{getText(post.language)}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {post.category ? (
                        <Badge variant="default">{getText(post.category)}</Badge>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={post.published ? 'success' : 'warning'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-petroleum-400' : 'bg-amber-400'}`} />
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : post.date
                        ? new Date(post.date).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(post)}
                          className="text-xs text-petroleum-400 hover:text-petroleum-300 font-medium transition-colors
                                     bg-petroleum-900/20 hover:bg-petroleum-900/40 px-3 py-1.5 rounded-lg border border-petroleum-800/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal(post)}
                          className="btn-danger text-xs py-1.5 px-3"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Confirm Deletion"
      >
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to delete{' '}
          <span className="text-slate-200 font-medium">"{getText(deleteModal?.title)}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex-1 btn-danger flex items-center justify-center gap-2 py-2.5"
          >
            {deleteLoading ? <Spinner size="sm" className="text-red-300" /> : null}
            Delete Post
          </button>
          <button onClick={() => setDeleteModal(null)} className="flex-1 btn-secondary">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit Post"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input-field"
              value={editValues.title || ''}
              onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Content</label>
            <textarea
              rows={5}
              className="input-field resize-none"
              value={editValues.content || ''}
              onChange={(e) => setEditValues((v) => ({ ...v, content: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditValues((v) => ({ ...v, published: !v.published }))}
              className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${
                editValues.published ? 'bg-petroleum-600' : 'bg-slate-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${editValues.published ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className="text-sm text-slate-300">{editValues.published ? 'Published' : 'Draft'}</span>
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-700/40">
            <button
              onClick={handleEditSave}
              disabled={updateLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {updateLoading ? <Spinner size="sm" className="text-white" /> : null}
              Save Changes
            </button>
            <button onClick={() => setEditModal(null)} className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
