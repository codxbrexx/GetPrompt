# Contributing to GetPrompt

Thank you for your interest in contributing to GetPrompt! We welcome contributions of all sizes — from fixing a typo to implementing new features.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Setup Development Environment

1. **Fork the repository**
   Click the 'Fork' button on GitHub and create a branch for your change.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/prompt-hub.git
   cd prompt-hub
   ```

3. **Install dependencies**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   # This script installs dependencies for both server and web apps
   ```

4. **Start development servers**
   ```bash
   ./start.sh
   ```

5. **Access the application**
   - Frontend: <http://localhost:8080>
   - Backend: <http://localhost:4000>

## 📝 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/voting-not-working`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-search`)

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: resolve voting state update issue"
```

## 🏗️ Project Structure

```text
prompt-hub/
├── apps/
│   ├── server/          # Backend (Express + Prisma)
│   │   ├── prisma/      # Database schema & migrations
│   │   └── server.js    # Main server file
│   └── web/             # Frontend (React + TypeScript)
│       └── src/
│           ├── components/  # Reusable components
│           ├── hooks/       # Custom React hooks
│           ├── lib/         # Utilities & helpers
│           ├── pages/       # Page components
│           └── types/       # TypeScript types
```

## 🎨 Code Style Guidelines

- Use TypeScript for new files
- Use functional components with hooks
- Follow existing code patterns
- Use meaningful variable names
- Extract reusable logic into custom hooks
- Run ESLint and Prettier before committing

## 🐛 Bug Reports

When reporting bugs, please include:
1. **Description** - Clear description of the bug
2. **Steps to reproduce** - Detailed steps to reproduce the issue
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Screenshots** - If applicable
6. **Environment** - Browser, OS, Node version

## 💡 Feature Requests

When requesting features, please include:
1. **Use case** - Why is this feature needed?
2. **Description** - Detailed description of the feature
3. **Mockups** - Visual mockups if applicable
4. **Implementation ideas** - Any thoughts on implementation

## ✅ Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Tested changes locally
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Committed from a feature/fix branch (not main)
- [ ] PR description clearly describes changes

## 🧪 Testing

Run tests before submitting:

```bash
cd apps/web
npm run test        # Run tests in watch mode (interactive development)
npm run test:run    # Run tests once and exit (CI/pre-commit)
npm run test:ui     # Open Vitest UI for visual test debugging
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to GetPrompt! 🎉
