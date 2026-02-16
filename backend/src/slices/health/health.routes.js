/**
 * Slice Health — health check du backend (Vertical Slice Architecture).
 * @module slices/health/health.routes
 */

import { Router } from 'express'

const router = Router()

/**
 * GET /api/health — Health check (monitoring / load balancer).
 */
router.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'imagiro-backend' })
})

export default router
