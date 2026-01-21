import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
let redis
let redisAvailable = false
try {
  redis = new Redis(process.env.REDIS_URL)
  redis.on('ready', () => {
    redisAvailable = true
    console.log('Redis ready')
  })
  redis.on('end', () => {
    redisAvailable = false
    console.warn('Redis connection closed')
  })
  redis.on('error', (err) => {
    redisAvailable = false
    console.warn('Redis error:', err.message)
  })
} catch (err) {
  redisAvailable = false
  console.warn('Failed to initialize Redis client:', err.message)
}

let inMemoryCache = null
let inMemoryCacheAt = 0
const IN_MEMORY_TTL = 60 * 1000

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', redis: redisAvailable })
})

app.get("/api/prompts", async (req, res) => {
  const { search, tags } = req.query;
  const tagList = tags ? String(tags).split(',').filter(Boolean) : [];
  const hasFilters = search || tagList.length > 0;

  try {
    // Only use cache when no filters are applied
    if (!hasFilters) {
      if (redisAvailable) {
        try {
          const cache = await redis.get("prompts");
          if (cache) return res.json(JSON.parse(cache));
        } catch (err) {
          redisAvailable = false
          console.warn('Redis get failed, falling back to DB:', err.message)
        }
      }

      // If redis not available, return in-memory cache when fresh
      if (!redisAvailable && inMemoryCache && (Date.now() - inMemoryCacheAt) < IN_MEMORY_TTL) {
        return res.json(inMemoryCache)
      }
    }

    // Build where clause for search filtering
    let whereClause = {};
    if (search) {
      const searchTerm = String(search).toLowerCase();
      whereClause.OR = [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } }
      ];
    }

    const prompts = await prisma.prompt.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' }
    });

    // Parse tags from JSON string (SQLite compatibility)
    let formattedPrompts = prompts.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
    }));

    // Filter by tags in-memory (SQLite stores tags as JSON string)
    if (tagList.length > 0) {
      formattedPrompts = formattedPrompts.filter(p => 
        tagList.some(t => p.tags.includes(t))
      );
    }

    // Also filter by search term in tags (since Prisma can't search JSON array)
    if (search) {
      const searchTerm = String(search).toLowerCase();
      formattedPrompts = formattedPrompts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Update caches only when no filters
    if (!hasFilters) {
      if (redisAvailable) {
        try {
          await redis.set("prompts", JSON.stringify(formattedPrompts), "EX", 60);
        } catch (err) {
          redisAvailable = false
          console.warn('Redis set failed:', err.message)
        }
      } else {
        inMemoryCache = formattedPrompts
        inMemoryCacheAt = Date.now()
      }
    }

    res.json(formattedPrompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/prompts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id }
    })
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' })
    }
    const formattedPrompt = {
      ...prompt,
      tags: typeof prompt.tags === 'string' ? JSON.parse(prompt.tags) : prompt.tags
    }
    res.json(formattedPrompt)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/prompts', async (req, res) => {
  const { title, description, content, category, tags, author } = req.body

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' })
  }
  if (!description?.trim()) {
    return res.status(400).json({ error: 'Description is required' })
  }
  if (!content?.trim()) {
    return res.status(400).json({ error: 'Content is required' })
  }
  if (!Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: 'At least one tag is required' })
  }

  try {
    const prompt = await prisma.prompt.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category: category || 'text',
        tags: JSON.stringify(tags), // Store as JSON string for SQLite
        author: author?.trim() || 'Anonymous'
      }
    })

    const formattedPrompt = {
      ...prompt,
      tags: JSON.parse(prompt.tags)
    }

    if (redisAvailable) {
      try {
        await redis.del('prompts')
      } catch (e) {
        console.warn('Failed to clear Redis cache after create:', e.message)
      }
    }
    inMemoryCache = null

    res.status(201).json(formattedPrompt)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.patch('/api/prompts/:id/vote', async (req, res) => {
  const { id } = req.params
  const { delta } = req.body
  if (typeof delta !== 'number' || ![1, -1].includes(delta)) {
    return res.status(400).json({ error: 'delta must be 1 or -1' })
  }

  try {
    const updated = await prisma.prompt.update({
      where: { id },
      data: { votes: { increment: delta } },
    })

    const formattedPrompt = {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags
    }

    if (redisAvailable) {
      try {
        await redis.del('prompts')
      } catch (e) {
        console.warn('Failed to clear Redis cache after vote:', e.message)
      }
    }
    inMemoryCache = null

    res.json(formattedPrompt)
  } catch (err) {
    if (err.code === 'P2025' || err.message?.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Prompt not found' })
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default app;

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(` Backend running on port ${port}`));
}
