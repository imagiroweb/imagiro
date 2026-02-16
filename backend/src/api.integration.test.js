import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { getApp, useRouter } from './shared/app.js'
import healthRoutes from './slices/health/health.routes.js'
import apiRoutes from './slices/api/api.routes.js'

describe('API (intégration)', () => {
  let app

  beforeAll(() => {
    useRouter('/api', healthRoutes)
    useRouter('/api', apiRoutes)
    app = getApp()
  })

  it('GET /api/health répond 200', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('GET /api répond 200 avec liste d’endpoints', async () => {
    const res = await request(app).get('/api')
    expect(res.status).toBe(200)
    expect(res.body.endpoints).toContain('/api/health')
  })
})
