/**
 * Slice Auth — page Sécurité : activer / désactiver la 2FA (Vertical Slice Architecture).
 */
import { useState } from 'react'
import { useAuth } from '../../shared/auth/AuthContext.jsx'
import './Auth.css'

function SecurityPage() {
  const { user, token } = useAuth()
  const [step, setStep] = useState('idle') // idle | setup | enabling | disable
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null)
  const [secret, setSecret] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSetupClick() {
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setQrCodeDataUrl(data.qrCodeDataUrl)
      setSecret(data.secret)
      setStep('setup')
      setCode('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEnable() {
    if (!code.trim() || code.length !== 6 || !secret) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, secret }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setSuccess('Double authentification activée.')
      setStep('idle')
      setQrCodeDataUrl(null)
      setSecret(null)
      setCode('')
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDisable() {
    if (!code.trim() || code.length !== 6) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setSuccess('Double authentification désactivée.')
      setStep('idle')
      setCode('')
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  const twoFactorEnabled = !!user.twoFactorEnabled

  return (
    <section className="auth-slice security-slice">
      <h2>Sécurité</h2>
      {success && <p className="auth-success">{success}</p>}
      {error && <p className="auth-error">{error}</p>}

      <div className="security-block">
        <h3>Double authentification (2FA)</h3>
        {twoFactorEnabled ? (
          <p className="auth-hint">Activée. Saisissez votre code actuel pour la désactiver.</p>
        ) : (
          <p className="auth-hint">Renforcez votre compte avec un code à usage unique (Google Authenticator, etc.).</p>
        )}

        {step === 'idle' && !twoFactorEnabled && (
          <button
            type="button"
            className="button"
            onClick={handleSetupClick}
            disabled={submitting}
          >
            Activer la 2FA
          </button>
        )}

        {step === 'setup' && (
          <>
            <p className="auth-hint">Scannez ce QR code avec votre application, puis entrez le code généré.</p>
            {qrCodeDataUrl && (
              <div className="security-qr">
                <img src={qrCodeDataUrl} alt="QR code 2FA" width={180} height={180} />
              </div>
            )}
            <label>
              Code à 6 chiffres
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </label>
            <div className="auth-actions">
              <button
                type="button"
                onClick={handleEnable}
                disabled={submitting || code.length !== 6}
              >
                {submitting ? 'Activation…' : 'Activer'}
              </button>
              <button
                type="button"
                className="header-link"
                onClick={() => { setStep('idle'); setQrCodeDataUrl(null); setSecret(null); setCode(''); setError(''); }}
              >
                Annuler
              </button>
            </div>
          </>
        )}

        {step === 'idle' && twoFactorEnabled && (
          <>
            <label>
              Code actuel
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </label>
            <button
              type="button"
              className="auth-form button danger"
              onClick={handleDisable}
              disabled={submitting || code.length !== 6}
            >
              Désactiver la 2FA
            </button>
          </>
        )}
      </div>
    </section>
  )
}

export default SecurityPage
