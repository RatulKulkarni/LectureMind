import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { LandingPage } from './pages/LandingPage.tsx'
import { AuthPage } from './pages/AuthPage.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { SemesterPage } from './pages/SemesterPage.tsx'
import { UnitPage } from './pages/UnitPage.tsx'
import { UploadSinglePage } from './pages/UploadSinglePage.tsx'
import { UploadSplitPage } from './pages/UploadSplitPage.tsx'
import { ProcessingPage } from './pages/ProcessingPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/semester/new" element={<SemesterPage />} />
            <Route path="/unit/new" element={<UnitPage />} />
            <Route path="/upload/single" element={<UploadSinglePage />} />
            <Route path="/upload/split" element={<UploadSplitPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
