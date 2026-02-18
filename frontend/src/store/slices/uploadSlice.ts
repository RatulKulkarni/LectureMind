import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UploadState = {
  lastLectureIds: string[]
  lastMessage: string | null
  updatedAt: string | null
}

const initialState: UploadState = {
  lastLectureIds: [],
  lastMessage: null,
  updatedAt: null,
}

type UploadPayload = {
  lectureIds: string[]
  message: string
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadResult: (state, action: PayloadAction<UploadPayload>) => {
      state.lastLectureIds = action.payload.lectureIds
      state.lastMessage = action.payload.message
      state.updatedAt = new Date().toISOString()
    },
    clearUploadResult: state => {
      state.lastLectureIds = []
      state.lastMessage = null
      state.updatedAt = null
    },
  },
})

export const { setUploadResult, clearUploadResult } = uploadSlice.actions
export default uploadSlice.reducer