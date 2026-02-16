import { describe, it, expect } from 'vitest'
import { getApp, useRouter } from './app.js'

describe('shared/app', () => {
  it('getApp retourne un objet avec use et listen', () => {
    const app = getApp()
    expect(app).toBeDefined()
    expect(typeof app.use).toBe('function')
    expect(typeof app.listen).toBe('function')
  })

  it('useRouter est une fonction', () => {
    expect(typeof useRouter).toBe('function')
  })
})
