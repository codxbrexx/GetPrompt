import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../server.js'

const prisma = new PrismaClient()

/**
 * Vote API endpoint tests
 * Tests upvoting, downvoting, and validation
 */
describe('PATCH /api/prompts/:id/vote', () => {
  let testPrompt

  beforeAll(async () => {
    // Create a test prompt for voting tests
    testPrompt = await prisma.prompt.create({
      data: {
        title: 'Vote Test Prompt',
        description: 'A test prompt for vote endpoint testing',
        content: 'Test prompt content for voting functionality',
        tags: JSON.stringify(['test']),
        votes: 0
      }
    })
  })

  afterAll(async () => {
    // Cleanup: delete test prompt
    if (testPrompt) {
      await prisma.prompt.delete({ where: { id: testPrompt.id } })
    }
    await prisma.$disconnect()
  })

  it('should increment votes by 1', async () => {
    const res = await request(app)
      .patch(`/api/prompts/${testPrompt.id}/vote`)
      .send({ delta: 1 })

    expect(res.status).toBe(200)
    expect(res.body.votes).toBe(1)
  })

  it('should decrement votes by 1', async () => {
    const res = await request(app)
      .patch(`/api/prompts/${testPrompt.id}/vote`)
      .send({ delta: -1 })

    expect(res.status).toBe(200)
    expect(res.body.votes).toBe(0)
  })

  it('should return 400 for invalid delta value', async () => {
    const res = await request(app)
      .patch(`/api/prompts/${testPrompt.id}/vote`)
      .send({ delta: 5 })

    expect(res.status).toBe(400)
  })
})
