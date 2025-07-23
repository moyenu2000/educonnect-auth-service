import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ProfileManagement } from './components/ProfileManagement'
import { TwoFactorSetup } from './components/TwoFactorSetup'
import { AdminUserManagement } from './components/AdminUserManagement'
import { HealthCheck } from './components/HealthCheck'

// Layout Components
import Layout from './components/layout/Layout'

// Dashboard Components
import AdminDashboard from './components/admin/AdminDashboard'
import QuestionSetterDashboard from './components/question-setter/QuestionSetterDashboard'
import QuestionManagement from './components/question-setter/QuestionManagement'
import CreateQuestion from './components/question-setter/CreateQuestion'
import StudentDashboard from './components/student/StudentDashboard'

// Student Components
import DailyQuestions from './components/student/DailyQuestions'
import Practice from './components/student/Practice'
import Discussions from './components/student/Discussions'
import Contests from './components/student/Contests'
import LiveExams from './components/student/LiveExams'

// Admin Components  
import SubjectManagement from './components/admin/SubjectManagement'
import DailyQuestionManagement from './components/admin/DailyQuestionManagement'

// Test Component
import TestPage from './components/TestPage'

type AuthView = 'login' | 'register' | 'forgot-password'

const AuthSection: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login')

  const renderAuthView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        )
      case 'register':
        return (
          <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordForm onBack={() => setCurrentView('login')} />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EduConnect</h1>
          <p className="text-gray-600 mt-2">Your Learning Management Platform</p>
        </div>
        {renderAuthView()}
      </div>
    </div>
  )
}

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode
  requiredRole?: string
}> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If wrong role, redirect to user's dashboard
  if (requiredRole && user && user.role && user.role !== requiredRole) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />
  }

  return <>{children}</>
}

// Role-based Route Redirects
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If logged in, redirect based on role
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'QUESTION_SETTER':
      return <Navigate to="/question-setter" replace />
    case 'STUDENT':
      return <Navigate to="/student" replace />
    default:
      return <Navigate to="/student" replace />
  }
}

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <RoleBasedRedirect /> : <AuthSection />} 
      />
      
      {/* Default redirect based on user role */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Protected Routes with Layout */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><AdminUserManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><SubjectManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><ProfileManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><TwoFactorSetup /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/health" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><HealthCheck /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/questions" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><QuestionManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/questions/create" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><CreateQuestion /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/daily-questions" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><DailyQuestionManagement /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/question-setter" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><QuestionSetterDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/profile" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><ProfileManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/settings" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><TwoFactorSetup /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/manage" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><QuestionManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/create" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><CreateQuestion /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/student" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/daily-questions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><DailyQuestions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/practice" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Practice /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/discussions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Discussions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/contests" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Contests /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/exams" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><LiveExams /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><ProfileManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/settings" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><TwoFactorSetup /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/test" element={
        <ProtectedRoute>
          <Layout><TestPage /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
