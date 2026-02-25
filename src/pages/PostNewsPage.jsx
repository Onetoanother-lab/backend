import { useState } from 'react'
import toast from 'react-hot-toast'
import { newsAPI } from '../services/api'
import { useForm, useApiCall } from '../hooks/useApi'
import { Spinner, ErrorAlert, SuccessAlert } from '../components/UI'

const CATEGORIES = [
  { value: '', label: 'Select category…' },
  { value: 'news', label: 'News' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'press-release', label: 'Press Release' },
  { value: 'tender', label: 'Tender' },
  { value: 'report', label: 'Report' },
]

const LANGUAGES = [
  { value: 'uz', label: 'Uzbek (O\'zbek)' },
  { value: 'ru', label: 'Russian (Русский)' },
  { value: 'en', label: 'English' },
]

const INITIAL_VALUES = {
  title: '',
  content: '',
  category: '',
  language: 'uz',
  image: null,
  published: true,
}

export default function PostNewsPage() {
  const { values, handleChange, reset, setValues } = useForm(INITIAL_VALUES)
  const { execute: createPost, loading } = useApiCall(newsAPI.create)
  const [success, setSuccess] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [charCount, setCharCount] = useState(0)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    setValues((prev) => ({ ...prev, image: file }))
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleContentChange = (e) => {
    handleChange(e)
    setCharCount(e.target.value.length)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(null)
    setApiError(null)

    // Validation
    if (!values.title.trim()) return toast.error('Title is required')
    if (!values.content.trim()) return toast.error('Content is required')
    if (values.content.trim().length < 20) return toast.error('Content must be at least 20 characters')

    // Build FormData if image attached, else plain JSON
    let payload
    if (values.image) {
      const fd = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          fd.append(key, val)
        }
      })
      payload = fd
    } else {
      payload = {
        title: values.title,
        content: values.content,
        category: values.category || undefined,
        language: values.language,
        published: values.published,
      }
    }

    const result = await createPost(payload)

    if (result.success) {
      toast.success('Post published successfully!')
      setSuccess(`Post "${values.title}" was published successfully.`)
      reset()
      setImagePreview(null)
      setCharCount(0)
    } else {
      setApiError(result.error)
      toast.error('Failed to publish post')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-display text-xl text-slate-100">Create New Post</h2>
        <p className="text-sm text-slate-500 mt-1">
          Publish news, announcements, or press releases to the Uzbekneftegaz API.
        </p>
      </div>

      {/* Alerts */}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}
      {apiError && <ErrorAlert message={apiError} onDismiss={() => setApiError(null)} />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">

        {/* Title */}
        <div>
          <label className="label" htmlFor="title">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter post title…"
            value={values.title}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
            maxLength={255}
          />
        </div>

        {/* Category + Language row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-800">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={values.language}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value} className="bg-slate-800">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label" htmlFor="content">
              Content <span className="text-red-400">*</span>
            </label>
            <span className="text-xs font-mono text-slate-600">{charCount} chars</span>
          </div>
          <textarea
            id="content"
            name="content"
            placeholder="Write your post content here…"
            value={values.content}
            onChange={handleContentChange}
            rows={10}
            className="input-field resize-none leading-relaxed"
            disabled={loading}
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="label">Cover Image</label>
          <div
            className="border-2 border-dashed border-slate-700/60 rounded-xl p-6 text-center
                        hover:border-petroleum-600/50 transition-all duration-200 relative group"
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setValues((v) => ({ ...v, image: null }))
                  }}
                  className="absolute top-2 right-2 bg-red-900/80 text-red-300 rounded-full p-1 hover:bg-red-800 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-xs text-slate-500 mt-2">{values.image?.name}</p>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-slate-600 mx-auto mb-2 group-hover:text-petroleum-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-slate-500">Drop an image or <span className="text-petroleum-400">browse files</span></p>
                <p className="text-xs text-slate-600 mt-1">PNG, JPG, WebP · max 5MB</p>
              </>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
          </div>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={values.published}
            onClick={() => setValues((v) => ({ ...v, published: !v.published }))}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-petroleum-500/30
              ${values.published ? 'bg-petroleum-600' : 'bg-slate-700'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform
                transition duration-200 ease-in-out
                ${values.published ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <div>
            <p className="text-sm text-slate-200">
              {values.published ? 'Publish immediately' : 'Save as draft'}
            </p>
            <p className="text-xs text-slate-500">
              {values.published ? 'Post will be visible to users right away' : 'Post will be hidden until published'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-700/40">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Publishing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Publish Post
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => { reset(); setImagePreview(null); setCharCount(0); setSuccess(null); setApiError(null) }}
            disabled={loading}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {/* API reference */}
      <div className="glass-card p-4">
        <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">API Reference</p>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-petroleum-900/60 text-petroleum-300 border border-petroleum-800/50">POST</span>
          <code className="text-slate-400">https://uzbekneftegaz-backend.onrender.com/api/news</code>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Authenticated via Bearer token. Supports multipart/form-data for image uploads.
        </p>
      </div>
    </div>
  )
}
