import request from 'supertest'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import app from '../server.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let created

beforeAll(async () => {
  // create a prompt to vote on
  created = await prisma.prompt.create({
    data: {
      title: 'vote test',
      description: 'for voting',
      content: 'Test prompt content for voting',
      tags: ['test'],
      votes: 0,
    },
  })
})

afterAll(async () => {
  if (created) {
    await prisma.prompt.delete({ where: { id: created.id } })
  }
  await prisma.$disconnect()
})

describe('PATCH /api/prompts/:id/vote', () => {
  it('increments votes by 1', async () => {
    const res = await request(app)
      .patch(`/api/prompts/${created.id}/vote`)
      .send({ delta: 1 })

    expect(res.status).toBe(200)
    expect(res.body.votes).toBe(1)
  })

  it('decrements votes by 1', async () => {
    const res = await request(app)
      .patch(`/api/prompts/${created.id}/vote`)
      .send({ delta: -1 })

    expect(res.status).toBe(200)
    expect(res.body.votes).toBe(0)
  })

  it('returns 400 for invalid delta', async () => {
    const res = await request(app).patch(`/api/prompts/${created.id}/vote`).send({ delta: 5 })
    expect(res.status).toBe(400)
  })
})
