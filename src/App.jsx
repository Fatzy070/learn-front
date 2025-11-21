import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import HomePage from './pages/home/HomePage';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './layout/Layout';
import CoursesPage from './pages/courses/CoursesPage';
import ViewAll from './components/ViewAll';
import Learn from './components/Learn';
import TutorialPage from './pages/home/TutorialPage';
import EditProfilePage from './pages/auth/EditProfilePage';
import Video from './components/Video';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path='/courses' element={<CoursesPage />} />
            <Route path='/course/:playlistId' element={<ViewAll />} />
            <Route path='/video/:videoId' element={<Video />} />
            <Route path='/my-learning' element={<Learn />} />
            <Route path='/tutorial' element={<TutorialPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
           
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
