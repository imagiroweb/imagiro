/**
 * Tests d’intégration — API complète (même stack que la prod : Express, CORS, routes).
 */
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import healthRoutes from '../slices/health/health.routes.js'
import apiRoutes from '../slices/api/api.routes.js'

/** Construit une app identique à la prod (sans DB) pour les tests d’intégration. */
function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api', healthRoutes)
  app.use('/api', apiRoutes)
  return app
}

describe('Intégration API', () => {
  let app

  beforeAll(() => {
    app = createApp()
  })

  describe('routes existantes', () => {
    it('GET /api/health retourne 200 et JSON avec status ok', async () => {
      const res = await request(app).get('/api/health')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toMatch(/application\/json/)
      expect(res.body).toEqual({ status: 'ok', service: 'imagiro-backend' })
    })

    it('GET /api retourne 200 avec message, version et endpoints', async () => {
      const res = await request(app).get('/api')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('API Imagiro')
      expect(res.body.version).toBe('0.0.1')
      expect(Array.isArray(res.body.endpoints)).toBe(true)
      expect(res.body.endpoints).toContain('/api/health')
    })
  })

  describe('route inexistante', () => {
    it('GET /api/inexistant retourne 404', async () => {
      const res = await request(app).get('/api/inexistant')
      expect(res.status).toBe(404)
    })

    it('GET /autre retourne 404', async () => {
      const res = await request(app).get('/autre')
      expect(res.status).toBe(404)
    })
  })

  describe('CORS et format', () => {
    it('réponse JSON avec Content-Type application/json', async () => {
      const res = await request(app).get('/api/health')
      expect(res.headers['content-type']).toMatch(/application\/json/)
    })

    it('OPTIONS /api/health accepté (CORS)', async () => {
      const res = await request(app).options('/api/health')
      expect([200, 204]).toContain(res.status)
    })
  })

  describe('flux', () => {
    it('appel à /api puis /api/health dans la même session', async () => {
      const apiRes = await request(app).get('/api')
      expect(apiRes.status).toBe(200)
      expect(apiRes.body.endpoints).toContain('/api/health')

      const healthRes = await request(app).get('/api/health')
      expect(healthRes.status).toBe(200)
      expect(healthRes.body.status).toBe('ok')
    })
  })
})
