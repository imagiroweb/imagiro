/**
 * Point de composition racine (Vertical Slice Architecture).
 * Assemble le layout, l'auth et les slices (home, login, signup).
 * @returns {JSX.Element}
 */
import { useState } from 'react'
import { AuthProvider, useAuth } from './shared/auth/AuthContext.jsx'
import Layout from './shared/layout/Layout.jsx'
import HomePage from './slices/home/HomePage.jsx'
import LoginPage from './slices/auth/LoginPage.jsx'
import SignupPage from './slices/auth/SignupPage.jsx'
import SecurityPage from './slices/auth/SecurityPage.jsx'
import './App.css'

function AppContent() {
  const { user, logout, loading } = useAuth()
  const [page, setPage] = useState('home')

  if (loading) {
    return (
      <Layout user={null} logout={() => {}} onNavigate={setPage}>
        <p>Chargement…</p>
      </Layout>
    )
  }

  return (
    <Layout user={user} logout={logout} onNavigate={setPage}>
      {page === 'home' && <HomePage />}
      {page === 'security' && <SecurityPage />}
      {page === 'login' && (
        <LoginPage
          onSuccess={() => setPage('home')}
          onGoToSignup={() => setPage('signup')}
        />
      )}
      {page === 'signup' && (
        <SignupPage
          onSuccess={() => setPage('home')}
          onGoToLogin={() => setPage('login')}
        />
      )}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
