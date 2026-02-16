/**
 * Slice Auth — page de connexion (Vertical Slice Architecture).
 * Email/mot de passe, SSO Google, étape 2FA si activée.
 */
import { useState } from 'react'
import { useAuth } from '../../shared/auth/AuthContext.jsx'
import './Auth.css'

/**
 * @param {object} props
 * @param {() => void} [props.onSuccess] - Callback après connexion réussie
 * @param {() => void} [props.onGoToSignup] - Afficher la page inscription
 */
function LoginPage({ onSuccess, onGoToSignup }) {
  const { login, verify2FA, loginWithGoogle, pending2FAToken, setPending2FAToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code2FA, setCode2FA] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (pending2FAToken) {
        await verify2FA(pending2FAToken, code2FA)
        setPending2FAToken(null)
        onSuccess?.()
      } else {
        const data = await login(email, password)
        if (data.requiresTwoFactor) {
          setCode2FA('')
        } else {
          onSuccess?.()
        }
      }
    } catch (err) {
      setError(err.message || 'Connexion impossible')
    } finally {
      setSubmitting(false)
    }
  }

  if (pending2FAToken) {
    return (
      <section className="auth-slice">
        <h2>Code à usage unique</h2>
        <p className="auth-hint">Entrez le code affiché par votre application d’authentification.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}
          <label>
            Code à 6 chiffres
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code2FA}
              onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoFocus
            />
          </label>
          <div className="auth-actions">
            <button type="submit" disabled={submitting || code2FA.length !== 6}>
              {submitting ? 'Vérification…' : 'Valider'}
            </button>
            <button
              type="button"
              className="header-link"
              onClick={() => setPending2FAToken(null)}
            >
              Retour
            </button>
          </div>
        </form>
      </section>
    )
  }

  return (
    <section className="auth-slice">
      <h2>Connexion</h2>
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
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
        <div className="auth-divider">ou</div>
        <button
          type="button"
          className="auth-google"
          onClick={loginWithGoogle}
          disabled={submitting}
        >
          Se connecter avec Google
        </button>
        {onGoToSignup && (
          <p className="auth-links">
            Pas encore de compte ?{' '}
            <button type="button" className="header-link" onClick={onGoToSignup}>
              S’inscrire
            </button>
          </p>
        )}
      </form>
    </section>
  )
}

export default LoginPage
