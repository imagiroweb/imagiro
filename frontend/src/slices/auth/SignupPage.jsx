/**
 * Slice Auth — page d’inscription (Vertical Slice Architecture).
 */
import { useState } from 'react'
import { useAuth } from '../../shared/auth/AuthContext.jsx'
import './Auth.css'

/**
 * @param {object} props
 * @param {() => void} [props.onSuccess] - Callback après inscription réussie
 * @param {() => void} [props.onGoToLogin] - Afficher la page connexion
 */
function SignupPage({ onSuccess, onGoToLogin }) {
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères')
      return
    }
    setSubmitting(true)
    try {
      await signup(email, password, name || undefined)
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Inscription impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-slice">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Mot de passe (8 caractères min.)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Nom (optionnel)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Inscription…' : 'Créer un compte'}
        </button>
        {onGoToLogin && (
          <p className="auth-links">
            Déjà un compte ?{' '}
            <button type="button" className="header-link" onClick={onGoToLogin}>
              Se connecter
            </button>
          </p>
        )}
      </form>
    </section>
  )
}

export default SignupPage
