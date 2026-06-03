# Stock Analysis Agent

An AI-powered stock analysis tool that automates the research and evaluation process for retail investors. Instead of spending hours reading financial reports and news, users get a structured, multi-perspective analysis of any publicly traded company in seconds.

The system never says "buy" or "sell" — it produces structured reasoning that helps users make informed decisions themselves.

---

## How It Works

A single API call triggers a multi-stage pipeline:

1. **Data Fetching** — Two MCP servers pull real-time data from yfinance (financials, price history, company info, analyst recommendations, insider transactions) and Finnhub (recent news)
2. **Data Integrity** — A deterministic validation layer scores data quality and flags gaps before any analysis begins. No LLM involved — rules are auditable and consistent
3. **Research Pack** — Validated data is packaged into a single structured object passed to all downstream agents
4. **Panel Agents** — Four specialised agents analyse the data in parallel from distinct lenses: fundamentals, sentiment, risk/macro, and competitive positioning. Each agent can call MCP tools at reasoning time to fetch additional data
5. **Judge Agent** — Synthesises all four perspectives into a final structured thesis with a directional recommendation, agent-level evidence breakdown, and explicit risks and strengths

---

## Architecture

```
GET /analyze?ticker=AAPL
            │
            ▼
    MCP Servers (yfinance + Finnhub)
    ├── get_company_information
    ├── get_company_financials
    ├── get_price_history
    ├── get_analyst_recommendations
    ├── get_insider_transactions
    └── get_company_news
            │
            ▼
    Data Integrity Layer
    (deterministic confidence scoring, issue detection)
            │
            ▼
    Research Pack
    (single structured object, stable contract)
                  │
    ┌─────────────┼─────────┬─────────────┐
    ▼             ▼         ▼             ▼
Fundamentals  Sentiment  Risk/Macro  Competitive
   Agent       Agent      Agent       Agent
   (MCP)                             (MCP)
            │
    (parallel execution via asyncio)
            │
            ▼
      Judge Agent
      (final thesis, temperature=0)
            │
            ▼
    Structured JSON Response
```

The Competitive Agent (MCP) fetches peer tickers via Finnhub and runs the full data pipeline on each selected peer at reasoning time, enabling genuine cross-ticker comparison.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python) |
| AI Orchestration | OpenAI Agents SDK |
| Tool Protocol | MCP (Model Context Protocol) |
| Data Sources | yfinance, Finnhub |
| Database | Neon (Postgres) + SQLAlchemy |
| Auth | TBD (Supabase or Clerk) |
| Frontend | Vite + React |
| Deployment | TBD (Railway/Render + Vercel) |

---

## Current Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | MCP servers + FastAPI foundation | ✅ Complete |
| 2 | Data integrity layer + confidence scoring | ✅ Complete |
| 3 | Research Pack | ✅ Complete |
| 4 | Panel agents | ✅ Complete |
| 5 | Judge agent | ✅ Complete |
| 6 | Orchestration | ✅ Complete |
| 7 | Auth + persistence | ⏳ Pending |
| 8 | Frontend | ⏳ Pending |
| 9 | Deployment | ⏳ Pending |
| 10 | Evaluation layer | ⏳ Pending |

---

## Running Locally

```bash
# Install dependencies
cd backend
uv sync

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY, FINNHUB_API_KEY

# Start yfinance MCP server
uv run mcp-servers/yfinance-mcp.py

# Start Finnhub MCP server
uv run mcp-servers/finnhub-mcp.py

# Start FastAPI backend (run from backend/)
uv run fastapi dev main.py
```

---

## Known Limitations

- **Sentiment scoring** — Finnhub's sentiment endpoint requires a paid plan. Sentiment is instead derived from raw news article analysis by the Sentiment Agent directly, which is less precise than dedicated NLP scoring.
- **Competitive analysis** — The Competitive Agent fetches real peer data via Finnhub and runs the full analysis pipeline on each peer. Peer lists from Finnhub can include delisted or OTC tickers; the agent filters these but precision degrades for niche or thinly-traded companies.
- **Data quality variance** — yfinance data quality degrades for small/mid-cap, recently listed, and international stocks. The confidence scoring system flags these gaps explicitly rather than silently producing low-quality output.
- **Non-determinism** — LLM outputs are non-deterministic by nature. The Judge Agent runs at `temperature=0` to improve consistency, but some variance between runs is expected and documented in the evaluation layer.
