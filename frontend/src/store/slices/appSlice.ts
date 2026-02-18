import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AppState = {
  selectedSemesterId: string | null
  selectedUnitId: string | null
}

const initialState: AppState = {
  selectedSemesterId: null,
  selectedUnitId: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedSemesterId: (state, action: PayloadAction<string | null>) => {
      state.selectedSemesterId = action.payload
    },
    setSelectedUnitId: (state, action: PayloadAction<string | null>) => {
      state.selectedUnitId = action.payload
    },
  },
})

export const { setSelectedSemesterId, setSelectedUnitId } = appSlice.actions
export default appSlice.reducer