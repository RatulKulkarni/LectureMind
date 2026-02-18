import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setCredentials } from '../store/slices/authSlice'
import { useAppDispatch } from '../store/hooks'

type AuthTab = 'login' | 'register'

export const AuthPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [tab, setTab] = useState<AuthTab>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | undefined)?.from ?? '/dashboard'

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<{ token: string }>('/auth/login', { email, password })
      dispatch(setCredentials({ token: response.data.token, email }))
      navigate(from, { replace: true })
    } catch (e) {
      setError('Login failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/register', { name, email, password })
      setTab('login')
    } catch (e) {
      setError('Registration failed. Try another email.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (tab === 'login') {
      await handleLogin()
      return
    }
    await handleRegister()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass w-full max-w-md rounded-2xl p-7 shadow-soft"
        >
          <h1 className="text-2xl font-semibold">Welcome to LectureMind</h1>
          <p className="mt-1 text-sm text-slate-300">Sign in to manage semesters, units, and lecture uploads.</p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                tab === 'login' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                tab === 'register' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {tab === 'register' && (
              <div>
                <label className="mb-1 block text-sm text-slate-300">Name</label>
                <input
                  required
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}