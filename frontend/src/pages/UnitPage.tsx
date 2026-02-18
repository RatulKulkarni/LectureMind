import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { api, getAuthHeaders } from '../lib/api'
import { setSelectedUnitId } from '../store/slices/appSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

type UnitResponse = {
  id: string
  title: string
}

export const UnitPage = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const response = await api.post<UnitResponse>(
        '/unit',
        { title },
        { headers: getAuthHeaders(token) },
      )
      dispatch(setSelectedUnitId(response.data.id))
      setMessage(`Unit created: ${response.data.title}`)
      setTitle('')
    } catch (e) {
      setError('Failed to create unit. Ensure an active semester exists.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Create Unit</h1>
        <p className="mt-1 text-sm text-slate-300">Backend attaches this unit to your active semester.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Unit Title</label>
            <input
              required
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Unit 1: Introduction"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          {message && <p className="text-sm text-emerald-300">{message}</p>}
          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500 disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Unit'}
          </button>
        </form>
      </motion.div>
    </section>
  )
}