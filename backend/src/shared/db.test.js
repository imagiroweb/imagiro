import { describe, it, expect } from 'vitest'
import { getDb } from './db.js'

describe('shared/db', () => {
  it('getDb retourne une valeur (undefined si non connecté)', () => {
    const db = getDb()
    expect(db === undefined || typeof db === 'object').toBe(true)
  })
})
