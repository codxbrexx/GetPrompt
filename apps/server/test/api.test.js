import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server.js'

describe('GET /api/prompts', () => {
  it('returns 200 and JSON array', async () => {
    const res = await request(app).get('/api/prompts')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filters by search query', async () => {
    const res = await request(app).get('/api/prompts?search=test')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filters by tags', async () => {
    const res = await request(app).get('/api/prompts?tags=react,typescript')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filters by search and tags combined', async () => {
    const res = await request(app).get('/api/prompts?search=test&tags=react')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
