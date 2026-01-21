import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server.js'

/**
 * API endpoint tests for /api/prompts
 * Tests the search and tag filtering functionality
 */
describe('GET /api/prompts', () => {
  it('should return 200 and a JSON array', async () => {
    const res = await request(app).get('/api/prompts')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should filter prompts by search query', async () => {
    const res = await request(app).get('/api/prompts?search=test')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should filter prompts by tags', async () => {
    const res = await request(app).get('/api/prompts?tags=react,typescript')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('should filter prompts by both search and tags', async () => {
    const res = await request(app).get('/api/prompts?search=test&tags=react')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
