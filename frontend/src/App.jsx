import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ExercisesPage from './pages/ExercisesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/exercises-page" element={<ExercisesPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
