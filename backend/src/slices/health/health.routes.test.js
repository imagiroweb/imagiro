import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import healthRoutes from './health.routes.js'

describe('slices/health', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use('/api', healthRoutes)
  })

  it('GET /api/health renvoie 200 et status ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', service: 'imagiro-backend' })
  })
})
