import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api, getAuthHeaders } from '../lib/api'
import { setUploadResult } from '../store/slices/uploadSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const extractLectureIds = (value: string): string[] => {
  const matches = value.match(/[0-9a-fA-F-]{8,}/g)
  return matches ? Array.from(new Set(matches)) : []
}

export const UploadSplitPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector(state => state.auth.token)

  const [currentUnitId, setCurrentUnitId] = useState('')
  const [nextUnitId, setNextUnitId] = useState('')
  const [splitTime, setSplitTime] = useState('00:30')
  const [titlePart1, setTitlePart1] = useState('')
  const [titlePart2, setTitlePart2] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) {
      setError('Please choose a video file.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('currentUnitId', currentUnitId)
      formData.append('nextUnitId', nextUnitId)
      formData.append('splitTime', splitTime)
      formData.append('titlePart1', titlePart1)
      formData.append('titlePart2', titlePart2)
      formData.append('file', file)

      const response = await api.post<string>('/upload/split', formData, {
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'multipart/form-data',
        },
      })

      const lectureIds = extractLectureIds(response.data)
      dispatch(setUploadResult({ lectureIds, message: response.data }))
      navigate('/processing')
    } catch (e) {
      setError('Split upload failed. Ensure fields are valid and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Upload Split Lecture</h1>
        <p className="mt-1 text-sm text-slate-300">Split one video into two lecture entries.</p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Current Unit ID</label>
            <input
              required
              value={currentUnitId}
              onChange={event => setCurrentUnitId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Next Unit ID</label>
            <input
              required
              value={nextUnitId}
              onChange={event => setNextUnitId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Split Time (HH:MM)</label>
            <input
              required
              value={splitTime}
              onChange={event => setSplitTime(event.target.value)}
              placeholder="00:30"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Video File</label>
            <input
              required
              type="file"
              accept="video/*"
              onChange={event => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Title Part 1</label>
            <input
              required
              value={titlePart1}
              onChange={event => setTitlePart1(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Title Part 2</label>
            <input
              required
              value={titlePart2}
              onChange={event => setTitlePart2(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div className="md:col-span-2">
            {error && <p className="mb-3 text-sm text-rose-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500 disabled:opacity-70"
            >
              {loading ? 'Uploading...' : 'Upload and Split'}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  )
}