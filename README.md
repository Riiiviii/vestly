# Vestly

[![Backend CI](https://github.com/Riiiviii/vestly/actions/workflows/ci.yml/badge.svg)](https://github.com/Riiiviii/vestly/actions/workflows/ci.yml)

**Live demo:** https://vestly-nine.vercel.app

AI-powered stock analysis for everyday investors. Vestly turns a ticker symbol into a structured investment research report by combining live market data, deterministic data-quality checks, specialist AI agents, and a final synthesis agent.

This is a full-stack portfolio project built to demonstrate practical AI engineering: typed data contracts, evidence-grounded prompts, multi-agent orchestration, failure-aware data ingestion, and a polished React interface. It is informational only and does not provide financial advice.

## What It Does

Enter a stock ticker and Vestly returns a report with:

- A plain-English investment thesis
- A recommendation label: `highly recommended`, `recommended`, `neutral`, `caution advised`, or `not recommended`
- A short, medium, or long-term time horizon
- Key strengths and risks
- Conflicting signals between agents
- Agent-by-agent evidence summaries
- Data gaps that may affect confidence

The frontend also includes a live backend status indicator, sample ticker shortcuts, loading state for long analysis runs, a scrolling quote tape, an about page, and a clear financial-advice disclaimer.

## Architecture

```text
React / TanStack Start frontend
        |
        | GET /analyze?ticker=AAPL
        v
FastAPI backend
        |
        v
Raw data ingestion
        |-- yfinance: company info, financials, price history, analyst recommendations
        |-- Finnhub: company news and quote data
        v
Deterministic confidence scoring
        |-- missing financials
        |-- insufficient or stale news
        |-- short price history
        |-- missing company fields
        v
ResearchPack
        |
        | asyncio.TaskGroup
        v
Specialist panel agents
        |-- Fundamentals agent
        |-- Sentiment agent
        |-- Risk agent
        |-- Competitive agent with MCP peer-research tools
        v
Judge agent
        |
        v
Typed JSON response rendered by the frontend
```

## Backend

The backend is a Python 3.12 FastAPI service in `backend/`.

Core endpoints:

| Endpoint                        | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `GET /`                         | Health check used by the frontend status indicator       |
| `GET /quotes?tickers=AAPL,MSFT` | Quote data for the bottom ticker tape                    |
| `GET /analyze?ticker=AAPL`      | Runs the full research and multi-agent analysis pipeline |

The analysis pipeline is implemented in `backend/pipeline.py`:

1. Fetch raw company data through `utils/fetcher.py`.
2. Score data quality with deterministic rules in `utils/confidence_calculator.py`.
3. Convert validated data into a stable `ResearchPack` in `utils/research_pack.py`.
4. Run fundamentals, sentiment, risk, and competitive agents in parallel.
5. Pass all panel outputs into the judge agent for the final response.

The backend uses Pydantic schemas throughout `backend/schemas/` to keep agent inputs and outputs explicit. The judge output enforces exactly one evidence entry for each panel agent.

## Agent Design

| Agent        | Role                                                           | Output Focus                                                        |
| ------------ | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| Fundamentals | Reads financial snapshots, valuation metrics, and analyst data | Revenue trends, profitability, valuation signals, analyst consensus |
| Sentiment    | Reads recent company news only                                 | News tone, dominant narrative, notable events                       |
| Risk         | Looks for downside scenarios and thesis breakers               | Company-specific risks, balance-sheet concerns, data red flags      |
| Competitive  | Uses MCP tools to research peer companies                      | Peer selection, relative position, data-backed comparison factors   |
| Judge        | Synthesizes all panel outputs                                  | Thesis, recommendation, conflicts, data gaps, final summary         |

Prompt files live in `backend/agent_modules/prompts/`. They intentionally restrict each agent to a narrow lens so the final report shows disagreements instead of blending every signal into generic prose.

The competitive agent is the load-bearing MCP use case. It starts `backend/mcp_servers/competition_mcp.py`, calls `get_peers(ticker)`, fetches research packs for up to three selected peers, and records failed or incomplete peer data in `data_limitations`.

Standalone yfinance and Finnhub MCP server wrappers are also present in `backend/mcp_servers/`, but the primary analysis pipeline currently fetches initial company data through the backend utility layer.

## Frontend

The frontend is a React 19 and TanStack Start app in `client/`.

Implemented routes:

| Route    | Purpose                                                                   |
| -------- | ------------------------------------------------------------------------- |
| `/`      | Ticker input, sample tickers, analysis loading state, and rendered report |
| `/about` | Explanation of the product, agent panel, and report structure             |

Frontend features:

- File-based routing with TanStack Router
- SSR deployment adapter for Vercel in `client/api/ssr.mjs`
- Tailwind CSS 4 design system with custom fonts and dark financial-dashboard styling
- Motion animations with reduced-motion handling
- Backend health indicator using `GET /`
- Quote tape powered by `GET /quotes`
- Typed analysis response contract in `client/src/util/analyse.ts`

## Tech Stack

| Layer             | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| Backend API       | FastAPI, Python 3.12                                   |
| Backend tooling   | uv, Ruff, pytest                                       |
| AI orchestration  | OpenAI Agents SDK                                      |
| Data validation   | Pydantic                                               |
| Market data       | yfinance, Finnhub                                      |
| Tool protocol     | MCP via `MCPServerStdio` for competitive peer research |
| Frontend          | React 19, TypeScript, TanStack Start, TanStack Router  |
| Styling           | Tailwind CSS 4, Motion, react-icons                    |
| Deployment config | Fly.io backend, Vercel frontend                        |
| CI                | GitHub Actions backend lint, format, and test workflow |

## Repository Structure

```text
.
|-- backend/
|   |-- main.py                         # FastAPI app and HTTP endpoints
|   |-- pipeline.py                     # End-to-end analysis orchestration
|   |-- agent_modules/                  # Agent wrappers and prompts
|   |-- mcp_servers/                    # MCP tools for data and peer research
|   |-- schemas/                        # Pydantic contracts
|   |-- utils/                          # Fetching, confidence scoring, research pack generation
|   |-- tests/                          # Unit tests for confidence scoring and research packs
|   |-- Dockerfile                      # Backend container image
|   `-- fly.toml                       # Fly.io app config
|-- client/
|   |-- src/routes/                     # TanStack routes
|   |-- src/components/                 # Landing, analysis, about, layout, and UI components
|   |-- src/util/                       # API, health, quote, motion, and analysis helpers
|   |-- api/ssr.mjs                     # Vercel SSR handler
|   |-- vite.config.ts
|   `-- vercel.json
|-- .github/workflows/ci.yml           # Backend CI
`-- stock-analysis-roadmap.md          # Original build roadmap and future phases
```

## Running Locally

### Backend

```bash
cd backend
uv sync
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_key
FINNHUB_API_KEY=your_finnhub_key
ALLOWED_ORIGINS=http://localhost:3000
```

Start the API:

```bash
uv run fastapi dev main.py
```

The backend runs on `http://localhost:8000` by default.

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local` if the backend is not running at the default URL:

```env
VITE_API_URL=http://localhost:8000
```

The frontend runs on `http://localhost:3000`.

## Quality Checks

Backend:

```bash
cd backend
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

Frontend:

```bash
cd client
npm run lint
npm run check
npm run build
```

The current automated test coverage focuses on deterministic backend logic: confidence scoring and research-pack generation. Agent behavior depends on live APIs and LLM calls, so it is not covered by the unit test suite.

GitHub Actions runs the backend quality checks automatically on pull requests to `main` and pushes to `main`. The `main` branch requires the CI check to pass before a pull request can be merged.

## Current Status

| Area                                  | Status                      |
| ------------------------------------- | --------------------------- |
| FastAPI backend                       | Implemented                 |
| Raw data ingestion                    | Implemented                 |
| Deterministic confidence scoring      | Implemented and unit tested |
| ResearchPack contract                 | Implemented and unit tested |
| Fundamentals, sentiment, risk agents  | Implemented                 |
| Competitive agent with MCP peer tools | Implemented                 |
| Judge synthesis agent                 | Implemented                 |
| React frontend                        | Implemented                 |
| Backend deployment on Fly.io          | Deployed                    |
| Frontend deployment on Vercel         | Deployed                    |
| Backend GitHub Actions CI             | Implemented and enforced    |
| Protected `main` branch               | Implemented                 |
| Formal evaluation layer               | Not implemented             |

## Known Limitations

- Analysis runtime can take 1-3 minutes because it performs live data fetching and multiple LLM calls.
- yfinance and Finnhub data quality varies by ticker, especially for small-cap, international, recently listed, or delisted companies.
- Finnhub peer lists can include weak or stale competitors, so the competitive agent caps peer research at three tickers and reports failures as data limitations.
- LLM outputs can vary between runs. The judge uses `temperature=0`, but full determinism is not guaranteed.
- The app currently has no authentication, saved history, or database persistence despite those being planned in the roadmap.
- The test suite verifies deterministic data-processing layers, not live API integrations or agent output quality.

## Why This Project Matters

Vestly is designed to be more than a wrapper around a single prompt. It demonstrates the kind of engineering a reviewer can evaluate directly from the repository:

- Multi-stage orchestration: one request moves through data fetching, validation, research-pack construction, parallel panel agents, MCP-backed peer research, and final judge synthesis.
- Typed contracts: Pydantic schemas define raw data, validated data, research packs, specialist outputs, and the final judge response so each stage has an explicit interface.
- Reliability boundaries: deterministic confidence scoring runs before any LLM call, making missing financials, stale news, thin price history, and incomplete company data visible instead of silently ignored.
- Specialist agent design: prompts are scoped by responsibility, outputs are structured, and the final report surfaces conflicting signals rather than smoothing them into generic advice.
- Tool use with purpose: MCP is used where it adds real capability, especially competitive analysis that fetches peer tickers and peer research packs at reasoning time.
- Full-stack integration: the React frontend consumes the live FastAPI API, handles loading and error states, displays backend health, and renders the typed analysis response clearly.
- CI and maintainability: GitHub Actions runs Ruff linting, Ruff formatting checks, and pytest on the backend, while the frontend includes linting, formatting checks, and production build scripts.
- Production deployment: the Dockerised FastAPI backend is deployed on Fly.io, and the TanStack Start frontend is deployed on Vercel with SSR support.

The result is a portfolio project focused on system design, orchestration, data quality, and production-minded polish rather than a single unstructured AI call.
