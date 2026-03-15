# Contributing to OctoMetrics

Thanks for contributing. This repository contains two related apps:

- The root project is the Node.js/Express API that serves GitHub analytics endpoints from `src/`.
- The `ui/` project is a Vite/React builder interface that targets the backend API and can also be served from `ui/dist`.

Please use this guide to keep changes aligned with the current build and release flow.

## Project Layout

```text
.
├── src/                  # Backend API, services, engines, SVG renderers
├── tests/                # Backend tests
├── ui/                   # React/Vite UI builder
├── .github/workflows/    # CI and deployment workflows
├── .env.example          # Backend environment template
└── CONTRIBUTING.md
```

## Prerequisites

- Node.js 20 is recommended because GitHub Actions uses Node 20.
- npm
- A GitHub token for contribution-related widgets and any API features that require authenticated GitHub requests

## Local Setup

### 1. Clone and install the backend

```bash
git clone <your-fork-url>
cd all-in-one-github-readme-stats
npm install
```

### 2. Create the backend environment file

```bash
cp .env.example .env
```

At minimum, configure:

```env
GITHUB_TOKEN=your_github_token_here
PORT=3000
CACHE_TTL=21600
```

Optional backend settings such as `HOST`, `LOG_LEVEL`, `API_RATE_LIMIT`, and cache controls are read from `src/config/config.js`.

### 3. Install the UI dependencies

```bash
cd ui
npm install
cd ..
```

## Running the Project

### Backend development server

From the repository root:

```bash
npm run dev
```

This starts the Express server from `src/server.js`, typically at `http://localhost:3000`.

### UI development server

From `ui/`:

```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`, so the backend should be running at the same time during UI work.

### Production-style UI build

From `ui/`:

```bash
npm run build
```

This writes the frontend output to `ui/dist`. The backend serves that directory as static assets in production.

## Validation Before Opening a PR

Run the checks that match the area you changed.

### Backend

From the repository root:

```bash
npm run lint
npx prettier --check .
npm test -- --runInBand
```

Notes:

- `npm run lint` currently targets `src/` only.
- CI runs `npm test`, but running Jest in-band is a practical local fallback when worker spawning is restricted.
- The current Jest configuration only matches `**/tests/**/*.test.mjs`, so only tests following that pattern are executed unless the config is expanded.

### Frontend

From `ui/`:

```bash
npm run build
```

The UI package does not currently define dedicated lint or test scripts, so a successful production build is the main automated check available there.

## Branch and Commit Workflow

1. Fork the repository and create a branch from `main`.
2. Use a focused branch name such as `feat/add-dashboard-widget` or `fix/cache-header-bug`.
3. Keep commits scoped to a single concern whenever possible.
4. Rebase or merge `main` as needed before opening the pull request.

## Pull Request Expectations

A good pull request should include:

- A short summary of the problem and the change
- Screenshots or SVG output samples for UI or visual widget changes
- Any environment variables, routes, or API contract changes
- Validation notes describing exactly what you ran locally

Example validation block:

```text
Validated:
- npm run lint
- npx prettier --check .
- npm test -- --runInBand
- cd ui && npm run build
```

## Contribution Areas

### Backend changes

Follow the existing architecture:

```text
router -> controllers -> services -> engines -> svg/themes/utils
```

Keep responsibilities separated:

- Route registration belongs in `src/api/router.js`
- Request handling belongs in controllers/middleware
- GitHub API integration belongs in `src/services/`
- Data shaping belongs in `src/engines/`
- SVG output belongs in `src/svg/`

### Frontend changes

The UI is a separate React/Vite app under `ui/`. When changing the builder:

- Keep API request assumptions aligned with the backend routes
- Preserve drag-and-drop and builder state behavior unless the PR is explicitly redesigning them
- Verify the production build after changing components, store logic, or Vite config

## CI and Deployment Notes

The repository currently has two workflows:

- `.github/workflows/ci.yml` installs root dependencies, runs ESLint, checks Prettier formatting, runs tests, and generates coverage
- `.github/workflows/vercel-deploy.yml` installs backend dependencies, installs UI dependencies, builds the UI, and deploys through Vercel

If your change affects build, runtime, or deployment behavior, update the relevant workflow files in the same pull request.

## Style Guidelines

- Follow the existing ESLint and Prettier configuration
- Prefer small, isolated changes over broad refactors
- Avoid introducing unrelated formatting churn
- Update documentation when routes, parameters, or contributor workflow change

## Reporting Issues

When reporting a bug or proposing a feature, include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Relevant endpoint examples or screenshots
- Node.js version and whether the issue is in the backend, UI, or both

## Questions

If something in the current setup is unclear, open an issue or draft PR with the missing context. Repository documentation is still evolving, so clarifying build or contribution workflow is itself a useful contribution.
