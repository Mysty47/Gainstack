import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExercisesPage from "./pages/WorkoutPage.jsx";
import WorkoutCreationPage from "./pages/WorkoutCreationPage";
import CreatePostPage from "./pages/CreatePostPage";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
          />

          <Route
              path="/profile-page"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
          />

          <Route
              path="/workout-page"
              element={
                <ProtectedRoute>
                  <ExercisesPage />
                </ProtectedRoute>
              }
          />

          <Route
              path="/workout-creation-page"
              element={
                <ProtectedRoute>
                  <WorkoutCreationPage />
                </ProtectedRoute>
              }
          />

          <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
          />


          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;