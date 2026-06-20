# 📊 YouTube Analyzer — Channel Growth & Virality Intelligence Platform

![LIVE PLATFORM](https://img.shields.io/badge/LIVE_PLATFORM-UP-brightgreen) ![Data Analytics](https://img.shields.io/badge/Data_Analytics-Insights-orange?logo=googleanalytics&logoColor=white) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white) ![YouTube API](https://img.shields.io/badge/YouTube_Data_API-v3-FF0000?logo=youtube&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-blue)

A professional, full-stack analytics dashboard deployed at **[youtube-analyzer-yt-analyzer.vercel.app](https://youtube-analyzer-yt-analyzer.vercel.app/)** that pulls **live data directly from the YouTube Data API v3** to reverse-engineer what actually drives a channel's growth. Search any channel and instantly get server-computed insights: average views and engagement rate, a 7×24 best-upload-time heatmap, video duration sweet-spot analysis, top 10 performing videos, and AI-style growth suggestions. It also supports side-by-side comparison of up to 5 channels with radar and bar charts, making it a practical research tool for creators, strategists, and marketers studying virality and posting strategy.


<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/35d3388d-6390-4edd-bc88-94e6802f5795" />

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Deployment](#deployment)
- [Pages & Routes](#pages--routes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

YouTube Analyzer is a full-stack web application that lets you search any YouTube channel, analyze its performance data, and extract actionable growth insights. It fetches live data directly from YouTube's official Data API v3, computes analytics server-side, and renders them in a polished React dashboard with charts, heatmaps, and AI-powered suggestions.

**Who is it for?**
- 🎬 **Content creators** who want to understand what's working on their own or competitors' channels
- 📊 **Strategists & marketers** researching YouTube niches and benchmarking performance
- 🔬 **Researchers** studying video virality, engagement patterns, and posting strategy

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | Deployed on Vercel |
| **Backend API** | `https://youtube-analyzer-cud8.onrender.com` |

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **Channel Search** | Search YouTube channels by name, `@handle`, or keyword with debounced live results |
| 📈 **Deep Analytics** | Per-channel dashboard: views over time, engagement scatter, posting heatmaps, duration buckets |
| ⏰ **Best Upload Times** | 7 × 24 heatmap showing average views per day/hour combination |
| 🎯 **Duration Sweet Spot** | Bucketed analysis (< 1 min → > 60 min) to find the length bracket the algorithm rewards |
| ⚡ **Growth Suggestions** | Rule-based recommendations derived from real channel data (optimal length, post timing, engagement alerts) |
| 🔥 **Top 10 Videos** | Highest-performing videos ranked by views with thumbnails, duration, and engagement rate |
| ⚖️ **Channel Comparison** | Side-by-side radar chart + bar chart for up to 5 channels at once |
| 📚 **Research Section** | Curated blog-style articles on content strategy |
| 🌐 **Full Information Pages** | About, FAQ, Contact, Privacy, Terms, Disclaimer |

---

## Project Architecture

This is a **pnpm monorepo** split into two layers:

```
┌──────────────────────────────────────┐
│           Frontend (React SPA)        │
│     artifacts/yt-analyzer             │
│  Vite + React + TailwindCSS v4        │
│  Deployed → Vercel                    │
└──────────────┬───────────────────────┘
               │  REST / JSON
               ▼
┌──────────────────────────────────────┐
│           Backend (REST API)          │
│     artifacts/api-server              │
│  Express 5 + TypeScript + Pino logs   │
│  Deployed → Render                    │
└──────────────┬───────────────────────┘
               │  HTTPS
               ▼
┌──────────────────────────────────────┐
│      YouTube Data API v3              │
│  (Google Cloud, requires API key)     │
└──────────────────────────────────────┘
```

### Shared Libraries (`lib/`)

| Package | Purpose |
|---------|---------|
| `@workspace/api-spec` | OpenAPI 3.1 YAML spec (`openapi.yaml`) and Orval code-gen config |
| `@workspace/api-zod` | Zod validation schemas auto-generated from the OpenAPI spec |
| `@workspace/api-client-react` | Type-safe React Query hooks auto-generated from the OpenAPI spec via Orval |
| `@workspace/db` | Drizzle ORM schema and config (reserved for future persistence layer) |

---

## Tech Stack

### Frontend — `artifacts/yt-analyzer`

| Technology | Version | Role |
|------------|---------|------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 6 | Build tool & dev server |
| TailwindCSS | v4 | Utility-first styling |
| Radix UI | various | Headless accessible components |
| Recharts | 2.15 | Charts (AreaChart, BarChart, ScatterChart, RadarChart) |
| TanStack React Query | 5 | Server-state management & caching |
| Wouter | 3 | Client-side routing |
| Framer Motion | catalog | Animations |
| Zod | catalog | Runtime validation |
| Lucide React | catalog | Icon set |
| Sonner | 2 | Toast notifications |
| `@workspace/api-client-react` | workspace | Generated typed API hooks |

### Backend — `artifacts/api-server`

| Technology | Version | Role |
|------------|---------|------|
| Node.js | ≥ 20 (ESM) | Runtime |
| TypeScript | 5.9 | Type safety |
| Express | 5 | HTTP server framework |
| Pino + pino-http | 9 / 10 | Structured JSON logging |
| cors | 2.8 | Cross-origin request handling |
| Drizzle ORM | catalog | Database ORM (optional persistence) |
| esbuild | 0.27 | Fast TypeScript bundler |
| `@workspace/api-zod` | workspace | Request/response validation schemas |

### Monorepo Tooling

| Tool | Purpose |
|------|---------|
| pnpm workspaces | Package manager with workspace linking |
| pnpm catalog | Shared version pinning across packages |
| Orval | OpenAPI → TypeScript client + Zod codegen |
| Prettier | Code formatting |

---

## Repository Structure

```
Youtube-analyzer/
├── package.json                    # Workspace root (typecheck + build scripts)
├── pnpm-workspace.yaml             # pnpm workspace config, shared catalog versions
├── tsconfig.base.json              # Shared TS config inherited by all packages
├── tsconfig.json                   # Root-level project references
│
├── lib/                            # Shared library packages
│   ├── api-spec/
│   │   ├── openapi.yaml            # OpenAPI 3.1 contract (source of truth)
│   │   └── orval.config.ts         # Orval codegen config for client + zod
│   ├── api-zod/                    # Zod schemas (auto-generated)
│   ├── api-client-react/           # React Query hooks (auto-generated)
│   └── db/
│       ├── drizzle.config.ts       # Drizzle ORM config
│       └── src/                    # DB schema definitions
│
└── artifacts/                      # Deployable applications
    ├── api-server/
    │   ├── src/
    │   │   ├── index.ts            # Entry point — starts Express server
    │   │   ├── app.ts              # Express app setup (CORS, logging, routing)
    │   │   ├── routes/
    │   │   │   ├── index.ts        # Mounts all routers under /api
    │   │   │   ├── channels.ts     # Channel search, detail, videos, analytics, compare
    │   │   │   └── health.ts       # GET /api/healthz
    │   │   └── lib/
    │   │       ├── youtube.ts      # All YouTube Data API v3 calls + analytics computation
    │   │       └── logger.ts       # Pino logger instance
    │   ├── build.mjs               # esbuild config for bundling to dist/
    │   └── package.json
    │
    └── yt-analyzer/
        ├── src/
        │   ├── main.tsx            # React entry point
        │   ├── App.tsx             # Router setup (Wouter) + QueryClient provider
        │   ├── index.css           # Global CSS + Tailwind theme
        │   ├── pages/
        │   │   ├── home.tsx        # Search + feature landing page
        │   │   ├── channel.tsx     # Full analytics dashboard for a channel
        │   │   ├── compare.tsx     # Multi-channel comparison page
        │   │   ├── research.tsx    # Research article listing
        │   │   ├── research-post.tsx # Individual research article
        │   │   ├── about.tsx       # About the product
        │   │   ├── about-author.tsx # Author bio page
        │   │   ├── faq.tsx         # Frequently asked questions
        │   │   ├── contact.tsx     # Contact page
        │   │   ├── privacy.tsx     # Privacy policy
        │   │   ├── terms.tsx       # Terms of service
        │   │   ├── disclaimer.tsx  # Disclaimer
        │   │   └── not-found.tsx   # 404 page
        │   ├── components/
        │   │   ├── layout.tsx      # App shell (nav + footer wrapper)
        │   │   ├── footer.tsx      # Site footer with links
        │   │   ├── suggestions.tsx # AI growth suggestion cards
        │   │   ├── graph-notes.tsx # Contextual chart explanation callouts
        │   │   ├── scroll-to-top.tsx # Scroll restoration on route change
        │   │   └── ui/             # Radix-based shadcn/ui component library
        │   ├── hooks/
        │   │   └── use-debounce.ts # Debounce hook for search inputs
        │   ├── data/               # Static data (e.g. research article content)
        │   └── lib/                # Utility functions
        ├── public/                 # Static assets served as-is
        ├── .env                    # Local environment variables (gitignored)
        ├── vite.config.ts          # Vite build + proxy config
        ├── components.json         # shadcn/ui component config
        └── vercel.json             # Vercel SPA rewrite rules
```

---

## API Reference

Base URL: `/api`

All responses are `application/json`. Errors follow `{ "error": "message" }`.

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/healthz` | Health check — returns `{ "status": "ok" }` |

### Channels

| Method | Path | Query Params | Description |
|--------|------|-------------|-------------|
| `GET` | `/api/channels/search` | `q` (required), `maxResults` (default 10, max 50) | Search YouTube channels by keyword or `@handle` |
| `GET` | `/api/channels/:channelId` | — | Get full details and statistics for a channel |

### Videos

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/videos/:channelId` | Fetch up to 50 latest videos with engagement stats |

### Analytics

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/analytics/:channelId` | Aggregated analytics: avg views, engagement rate, heatmap, duration buckets, top 10, views over time |
| `POST` | `/api/compare` | Compare 2–10 channels — body: `{ "channelIds": ["id1", "id2", ...] }` |

---

## Data Models

### `ChannelSummary`
```ts
{
  id: string
  title: string
  description: string
  thumbnailUrl: string
  subscriberCount: number
  videoCount: number
  viewCount: number
  handle: string | null        // YouTube @handle
}
```

### `ChannelDetail` (extends ChannelSummary)
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/f91444ac-e4bf-4d29-85f0-e15174b83c4a" />

```ts
{
  bannerUrl: string | null
  publishedAt: string          // ISO 8601
  country: string | null
}
```

### `VideoStats`
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/b6a0e6ed-1c31-4f3b-8ab5-887e43a17096" />

```ts
{
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  durationSeconds: number
  durationFormatted: string    // "m:ss" or "h:mm:ss"
  engagementRate: number       // ((likes + comments) / views) * 100
  hourOfDay: number            // 0–23 UTC
  dayOfWeek: number            // 0 (Sun) – 6 (Sat)
  dayOfWeekName: string
  tags: string[]
  categoryId: string | null
}
```

### `ChannelAnalytics`
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/5c3c843b-d6f2-4a73-9866-bdebc8137020" />

```ts
{
  channelId: string
  totalVideos: number
  avgViews: number
  avgLikes: number
  avgComments: number
  avgEngagementRate: number
  avgDurationSeconds: number
  medianViews: number
  topVideos: TopVideo[]          // Top 10 by view count
  heatmapData: HourlyHeatmapCell[] // 168 cells (7 days × 24 hours)
  durationBuckets: DurationBucket[] // Grouped by length bracket
  viewsOverTime: ViewsDataPoint[]   // Monthly aggregated views
  bestHour: number               // UTC hour with highest avg views
  bestDay: string                // Day name with highest avg views
  engagementVsViews: EngagementPoint[] // Scatter data: engagement rate vs view count
}
```

### `ChannelComparison`
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/69c49f58-550c-4724-8bba-3a16f20310d0" />

```ts
{
  channelId: string
  title: string
  thumbnailUrl: string
  subscriberCount: number
  avgViews: number
  avgEngagementRate: number
  avgDurationSeconds: number
  videoCount: number
  totalViews: number
}
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- A **YouTube Data API v3** key — get one at [console.cloud.google.com](https://console.cloud.google.com/)

### Install dependencies

```bash
pnpm install
```

### Set environment variables

Create `artifacts/api-server/.env`:
```env
PORT=4000
YOUTUBE_API_KEY=your_youtube_api_v3_key_here
```

Create `artifacts/yt-analyzer/.env`:
```env
# Leave empty to use relative /api paths (proxied through Vite)
VITE_API_BASE_URL=
```

### Run in development (full stack)

Open two terminals:

```bash
# Terminal 1 — API server
cd artifacts/api-server
pnpm dev
# Server starts on http://localhost:4000
```

```bash
# Terminal 2 — Frontend
cd artifacts/yt-analyzer
pnpm dev
# Frontend starts on http://localhost:5173 (proxies /api/* to :4000)
```

### Build everything

```bash
# From monorepo root
pnpm build
```

---

## Environment Variables

### `artifacts/api-server`

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Port the Express server listens on |
| `YOUTUBE_API_KEY` | ✅ | Google Cloud YouTube Data API v3 key |

### `artifacts/yt-analyzer`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | ❌ | Full URL of the API server (e.g. `https://youtube-analyzer-cud8.onrender.com`). Leave blank in local dev to use Vite's proxy. |
| `BASE_PATH` | ❌ | Base URL path if hosted in a subdirectory (default `/`) |
| `PORT` | ❌ | Vite dev server port (default `5173`) |

---

## Development Scripts

### Monorepo root

| Script | Description |
|--------|-------------|
| `pnpm build` | Typecheck all packages then build all artifacts |
| `pnpm typecheck` | Typecheck libs + all artifacts |
| `pnpm typecheck:libs` | Typecheck shared libraries only |

### `artifacts/api-server`

| Script | Description |
|--------|-------------|
| `pnpm dev` | Build then start server (with source maps) |
| `pnpm build` | Bundle TypeScript → `dist/index.mjs` via esbuild |
| `pnpm start` | Start the built server |
| `pnpm typecheck` | Type-check without emitting |

### `artifacts/yt-analyzer`

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Build production bundle to `dist/public/` |
| `pnpm serve` | Preview production build locally |
| `pnpm typecheck` | Type-check without emitting |

---

## Deployment

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set the **root directory** to `artifacts/api-server`
4. Set the **build command** to `pnpm install && pnpm build`
5. Set the **start command** to `pnpm start`
6. Add environment variables: `PORT=10000`, `YOUTUBE_API_KEY=...`

### Frontend — Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Set the **root directory** to `artifacts/yt-analyzer`
3. Set the **build command** to `pnpm build`
4. Set the **output directory** to `dist/public`
5. Add environment variable: `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`
6. The `vercel.json` at the root of `yt-analyzer` handles SPA fallback rewrites automatically

---

## Pages & Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Search bar, feature highlights, how-it-works steps |
| `/channel/:channelId` | Channel Dashboard | Full analytics for a channel — stats, charts, heatmap, top videos, growth suggestions |
| `/compare` | Compare | Search & select up to 5 channels for side-by-side radar + bar comparison |
| `/research` | Research | Content strategy article listing |
| `/research/:slug` | Research Post | Individual research article |
| `/about` | About | Product overview |
| `/about-author` | About Author | Author biography |
| `/faq` | FAQ | Frequently asked questions |
| `/contact` | Contact | Contact information |
| `/privacy` | Privacy Policy | Data privacy details |
| `/terms` | Terms of Service | Terms and conditions |
| `/disclaimer` | Disclaimer | Data accuracy disclaimer |

---

## How Analytics Are Computed

All computations happen **server-side** in `artifacts/api-server/src/lib/youtube.ts` using live data fetched from the YouTube API. No database is required for the core flow.

| Metric | Computation |
|--------|-------------|
| **Engagement Rate** | `((likeCount + commentCount) / viewCount) × 100` |
| **Heatmap** | Average views grouped by `(dayOfWeek, hourOfDay)` UTC pairs across all videos |
| **Duration Buckets** | 7 brackets (< 1 min → > 60 min) — avg views & engagement per bracket |
| **Views Over Time** | Videos grouped by publish month, averaged views per month |
| **Median Views** | True median of all video view counts |
| **Best Upload Time** | Heatmap cell with highest `avgViews` |
| **Top Videos** | Top 10 videos sorted by `viewCount` descending |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

**Code style:** Prettier is configured at the root. Run `pnpm prettier --write .` before committing.

---

## License

MIT — see [LICENSE](LICENSE) for details.
