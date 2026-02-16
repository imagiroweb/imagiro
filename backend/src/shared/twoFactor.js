/**
 * Utilitaires 2FA TOTP (Vertical Slice Architecture — shared).
 * @module shared/twoFactor
 */

import speakeasy from 'speakeasy'
import crypto from 'crypto'

const ALGO = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16
const KEY_LENGTH = 32

function getEncryptionKey() {
  const secret = process.env.JWT_SECRET || 'change-me-in-production'
  return crypto.scryptSync(secret, 'salt-2fa', KEY_LENGTH)
}

/**
 * Génère un secret TOTP et l’URL pour le QR code.
 * @param {string} email - Email de l’utilisateur (affiché dans l’app d’auth)
 * @param {string} issuer - Nom de l’app (ex. Imagiro)
 * @returns {{ secret: string, qrCodeUrl: string }}
 */
export function generateTwoFactorSecret(email, issuer = 'Imagiro') {
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${email})`,
    issuer,
    length: 20,
  })
  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url,
  }
}

/**
 * Vérifie un code TOTP pour un secret donné.
 * @param {string} secret - Secret base32
 * @param {string} code - Code à 6 chiffres
 * @returns {boolean}
 */
export function verifyTwoFactorCode(secret, code) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 1,
  })
}

/**
 * Chiffre un secret 2FA pour stockage en base.
 * @param {string} plainSecret - Secret en clair (base32)
 * @returns {string} Secret chiffré (hex)
 */
export function encryptTwoFactorSecret(plainSecret) {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const enc = Buffer.concat([
    cipher.update(plainSecret, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('hex')
}

/**
 * Déchiffre un secret 2FA.
 * @param {string} encrypted - Secret chiffré (hex)
 * @returns {string} Secret en clair (base32)
 */
export function decryptTwoFactorSecret(encrypted) {
  const key = getEncryptionKey()
  const buf = Buffer.from(encrypted, 'hex')
  const iv = buf.subarray(0, IV_LENGTH)
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
  const enc = buf.subarray(IV_LENGTH + TAG_LENGTH)
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(enc) + decipher.final('utf8')
}
