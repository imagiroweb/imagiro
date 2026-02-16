/**
 * Slice API — description et liste des endpoints (Vertical Slice Architecture).
 * @module slices/api/api.routes
 */

import { Router } from 'express'

const router = Router()

/**
 * GET /api — Description courte de l’API et liste des endpoints.
 * @param {object} _ - Requête Express (non utilisée)
 * @param {object} res - Réponse Express (JSON)
 */
router.get('/', (_, res) => {
  res.json({
    message: 'API Imagiro',
    version: '0.0.1',
    endpoints: [
        '/api/health',
        '/api/auth/signup',
        '/api/auth/login',
        '/api/auth/me',
        '/api/auth/google',
        '/api/auth/google/callback',
        '/api/auth/2fa/setup',
        '/api/auth/2fa/enable',
        '/api/auth/2fa/disable',
        '/api/auth/2fa/verify',
      ],
  })
})

export default router
