import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExercisesPage from "./pages/WorkoutPage.jsx";
import WorkoutCreationPage from "./pages/WorkoutCreationPage";
import CreatePostPage from "./pages/CreatePostPage";
import ShowWorkoutPage from './pages/ShowWorkout'
import ProtectedRoute from "./components/ProtectedRoute";
import LikedPostPage from "./pages/LikedPostsPage.jsx";
import PublicRoute from "./components/PublicRoute.jsx";


function App() {
  return (
      <BrowserRouter>
        <Routes>

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignupPage />
                    </PublicRoute>
                }
            />

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
              path="/liked-posts"
              element={
                <ProtectedRoute>
                  <LikedPostPage />
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

          <Route
                        path="/show-workout"
                        element={
                          <ProtectedRoute>
                            <ShowWorkoutPage />
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