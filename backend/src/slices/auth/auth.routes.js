/**
 * Slice Auth — inscription, connexion, SSO Google, 2FA (Vertical Slice Architecture).
 * @module slices/auth/auth.routes
 */

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { getDb } from '../../shared/db.js'
import { requireAuth } from '../../shared/authMiddleware.js'
import { JWT_SECRET } from '../../shared/authMiddleware.js'
import {
  generateTwoFactorSecret,
  verifyTwoFactorCode,
  encryptTwoFactorSecret,
  decryptTwoFactorSecret,
} from '../../shared/twoFactor.js'
import { getGoogleAuthUrl, exchangeGoogleCode } from './sso.google.js'
import QRCode from 'qrcode'

const router = Router()
const JWT_EXPIRES_IN = '7d'
const JWT_TEMP_2FA_EXPIRES_IN = '5m'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

/**
 * Crée l’index unique sur email si nécessaire.
 * @param {object} db - Base MongoDB
 * @returns {Promise<void>}
 */
async function ensureUsersIndex(db) {
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
}

function issueToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function issueTemp2FAToken(userId) {
  return jwt.sign(
    { userId, temp2FA: true },
    JWT_SECRET,
    { expiresIn: JWT_TEMP_2FA_EXPIRES_IN }
  )
}

function sendAuthResponse(res, user, options = {}) {
  const u = user
  const userId = u._id.toString()
  if (u.twoFactorEnabled) {
    const tempToken = issueTemp2FAToken(userId)
    if (options.redirect) {
      const url = new URL(FRONTEND_URL)
      url.searchParams.set('requiresTwoFactor', '1')
      url.searchParams.set('tempToken', tempToken)
      res.redirect(url.toString())
    } else {
      res.json({ requiresTwoFactor: true, tempToken })
    }
    return
  }
  const token = issueToken(userId)
  if (options.redirect) {
    const url = new URL(FRONTEND_URL)
    url.searchParams.set('token', token)
    res.redirect(url.toString())
  } else {
    res.json({
      token,
      user: {
        id: userId,
        email: u.email,
        name: u.name,
      },
    })
  }
}

/**
 * POST /api/auth/signup — Inscription d’un nouvel utilisateur.
 * Body: { email, password, name? }
 */
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {}
    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' })
      return
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' })
      return
    }

    const db = getDb()
    await ensureUsersIndex(db)

    const existing = await db.collection('users').findOne({ email: email.trim().toLowerCase() })
    if (existing) {
      res.status(409).json({ error: 'Un compte existe déjà avec cet email' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const doc = {
      email: email.trim().toLowerCase(),
      passwordHash,
      name: name?.trim() || null,
      createdAt: new Date(),
      twoFactorEnabled: false,
      twoFactorSecret: null,
    }
    const result = await db.collection('users').insertOne(doc)
    const user = { _id: result.insertedId, ...doc }

    sendAuthResponse(res, user)
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Erreur lors de l’inscription' })
  }
})

/**
 * POST /api/auth/login — Connexion (email + mot de passe).
 * Si 2FA activée, renvoie requiresTwoFactor + tempToken.
 * Body: { email, password }
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' })
      return
    }

    const db = getDb()
    const user = await db.collection('users').findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      return
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' })
      return
    }

    sendAuthResponse(res, user)
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Erreur lors de la connexion' })
  }
})

/**
 * GET /api/auth/me — Utilisateur courant (token requis).
 */
router.get('/auth/me', requireAuth, (req, res) => {
  const u = req.user
  res.json({
    user: {
      id: u._id.toString(),
      email: u.email,
      name: u.name,
      twoFactorEnabled: !!u.twoFactorEnabled,
    },
  })
})

/**
 * GET /api/auth/google — Redirection vers la page de consentement Google (SSO).
 */
router.get('/auth/google', (req, res) => {
  try {
    const redirectUri = `${BACKEND_URL}/api/auth/google/callback`
    const state = req.query.returnUrl
      ? Buffer.from(req.query.returnUrl).toString('base64url')
      : ''
    const url = getGoogleAuthUrl(redirectUri, state)
    res.redirect(url)
  } catch (err) {
    console.error('Google SSO error:', err)
    res.status(500).json({ error: 'SSO Google non configuré (GOOGLE_CLIENT_ID/SECRET)' })
  }
})

/**
 * GET /api/auth/google/callback — Callback OAuth Google ; crée ou récupère l’utilisateur, redirige vers le frontend avec token (ou requiresTwoFactor).
 */
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query
    if (!code) {
      res.redirect(`${FRONTEND_URL}?error=missing_code`)
      return
    }

    const redirectUri = `${BACKEND_URL}/api/auth/google/callback`
    const profile = await exchangeGoogleCode(code, redirectUri)
    if (!profile.email) {
      res.redirect(`${FRONTEND_URL}?error=no_email`)
      return
    }

    const db = getDb()
    await ensureUsersIndex(db)

    let user = await db.collection('users').findOne({ email: profile.email })
    if (!user) {
      const doc = {
        email: profile.email,
        passwordHash: null,
        name: profile.name,
        createdAt: new Date(),
        googleId: profile.email,
        twoFactorEnabled: false,
        twoFactorSecret: null,
      }
      const result = await db.collection('users').insertOne(doc)
      user = { _id: result.insertedId, ...doc }
    }

    const returnUrl = state
      ? Buffer.from(state, 'base64url').toString()
      : FRONTEND_URL
    const redirectBase = returnUrl.split('?')[0] || FRONTEND_URL

    if (user.twoFactorEnabled) {
      const tempToken = issueTemp2FAToken(user._id.toString())
      res.redirect(`${redirectBase}?requiresTwoFactor=1&tempToken=${tempToken}`)
    } else {
      const token = issueToken(user._id.toString())
      res.redirect(`${redirectBase}?token=${token}`)
    }
  } catch (err) {
    console.error('Google callback error:', err)
    res.redirect(`${FRONTEND_URL}?error=sso_failed`)
  }
})

/**
 * POST /api/auth/2fa/verify — Vérification du code 2FA après login (tempToken + code).
 * Body: { tempToken, code }
 */
router.post('/auth/2fa/verify', async (req, res) => {
  try {
    const { tempToken, code } = req.body ?? {}
    if (!tempToken || !code?.trim()) {
      res.status(400).json({ error: 'tempToken et code requis' })
      return
    }

    let decoded
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET)
      if (!decoded.temp2FA || !decoded.userId) {
        res.status(401).json({ error: 'Token invalide' })
        return
      }
    } catch (_) {
      res.status(401).json({ error: 'Token expiré ou invalide' })
      return
    }

    const db = getDb()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId),
    })
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      res.status(401).json({ error: 'Utilisateur ou 2FA invalide' })
      return
    }

    const secret = decryptTwoFactorSecret(user.twoFactorSecret)
    if (!verifyTwoFactorCode(secret, code.trim())) {
      res.status(401).json({ error: 'Code incorrect' })
      return
    }

    const token = issueToken(user._id.toString())
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    })
  } catch (err) {
    console.error('2FA verify error:', err)
    res.status(500).json({ error: 'Erreur vérification 2FA' })
  }
})

/**
 * GET /api/auth/2fa/setup — Génère un secret 2FA et renvoie le QR (utilisateur connecté).
 * Le client envoie ce secret avec le code dans POST /auth/2fa/enable.
 */
router.get('/auth/2fa/setup', requireAuth, async (req, res) => {
  try {
    const user = req.user
    if (user.twoFactorEnabled) {
      res.status(400).json({ error: 'La 2FA est déjà activée' })
      return
    }

    const { secret, qrCodeUrl } = generateTwoFactorSecret(user.email)
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl)

    res.json({
      secret,
      qrCodeDataUrl,
    })
  } catch (err) {
    console.error('2FA setup error:', err)
    res.status(500).json({ error: 'Erreur configuration 2FA' })
  }
})

/**
 * POST /api/auth/2fa/enable — Active la 2FA après vérification du code (utilisateur connecté).
 * Body: { code, secret } (secret renvoyé par GET /auth/2fa/setup).
 */
router.post('/auth/2fa/enable', requireAuth, async (req, res) => {
  try {
    const user = req.user
    const { code, secret } = req.body ?? {}
    if (!code?.trim() || !secret) {
      res.status(400).json({ error: 'Code et secret requis' })
      return
    }

    if (user.twoFactorEnabled) {
      res.status(400).json({ error: 'La 2FA est déjà activée' })
      return
    }

    if (!verifyTwoFactorCode(secret, code.trim())) {
      res.status(400).json({ error: 'Code incorrect' })
      return
    }

    const db = getDb()
    const encrypted = encryptTwoFactorSecret(secret)
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { twoFactorEnabled: true, twoFactorSecret: encrypted } }
    )

    res.json({ ok: true, message: 'Double authentification activée' })
  } catch (err) {
    console.error('2FA enable error:', err)
    res.status(500).json({ error: 'Erreur activation 2FA' })
  }
})

/**
 * POST /api/auth/2fa/disable — Désactive la 2FA (utilisateur connecté).
 * Body: { code } — code TOTP actuel pour confirmer.
 */
router.post('/auth/2fa/disable', requireAuth, async (req, res) => {
  try {
    const user = req.user
    const { code } = req.body ?? {}
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      res.status(400).json({ error: '2FA non activée' })
      return
    }
    if (!code?.trim()) {
      res.status(400).json({ error: 'Code requis' })
      return
    }

    const secret = decryptTwoFactorSecret(user.twoFactorSecret)
    if (!verifyTwoFactorCode(secret, code.trim())) {
      res.status(401).json({ error: 'Code incorrect' })
      return
    }

    const db = getDb()
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { twoFactorEnabled: false, twoFactorSecret: null } }
    )

    res.json({ ok: true, message: 'Double authentification désactivée' })
  } catch (err) {
    console.error('2FA disable error:', err)
    res.status(500).json({ error: 'Erreur désactivation 2FA' })
  }
})
</think>
Corrigeant la route 2FA setup : pas de session serveur — retourner le secret au client ; pour enable, le client enverra secret + code.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace