import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Organize by Semester & Unit',
    description: 'Structure your teaching flow with clear semester and unit grouping.',
    icon: BookOpen,
  },
  {
    title: 'Upload & Process Lectures',
    description: 'Upload lecture videos and track processing in one place.',
    icon: UploadCloud,
  },
]

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-52 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10">
        <header className="flex items-center justify-between py-3">
          <h1 className="text-lg font-semibold">LectureMind</h1>
          <Link
            to="/auth"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Login
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-8 py-10 md:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="mb-3 inline-flex rounded-full border border-brand-500/40 bg-brand-500/15 px-3 py-1 text-xs text-brand-100">
              AI-assisted lecture workflow
            </p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              Turn lectures into organized, searchable learning assets.
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
              Manage semesters and units, upload lecture videos, and monitor processing status from one focused dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-lg border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Open Dashboard
              </Link>
            </div>
          </motion.div>

          <div className="space-y-4">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  className="glass rounded-2xl p-5"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                >
                  <span className="mb-3 inline-flex rounded-lg bg-brand-500/20 p-2 text-brand-100">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}