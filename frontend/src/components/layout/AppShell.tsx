import { motion } from 'framer-motion'
import { Home, LogOut, UploadCloud } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/upload/single', label: 'Upload', icon: UploadCloud },
]

export const AppShell = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const email = useAppSelector(state => state.auth.email)

  const onLogout = () => {
    dispatch(logout())
    navigate('/auth', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold">LectureMind</div>
          <nav className="hidden gap-2 md:flex">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:inline">{email}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}