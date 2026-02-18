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

export const UploadSinglePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector(state => state.auth.token)
  const selectedUnitId = useAppSelector(state => state.app.selectedUnitId)

  const [unitId, setUnitId] = useState(selectedUnitId ?? '')
  const [title, setTitle] = useState('')
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
      formData.append('unitId', unitId)
      formData.append('title', title)
      formData.append('file', file)

      const response = await api.post<string>('/upload/single', formData, {
        headers: {
          ...getAuthHeaders(token),
          'Content-Type': 'multipart/form-data',
        },
      })

      const lectureIds = extractLectureIds(response.data)
      dispatch(setUploadResult({ lectureIds, message: response.data }))
      navigate('/processing')
    } catch (e) {
      setError('Upload failed. Verify backend route availability and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Upload Single Lecture</h1>
        <p className="mt-1 text-sm text-slate-300">Upload one lecture video for transcript generation.</p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Unit ID</label>
            <input
              required
              value={unitId}
              onChange={event => setUnitId(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Lecture Title</label>
            <input
              required
              value={title}
              onChange={event => setTitle(event.target.value)}
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

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500 disabled:opacity-70"
          >
            {loading ? 'Uploading...' : 'Upload and Process'}
          </button>
        </form>
      </motion.div>
    </section>
  )
}