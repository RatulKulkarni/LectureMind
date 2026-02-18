import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Calendar, Scissors, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

const cards = [
  {
    title: 'Create Semester',
    description: 'Create and set your active semester for upcoming units.',
    to: '/semester/new',
    icon: Calendar,
  },
  {
    title: 'Create Unit',
    description: 'Add a unit to the currently active semester.',
    to: '/unit/new',
    icon: BookOpen,
  },
  {
    title: 'Upload Single Lecture',
    description: 'Upload one lecture video and process transcript + thumbnail.',
    to: '/upload/single',
    icon: UploadCloud,
  },
  {
    title: 'Upload Split Lecture',
    description: 'Split one video between two units and process both parts.',
    to: '/upload/split',
    icon: Scissors,
  },
]

export const DashboardPage = () => {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">Choose what you want to do next.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
            >
              <Link
                to={card.to}
                className="glass group block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-brand-500/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex rounded-lg bg-brand-500/20 p-2 text-brand-100">
                    <Icon size={18} />
                  </span>
                  <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-1" />
                </div>
                <h2 className="text-lg font-medium">{card.title}</h2>
                <p className="mt-1 text-sm text-slate-300">{card.description}</p>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}