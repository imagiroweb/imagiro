import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import apiRoutes from './api.routes.js'

describe('slices/api', () => {
  let app

  beforeAll(() => {
    app = express()
    app.use('/api', apiRoutes)
  })

  it('GET /api renvoie 200 avec message et endpoints', async () => {
    const res = await request(app).get('/api')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'API Imagiro')
    expect(res.body).toHaveProperty('version', '0.0.1')
    expect(res.body.endpoints).toContain('/api/health')
  })
})
