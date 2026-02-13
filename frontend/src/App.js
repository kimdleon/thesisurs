import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalProvider, useModal } from './contexts/ModalContext';
import Navigation from './components/Navigation';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import HomePage from './pages/HomePage';
import PublicThesisList from './pages/PublicThesisList';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import SubmissionPage from './pages/SubmissionPage';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function HomeRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
}

function AppContent() {
  const { loginModalOpen, registerModalOpen, closeLoginModal, closeRegisterModal, openRegisterModal, openLoginModal } = useModal();
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/browse" element={<PublicThesisList />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/submit" element={
          <ProtectedRoute>
            <SubmissionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        
        <Route path="/review/:id" element={
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<HomeRoute />} />
      </Routes>

      {/* Global Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={openRegisterModal}
        onLoginSuccess={() => navigate('/dashboard')}
      />
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={openLoginModal}
        onRegisterSuccess={() => navigate('/dashboard')}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
