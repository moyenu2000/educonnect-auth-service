import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Header } from './components/layout/Header';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PracticePage } from './pages/assessment/PracticePage';
import { DiscussionsPage } from './pages/discussion/DiscussionsPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageLoader } from './components/common/LoadingSpinner';
import { useAuthStore } from './stores/authStore';
import { useWebSocket } from './hooks/useWebSocket';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout Component
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <main>{children}</main>
    </div>
  );
};

function App() {
  const { refreshUser, isAuthenticated, isLoading } = useAuthStore();
  useWebSocket(); // Initialize WebSocket connection

  useEffect(() => {
    // Refresh user data on app load if authenticated
    if (isAuthenticated) {
      refreshUser();
    }
  }, [refreshUser, isAuthenticated]);

  // Show loading screen during initial authentication check
  if (isLoading) {
    return <PageLoader text="Initializing..." />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Placeholder for other protected routes */}
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PracticePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-secondary-900">Live Exams</h1>
                      <p className="text-secondary-600 mt-2">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contests"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-secondary-900">Contests</h1>
                      <p className="text-secondary-600 mt-2">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/discussions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DiscussionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
                      <p className="text-secondary-600 mt-2">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
                      <p className="text-secondary-600 mt-2">Coming soon...</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Landing page */}
            <Route
              path="/"
              element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-secondary-900 mb-4">
                        Welcome to EduConnect
                      </h1>
                      <p className="text-xl text-secondary-600 mb-8">
                        Your comprehensive learning platform for practice, exams, and collaboration
                      </p>
                      {!isAuthenticated && (
                        <div className="space-x-4">
                          <a href="/register" className="btn btn-primary">
                            Get Started
                          </a>
                          <a href="/login" className="btn btn-outline">
                            Sign In
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Layout>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;