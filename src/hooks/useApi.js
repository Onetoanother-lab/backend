import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Generic hook for making API calls with loading/error state.
 * Usage: const { execute, loading, error } = useApiCall(myAPI.create)
 */
export function useApiCall(apiFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFn(...args)
        setData(result)
        return { success: true, data: result }
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Something went wrong'
        setError(message)
        return { success: false, error: message }
      } finally {
        setLoading(false)
      }
    },
    [apiFn]
  )

  return { execute, loading, error, data }
}

/**
 * Hook for form state management
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setTouched({})
  }, [initialValues])

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  return { values, touched, handleChange, reset, setValue, setValues }
}

/**
 * Hook for data fetching with pagination
 */
export function useFetch(apiFn, params = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async (overrideParams = {}) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn({ ...params, ...overrideParams })
      setData(result?.data || result || [])
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load data'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  return { data, loading, error, refetch: fetch }
}
