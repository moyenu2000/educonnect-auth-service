import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Toast from './components/ui/toast'
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
import DailyQuestionConfig from './components/question-setter/DailyQuestionConfig'
import AddPracticeQuestions from './components/question-setter/AddPracticeQuestions'
import StudentDashboard from './components/student/StudentDashboard'

// Student Components
import DailyQuestions from './components/student/DailyQuestions'
import ExamPage from './components/student/ExamPage'
import Practice from './components/student/Practice'
import PracticeQuestions from './components/student/PracticeQuestions'
import PracticeSubmissionHistory from './components/student/PracticeSubmissionHistory'
import StudentAnalytics from './components/student/StudentAnalytics'
import Discussions from './components/student/Discussions'
import Contests from './components/student/Contests'
import ContestDetails from './components/student/ContestDetails'
import ContestTaking from './components/student/ContestTaking'
import ContestResults from './components/student/ContestResults'
import LiveExams from './components/student/LiveExams'
import AIAssistant from './components/student/AIAssistant'
import Messages from './components/Messages'
import MessagingDemo from './components/MessagingDemo'

// Group Components
import GroupList from './components/student/GroupList'
import GroupDetails from './components/student/GroupDetails'
import CreateGroup from './components/student/CreateGroup'
import EditGroup from './components/student/EditGroup'
import GroupMembers from './components/student/GroupMembers'
import GroupDiscussions from './components/student/GroupDiscussions'
import DiscussionDetail from './components/student/DiscussionDetail'

// Admin Components  
import SubjectManagement from './components/admin/SubjectManagement'
import DailyQuestionManagement from './components/admin/DailyQuestionManagement'
import PracticeProblemManagement from './components/admin/PracticeProblemManagement'
import ContestManagement from './components/admin/ContestManagement'
import ContestEditor from './components/admin/ContestEditor'

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">EduConnect</h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">Your Learning Management Platform</p>
        </div>
        <div className="flex justify-center">
          {renderAuthView()}
        </div>
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
      <Route path="/admin/questions/daily-config" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><DailyQuestionConfig /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/daily-questions" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><DailyQuestionManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/practice-problems" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><PracticeProblemManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/practice-problems/add-questions" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><AddPracticeQuestions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/contests" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><ContestManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/contests/create" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><ContestEditor /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/contests/edit/:id" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><ContestEditor /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/messages" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout><Messages /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/question-setter" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/subjects" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><SubjectManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/questions" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><QuestionManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/questions/create" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><CreateQuestion /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/questions/daily-config" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><DailyQuestionConfig /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/daily-questions" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><DailyQuestionManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/practice-problems" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><PracticeProblemManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/practice-problems/add-questions" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><AddPracticeQuestions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/contests" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><ContestManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/contests/create" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><ContestEditor /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-setter/contests/edit/:id" element={
        <ProtectedRoute requiredRole="QUESTION_SETTER">
          <Layout><ContestEditor /></Layout>
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
      <Route path="/student/exam" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><ExamPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/practice" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Practice /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/practice-questions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><PracticeQuestions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/practice-questions/submissions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><PracticeSubmissionHistory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/discussions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Discussions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/messages" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Messages /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/contests" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><Contests /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/analytics" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><StudentAnalytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/contest/:contestId/details" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><ContestDetails /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/contest/:contestId" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><ContestTaking /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/contest/:contestId/results" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><ContestResults /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/exams" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><LiveExams /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/ai" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><AIAssistant /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Group Routes */}
      <Route path="/student/groups" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><GroupList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/create" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><CreateGroup /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/:groupId" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><GroupDetails /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/:groupId/edit" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><EditGroup /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/:groupId/members" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><GroupMembers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/:groupId/discussions" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><GroupDiscussions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/groups/:groupId/discussions/:discussionId" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Layout><DiscussionDetail /></Layout>
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
      <Route path="/messaging-demo" element={<MessagingDemo />} />
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
        <ToastProvider>
          <AppContent />
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
