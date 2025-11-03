# GetPrompt 

A modern prompt marketplace for AI tools built with React, Vite, Express, Prisma, and Tailwind CSS.

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies
- Setup SQLite database (or PostgreSQL if Docker is available)
- Run migrations and optionally seed sample data
- Guide you through starting both services

### Manual Setup

#### Option 1: With Docker (PostgreSQL + Redis)

```bash
# Start Postgres + Redis
docker-compose up -d

# Backend setup
cd apps/server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed  # Optional: add sample data
npm run dev   # Starts on port 4000

# Frontend setup (new terminal)
cd apps/web
npm install
npm run dev   # Starts on port 8080
```

#### Option 2: Without Docker (SQLite - Development)

```bash
# Backend setup
cd apps/server
npm install
npx prisma migrate dev --name init
npm run seed  # Optional: add sample data
npm run dev   # Starts on port 4000

# Frontend setup (new terminal)
cd apps/web
npm install
npm run dev   # Starts on port 8080
```

**Servers:**
- Frontend: http://localhost:8080
- Backend: http://localhost:4000

## 📁 Project Structure

```
prompt-hub/
├── apps/
│   ├── server/              # Express backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Database schema
│   │   │   ├── schema.postgres.prisma # PostgreSQL variant
│   │   │   └── schema.sqlite.prisma   # SQLite variant
│   │   ├── scripts/
│   │   │   └── seed.js                # Database seeding
│   │   ├── server.js                  # API server
│   │   ├── package.json
│   │   └── SETUP.md                   # Backend docs
│   └── web/                 # Vite + React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/      # 50+ shadcn/ui primitives
│       │   │   ├── PromptCard.tsx
│       │   │   ├── PromptList.tsx
│       │   │   ├── Navbar.tsx
│       │   │   └── Footer.tsx
│       │   ├── pages/
│       │   │   ├── Index.tsx
│       │   │   ├── PromptDetail.tsx
│       │   │   ├── Submit.tsx
│       │   │   └── NotFound.tsx
│       │   ├── lib/         # Utilities & mock data
│       │   ├── types/       # TypeScript definitions
│       │   └── hooks/       # Custom React hooks
│       ├── package.json
│       └── vite.config.ts
├── docker-compose.yml       # PostgreSQL & Redis
├── setup.sh                 # Automated setup
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 5 (build tool)
- React Router v6 (routing)
- TanStack Query (data fetching)
- Tailwind CSS + shadcn/ui (styling)
- Framer Motion (animations)
- Lucide React (icons)

### Backend
- Express.js (API server)
- Prisma ORM (database)
- SQLite (dev) / PostgreSQL (prod)
- Redis (optional caching)
- Vitest + Supertest (testing)

## ✨ Recent Improvements

### Backend
✅ Enhanced Prisma schema with `content`, `category`, `author` fields  
✅ New API endpoints: GET, POST prompts + voting  
✅ SQLite support for development (no Docker required)  
✅ Redis caching with in-memory fallback  
✅ Proper error handling and validation  
✅ JSON tag serialization for SQLite compatibility  

### Frontend
✅ Complete shadcn/ui component library (50+ components)  
✅ Full TypeScript coverage  
✅ Responsive design with Tailwind  
✅ Client-side routing with 404 page  
✅ Dark mode ready with CSS custom properties  
✅ Form validation with React Hook Form + Zod  
✅ Optimistic UI updates for voting  

## 📝 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/prompts` | List all prompts (cached 60s) |
| GET | `/api/prompts/:id` | Get single prompt |
| POST | `/api/prompts` | Create new prompt |
| PATCH | `/api/prompts/:id/vote` | Vote on prompt (±1) |

### Example: Create Prompt

```bash
curl -X POST http://localhost:4000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Amazing Prompt",
    "description": "Description here",
    "content": "Full prompt content",
    "category": "text",
    "tags": ["coding", "ai"],
    "author": "Your Name"
  }'
```

### Example: Vote on Prompt

```bash
curl -X PATCH http://localhost:4000/api/prompts/clx123/vote \
  -H "Content-Type: application/json" \
  -d '{"delta": 1}'
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset everything
docker-compose down -v
```

## 🧪 Testing

```bash
# Backend smoke test
cd apps/server
node test/check_api.js

# Run backend tests
npm test

# Run unit tests
npm run test:unit
```

## 📦 Production Build

```bash
# Build frontend
cd apps/web
npm run build
npm run preview

# Run backend in production
cd apps/server
NODE_ENV=production node server.js
```

## 🔐 Environment Variables

### Backend (apps/server/.env)
```env
# Example PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/getprompt"  # PostgreSQL
DATABASE_URL="file:./dev.db"  # SQLite (current)
# DATABASE_URL="postgresql://user:password@localhost:5432/prompthub"  # PostgreSQL
REDIS_URL="redis://localhost:6379"           # Optional
PORT=4000
```

### Frontend
```env
VITE_API_URL=http://localhost:4000           # API base URL
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:4000 | xargs kill -9   # Kill backend
lsof -ti:8080 | xargs kill -9   # Kill frontend
```

### Database Issues
```bash
cd apps/server
npx prisma migrate reset    # Reset DB
npx prisma migrate dev      # Re-run migrations
npm run seed                # Re-seed data
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Documentation

- Backend setup: `apps/server/SETUP.md`
- Prisma schema: `apps/server/prisma/schema.prisma`
- Contributing: `CONTRIBUTING.md`
- Code of Conduct: `CODE_OF_CONDUCT.md`

## 🤝 Contributing

We welcome contributors! Please read `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for guidelines. Look for issues labeled `good first issue` or `help wanted`.

## 📄 License

MIT License — see `LICENSE` file for details.

---

**Note:** This project uses SQLite by default for easy development. Switch to PostgreSQL for production by updating the Prisma schema and environment variables.
