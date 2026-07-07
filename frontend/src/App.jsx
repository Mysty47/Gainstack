import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import WorkoutPage from './pages/WorkoutPage'
import WorkoutCreationPage from './pages/WorkoutCreationPage'
import CreatePostPage from './pages/CreatePostPage'
import LikedPostsPage from './pages/LikedPostsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/workout-page" element={<WorkoutPage />} />
        <Route path="/workout-creation-page" element={<WorkoutCreationPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/liked-posts" element={<LikedPostsPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
