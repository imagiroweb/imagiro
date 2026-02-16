/**
 * SSO Google — échange de code et récupération du profil (Vertical Slice Architecture).
 * @module slices/auth/sso.google
 */

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

/**
 * Échange un code d’autorisation contre des tokens et récupère l’email / nom.
 * @param {string} code - Code renvoyé par Google
 * @param {string} redirectUri - redirect_uri utilisé dans la requête d’auth
 * @returns {Promise<{ email: string, name: string | null }>}
 */
export async function exchangeGoogleCode(code, redirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET requis')
  }

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    throw new Error(`Google token error: ${err}`)
  }

  const tokens = await tokenRes.json()
  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!userRes.ok) throw new Error('Impossible de récupérer le profil Google')

  const profile = await userRes.json()
  return {
    email: profile.email?.toLowerCase() || '',
    name: profile.name || null,
  }
}

/**
 * Construit l’URL de redirection vers la page de consentement Google.
 * @param {string} redirectUri - URL de callback (backend)
 * @param {string} state - State à renvoyer (ex. URL frontend)
 * @returns {string}
 */
export function getGoogleAuthUrl(redirectUri, state = '') {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID requis')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    ...(state && { state }),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
