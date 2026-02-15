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
    endpoints: ['/api/health'],
  })
})

export default router
