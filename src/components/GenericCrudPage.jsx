import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { apiClient } from '../services/api'
import { Spinner, EmptyState, TableSkeleton, Badge, Modal } from './UI'
import { useLang } from '../context/LangContext'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getText = (field, lang = 'uz') => {
  if (field === null || field === undefined) return '—'
  if (typeof field === 'boolean') return field ? 'Yes' : 'No'
  if (typeof field === 'string') return field || '—'
  if (typeof field === 'number') return String(field)
  if (typeof field === 'object') {
    const val = field[lang] || field.uz || field.ru || field.oz
      || Object.values(field).find(v => typeof v === 'string' && v !== '')
    return val || '—'
  }
  return String(field)
}

// Common aliases: field config key base → possible API key bases
const KEY_ALIASES = {
  desc:        ['description', 'content', 'body', 'text', 'desc'],
  description: ['description', 'desc', 'content', 'body', 'text'],
  name:        ['name', 'fullName', 'title'],
  fullName:    ['fullName', 'name', 'full_name'],
  title:       ['title', 'name', 'heading'],
  image:       ['image', 'avatar', 'photo', 'img', 'file'],
  avatar:      ['avatar', 'image', 'photo', 'img'],
}

const LANGS = ['uz', 'ru', 'oz', 'en']

const resolveValue = (record, key, lang = 'uz') => {
  // ── 1. Direct flat key: record['title_uz'] ────────────────────────────────
  const direct = record[key]
  if (direct !== undefined && direct !== null && direct !== '') return direct

  const lastUnderscore = key.lastIndexOf('_')
  const hasLangSuffix = lastUnderscore > 0 && LANGS.includes(key.slice(lastUnderscore + 1))
  const base    = hasLangSuffix ? key.slice(0, lastUnderscore) : key  // 'desc'
  const keyLang = hasLangSuffix ? key.slice(lastUnderscore + 1) : lang // 'uz'

  // Build list of base names to try (the defined one + aliases)
  const basesToTry = [base, ...(KEY_ALIASES[base] || [])].filter((b, i, a) => a.indexOf(b) === i)
  // Build list of langs to try (keyLang first, then active lang, then all)
  const langsToTry = [keyLang, lang, 'uz', 'ru', 'oz'].filter((l, i, a) => a.indexOf(l) === i)

  for (const b of basesToTry) {
    // ── 2. Nested object: record['description']['uz'] ────────────────────────
    const nested = record[b]
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      for (const l of langsToTry) {
        if (nested[l] !== undefined && nested[l] !== null && nested[l] !== '')
          return nested[l]
      }
    }

    // ── 3. Flat lang variants: record['description_uz'] ──────────────────────
    for (const l of langsToTry) {
      const flatKey = `${b}_${l}`
      const flatVal = record[flatKey]
      if (flatVal !== undefined && flatVal !== null && flatVal !== '') return flatVal
    }

    // ── 4. Plain key with no lang: record['description'] ─────────────────────
    if (record[b] !== undefined && record[b] !== null && record[b] !== '') return record[b]
  }

  // ── 5. Last resort: scan all record keys for anything containing the base ──
  for (const recordKey of Object.keys(record)) {
    if (recordKey.toLowerCase().includes(base.toLowerCase())) {
      const val = record[recordKey]
      if (typeof val === 'string' && val !== '') return val
      if (val && typeof val === 'object') {
        for (const l of langsToTry) {
          if (val[l] !== undefined && val[l] !== null && val[l] !== '') return val[l]
        }
      }
    }
  }

  return undefined
}

// Determine the best display keys from a record (skip internal/meta fields)
const SKIP_KEYS = ['_id', 'id', '__v', 'updatedAt', 'createdAt', 'password']

const getId = (record) => {
  if (!record) return undefined
  // Check common id field names in priority order
  const idFields = ['_id', 'id', 'ID', 'Id', 'bannerId', 'newsId', 'leaderId', 'honoraryId', 'genderId', 'vacancyId', 'normativeId']
  for (const f of idFields) {
    if (record[f] !== undefined && record[f] !== null) return record[f]
  }
  // Last resort: scan all keys for anything ending in 'id' or 'Id'
  const idKey = Object.keys(record).find(k => k.toLowerCase() === 'id' || k.toLowerCase().endsWith('id'))
  if (idKey) return record[idKey]
  return undefined
}

// ─── Create/Edit Form ─────────────────────────────────────────────────────────

function RecordForm({ fields, values, onChange, disabled }) {
  // Group consecutive _uz/_oz/_ru fields into language blocks for cleaner UI
  const groups = []
  let i = 0
  while (i < fields.length) {
    const f = fields[i]
    const base = f.key.replace(/_(uz|oz|ru)$/, '')
    const isML = f.key !== base && ['_uz', '_oz', '_ru'].some(s => f.key.endsWith(s))
    if (isML && f.key.endsWith('_uz')) {
      const oz = fields.find(x => x.key === `${base}_oz`)
      const ru = fields.find(x => x.key === `${base}_ru`)
      groups.push({ type: 'ml', base, label: f.label.replace(' (UZ)', ''), required: f.required, uz: f, oz, ru })
      i += (oz ? 1 : 0) + (ru ? 1 : 0) + 1
    } else if (isML) {
      i++ // already consumed as part of a group
    } else {
      groups.push({ type: 'single', field: f })
      i++
    }
  }

  const renderInput = (field, value) => {
    if (field.type === 'textarea') return (
      <textarea rows={3} name={field.key} value={value || ''} onChange={onChange}
        disabled={disabled} className="input-field resize-none text-sm"
        placeholder={`Enter value…`} />
    )
    if (field.type === 'toggle') return (
      <div className="flex items-center gap-3 mt-1">
        <button type="button"
          onClick={() => onChange({ target: { name: field.key, value: !value } })}
          className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${value ? 'bg-petroleum-600' : 'bg-slate-700'}`}>
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-slate-300">{value ? 'Yes' : 'No'}</span>
      </div>
    )
    if (field.type === 'file') return (
      <input type="file" name={field.key} onChange={onChange} disabled={disabled}
        className="input-field py-2 text-sm" accept="image/*,.pdf,.doc,.docx" />
    )
    if (field.type === 'multi-file') return (
      <input type="file" name={field.key} onChange={onChange} disabled={disabled}
        className="input-field py-2 text-sm" accept="image/*" multiple />
    )
    if (field.type === 'nested-ml' || field.type === 'nested-ml-textarea') {
      const isTA = field.type === 'nested-ml-textarea'
      return (
        <div className="rounded-xl border border-slate-700/50 overflow-hidden">
          {['uz', 'ru', 'oz'].map((lang, i) => {
            const flagMap = { uz: '🇺🇿', oz: '🇺🇿', ru: '🇷🇺' }
            const nestedKey = `${field.key}.${lang}`
            return (
              <div key={lang} className={`p-3 ${i < 2 ? 'border-b border-slate-700/40' : ''}`}>
                <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                  {flagMap[lang]} {lang.toUpperCase()}
                </label>
                {isTA
                  ? <textarea rows={2} name={nestedKey} value={value?.[lang] || ''} onChange={onChange}
                      disabled={disabled} className="input-field resize-none text-sm" />
                  : <input type="text" name={nestedKey} value={value?.[lang] || ''} onChange={onChange}
                      disabled={disabled} className="input-field text-sm" />
                }
              </div>
            )
          })}
        </div>
      )
    }
    if (field.type === 'select') return (
      <select name={field.key} value={value || ''} onChange={onChange} disabled={disabled} className="input-field">
        <option value="">— Select —</option>
        {field.options.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
      </select>
    )
    return (
      <input type={field.type || 'text'} name={field.key} value={value || ''}
        onChange={onChange} disabled={disabled} className="input-field"
        placeholder="Enter value…" />
    )
  }

  return (
    <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
      {groups.map((group, gi) => {
        if (group.type === 'single') {
          const f = group.field
          return (
            <div key={f.key}>
              <label className="label">
                {f.label}
                {f.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {renderInput(f, values[f.key])}
            </div>
          )
        }

        // Multilingual block
        const { base, label, required, uz, oz, ru } = group
        return (
          <div key={base} className="rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="bg-slate-800/60 px-3 py-2 border-b border-slate-700/40">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
              </span>
            </div>
            <div className="p-3 space-y-3">
              {[uz, oz, ru].filter(Boolean).map(f => {
                const lang = f.key.split('_').pop().toUpperCase()
                const flagMap = { UZ: '🇺🇿', OZ: '🇺🇿', RU: '🇷🇺' }
                return (
                  <div key={f.key}>
                    <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                      <span>{flagMap[lang] || '🌐'}</span> {lang}
                    </label>
                    {renderInput(f, values[f.key])}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GenericCrudPage({ title, endpoint, createEndpoint, updateEndpoint, deleteEndpoint, fields, description }) {
  const { lang } = useLang()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteRecord, setDeleteRecord] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get(endpoint)
      console.log(`[DEBUG ${endpoint}] raw response:`, data)
      // Try known keys first, then scan all values for the first array
      const result =
        data?.data ??
        data?.items ??
        data?.result ??
        data?.news ??
        data?.localNews ??
        data?.localnews ??
        data?.industryNews ??
        data?.leaders ??
        data?.honorary ??
        data?.banners ??
        data?.gender ??
        data?.vacancies ??
        data?.normative ??
        data?.bolimlar ??
        data?.plansReports ??
        data?.xotinQizlar ??
        data?.yoshlarSiyosati ??
        // fallback: find the first array-valued key in the response object
        (typeof data === 'object' && !Array.isArray(data)
          ? Object.values(data).find(v => Array.isArray(v))
          : null) ??
        data
      const arr = Array.isArray(result) ? result : []
      console.log(`[DEBUG ${endpoint}] parsed ${arr.length} records. First:`, arr[0])
      setRecords(arr)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target

    // Nested key e.g. "title.uz" → { title: { uz: value } }
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormValues((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent] || {}), [child]: value },
      }))
      return
    }

    if (type === 'file' && files.length > 1) {
      setFormValues((prev) => ({ ...prev, [name]: Array.from(files) }))
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
      }))
    }
  }

  const buildPayload = () => {
    const hasFile = Object.values(formValues).some(v => v instanceof File || Array.isArray(v))
    // If nested objects present (vacancies pattern), always send as JSON
    const hasNested = Object.values(formValues).some(v => v && typeof v === 'object' && !(v instanceof File) && !Array.isArray(v))

    if (hasFile && !hasNested) {
      const fd = new FormData()
      Object.entries(formValues).forEach(([k, v]) => {
        if (v === undefined || v === '') return
        if (Array.isArray(v)) {
          v.forEach(file => fd.append(k, file))
        } else {
          fd.append(k, v)
        }
      })
      return fd
    }
    return formValues
  }

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      const payload = buildPayload()
      const isForm = payload instanceof FormData
      const postUrl = createEndpoint || endpoint
      const { data } = await apiClient.post(postUrl, payload, {
        headers: isForm ? { 'Content-Type': 'multipart/form-data' } : {},
      })
      toast.success('Created successfully!')
      setCreateOpen(false)
      setFormValues({})
      fetchRecords()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || err.message || 'Failed to create'
      console.error('[POST error]', err.response?.status, err.response?.data)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditOpen = (record) => {
    const extracted = {}
    fields.forEach(({ key, type }) => {
      if (type === 'file' || type === 'multi-file') return
      const val = resolveValue(record, key)
      if (type === 'nested-ml' || type === 'nested-ml-textarea') {
        extracted[key] = typeof val === 'object' && val !== null ? val : { uz: '', ru: '', oz: '' }
      } else {
        extracted[key] = typeof val === 'object' && val !== null && !(val instanceof File)
          ? getText(val)
          : val ?? ''
      }
    })
    setFormValues(extracted)
    setEditRecord(record)
  }

  const handleUpdate = async () => {
    setSubmitting(true)
    try {
      const payload = buildPayload()
      const isForm = payload instanceof FormData
      const recordId = getId(editRecord)
      const putBase = updateEndpoint || endpoint
      console.log(`[PUT] url: ${putBase}/${recordId}`)
      await apiClient.put(`${putBase}/${recordId}`, payload, {
        headers: isForm ? { 'Content-Type': 'multipart/form-data' } : {},
      })
      toast.success('Updated successfully!')
      setEditRecord(null)
      setFormValues({})
      fetchRecords()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || err.message || 'Failed to update'
      console.error('[PUT error]', err.response?.status, err.response?.data)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    const recordId = getId(deleteRecord)
    const deleteBase = deleteEndpoint || endpoint
    const deleteUrl = `${deleteBase}/${recordId}`
    console.log(`[DELETE] url: ${deleteUrl} | id: ${recordId} | record keys:`, Object.keys(deleteRecord || {}))
    try {
      await apiClient.delete(deleteUrl)
      toast.success('Deleted successfully!')
      setRecords((prev) => prev.filter((r) => getId(r) !== getId(deleteRecord)))
      setDeleteRecord(null)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || err.message || 'Failed to delete'
      console.error('[DELETE error]', err.response?.status, err.response?.data)
      toast.error(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Show only fields relevant to current language.
  // Fields with no lang suffix (_uz/_oz/_ru) always show (e.g. plain 'title', 'deadline').
  // Fields with a lang suffix only show if they match the active lang.
  const displayFields = fields.filter(f => {
    if (f.type === 'file' || f.type === 'multi-file') return false
    const suffix = f.key.match(/_(uz|oz|ru)$/)
    if (!suffix) return true       // no lang suffix → always show
    return suffix[1] === lang      // lang suffix → only show active lang
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-slate-100">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          <p className="text-xs text-slate-600 font-mono mt-1">{endpoint} · {records.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRecords} disabled={loading} className="btn-secondary flex items-center gap-2 text-sm">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => { setFormValues({}); setCreateOpen(true) }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={displayFields.length + 1} /></div>
        ) : records.length === 0 ? (
          <EmptyState
            title={`No ${title} records yet`}
            description="Click 'Add New' to create your first entry."
            action={
              <button onClick={() => { setFormValues({}); setCreateOpen(true) }} className="btn-primary text-sm">
                Add New
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/40">
                  {displayFields.map((f) => (
                    <th key={f.key} className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.map((record, i) => (
                  <tr key={getId(record) || i} className="hover:bg-slate-800/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                    {displayFields.map((f, j) => {
                      const val = resolveValue(record, f.key, lang)
                      return (
                        <td key={f.key} className="px-5 py-3.5 max-w-xs">
                          {j === 0 ? (
                            <p className="text-sm text-slate-200 font-medium truncate max-w-[200px]">{getText(val, lang)}</p>
                          ) : typeof val === 'boolean' ? (
                            <Badge variant={val ? 'success' : 'warning'}>
                              <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-petroleum-400' : 'bg-amber-400'}`} />
                              {val ? 'Yes' : 'No'}
                            </Badge>
                          ) : (
                            <p className="text-sm text-slate-400 truncate max-w-[160px]" title={getText(val, lang)}>{getText(val, lang)}</p>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(record)}
                          className="text-xs text-petroleum-400 hover:text-petroleum-300 font-medium transition-colors bg-petroleum-900/20 hover:bg-petroleum-900/40 px-3 py-1.5 rounded-lg border border-petroleum-800/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteRecord(record)}
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

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={`Add New ${title}`}>
        <RecordForm fields={fields} values={formValues} onChange={handleFormChange} disabled={submitting} />
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-700/40">
          <button onClick={handleCreate} disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
            {submitting && <Spinner size="sm" className="text-white" />}
            Create
          </button>
          <button onClick={() => setCreateOpen(false)} className="flex-1 btn-secondary">Cancel</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editRecord} onClose={() => setEditRecord(null)} title={`Edit ${title}`}>
        <RecordForm fields={fields} values={formValues} onChange={handleFormChange} disabled={submitting} />
        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-700/40">
          <button onClick={handleUpdate} disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
            {submitting && <Spinner size="sm" className="text-white" />}
            Save Changes
          </button>
          <button onClick={() => setEditRecord(null)} className="flex-1 btn-secondary">Cancel</button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteRecord} onClose={() => setDeleteRecord(null)} title="Confirm Deletion">
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to delete this {title.toLowerCase()} record? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 btn-danger flex items-center justify-center gap-2 py-2.5">
            {deleteLoading && <Spinner size="sm" className="text-red-300" />}
            Delete
          </button>
          <button onClick={() => setDeleteRecord(null)} className="flex-1 btn-secondary">Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
