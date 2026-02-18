import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export const ProcessingPage = () => {
  const { lastLectureIds, lastMessage, updatedAt } = useAppSelector(state => state.upload)

  return (
    <section className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Processing Status</h1>
        <p className="mt-1 text-sm text-slate-300">Lecture processing runs asynchronously in backend.</p>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} />
              Upload accepted
            </div>
            <p>{lastMessage ?? 'No recent upload message available.'}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-medium text-slate-200">Lecture IDs</p>
            {lastLectureIds.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-300">
                {lastLectureIds.map(lectureId => (
                  <li key={lectureId} className="rounded-md bg-white/5 px-3 py-2">
                    {lectureId}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No lecture IDs captured yet.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Clock3 size={14} />
              Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A'}
            </span>

            <Link
              to="/upload/single"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 transition hover:bg-white/10"
            >
              <RefreshCw size={14} />
              New Upload
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}