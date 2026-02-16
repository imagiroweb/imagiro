/**
 * Contexte d’authentification (Vertical Slice Architecture — shared).
 * Expose user, token, login, signup, logout, SSO Google, 2FA.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'imagiro_token'

const AuthContext = createContext(null)

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [loading, setLoading] = useState(!!localStorage.getItem(STORAGE_KEY))
  const [pending2FAToken, setPending2FAToken] = useState(null)

  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(STORAGE_KEY, newToken)
      setTokenState(newToken)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      setTokenState(null)
      setUser(null)
    }
    setPending2FAToken(null)
  }, [])

  const fetchMe = useCallback(async (authToken) => {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!res.ok) {
      setToken(null)
      return
    }
    const data = await res.json()
    setUser(data.user)
  }, [setToken])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    fetchMe(token)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [token, fetchMe, setToken])

  // Récupérer token ou tempToken 2FA depuis l’URL (retour SSO Google)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    const requiresTwoFactor = params.get('requiresTwoFactor')
    const tempToken = params.get('tempToken')
    if (urlToken) {
      setToken(urlToken)
      window.history.replaceState({}, '', window.location.pathname)
    } else if (requiresTwoFactor === '1' && tempToken) {
      setPending2FAToken(tempToken)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [setToken])

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Connexion impossible')
    if (data.requiresTwoFactor && data.tempToken) {
      setPending2FAToken(data.tempToken)
      return data
    }
    setToken(data.token)
    setUser(data.user)
    return data
  }, [setToken])

  const signup = useCallback(async (email, password, name) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: name || undefined }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Inscription impossible')
    if (data.requiresTwoFactor && data.tempToken) {
      setPending2FAToken(data.tempToken)
      return data
    }
    setToken(data.token)
    setUser(data.user)
    return data
  }, [setToken])

  const verify2FA = useCallback(async (tempToken, code) => {
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Code incorrect')
    setToken(data.token)
    setUser(data.user)
    setPending2FAToken(null)
    return data
  }, [setToken])

  const logout = useCallback(() => {
    setToken(null)
  }, [setToken])

  const loginWithGoogle = useCallback(() => {
    const returnUrl = window.location.origin + window.location.pathname
    window.location.href = `/api/auth/google?returnUrl=${encodeURIComponent(returnUrl)}`
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    verify2FA,
    loginWithGoogle,
    pending2FAToken,
    setPending2FAToken,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
