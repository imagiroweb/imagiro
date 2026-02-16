/**
 * Middleware de vérification JWT (Vertical Slice Architecture — shared).
 * @module shared/authMiddleware
 */

import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { getDb } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production'

/**
 * Vérifie le token Bearer et attache l’utilisateur à req.user.
 * Répond 401 si token absent ou invalide.
 * @param {object} req - Requête Express
 * @param {object} res - Réponse Express
 * @param {Function} next - Next middleware
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Token manquant' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const db = getDb()
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      res.status(401).json({ error: 'Utilisateur introuvable' })
      return
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}

/**
 * Optionnel : attache l’utilisateur à req.user si un token valide est présent.
 * Ne renvoie pas 401 si absent.
 * @param {object} req - Requête Express
 * @param {object} res - Réponse Express
 * @param {Function} next - Next middleware
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    next()
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const db = getDb()
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    if (user) req.user = user
  } catch (_) {
    // ignore invalid token
  }
  next()
}

export { JWT_SECRET }
