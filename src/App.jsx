import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import { StudyProvider } from './context/StudyContext'
import { GoalsProvider } from './context/GoalsContext'

import Layout from './Components/Layout'
import Dashboard from './Pages/Dashboard'
import GoalsPage from './Pages/GoalsPage'
import StudyPlanPage from './Pages/StudyPlanPage'
import SettingsPage from './Pages/SettingsPage'
import NotFound from './Pages/NotFound'

import './App.css'

export default function App() {
  return (
    <StudyProvider>
      <GoalsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="study-plan" element={<StudyPlanPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GoalsProvider>
    </StudyProvider>
  )
}

