# Stock Analysis Agent — Build Roadmap

## Phase 1 — Foundations + MCP Setup

### Goal

Get real data flowing end-to-end via MCP tools with zero agents.

### Tasks

**1. Set up backend**

- FastAPI project
- Basic route: `GET /analyze?ticker=AAPL`

**2. Build MCP servers (do this before touching agents)**

Wrap both data sources as MCP servers. This is the right time — retrofitting later is painful.

- `yfinance-mcp` — exposes tools: `get_company_information`, `get_company_financials`, `get_price_history`, `get_analyst_recommendations`, `get_insider_transactions`
- `finnhub-mcp` — exposes tools: `get_company_news`

**3. Verify raw data through MCP tools**

```json
{
  "company_info": {...},
  "financials": {...},
  "price_data": {...},
  "news": [...]
}
```

**4. Sanity check**

- Try 3–5 tickers
- Confirm news returns results and timestamps are recent
- Confirm financials aren't empty for large-cap stocks
- Note any tickers that behave badly — you'll need edge case handling later

### Exit Criteria

- `GET /analyze?ticker=AAPL` returns usable raw data
- Data is flowing through MCP tools, not direct API calls
- You can articulate why each MCP tool exists

> If this isn't solid, everything else collapses.

### Status: ✅ Complete

---

## Phase 2 — Data Integrity Layer

### Goal

Turn messy data into trusted structured input using deterministic rules — no LLM.

### Tasks

**1. Define schema**

```json
{
  "clean_data": {...},
  "confidence_score": {
    "score": 0-100,
    "deductions": {
      "missing_financials": 0,
      "news_count_below_3": 0,
      "news_older_than_14_days": 0,
      "price_history_under_90_days": 0,
      "missing_company_fields": 0
    }
  },
  "issues": []
}
```

**2. Implement deterministic scoring**

Confidence score is rule-based, not LLM-generated. Start at 100 and deduct:

```json
{
  "missing_financials": -20,
  "news_count_below_3": -10,
  "news_older_than_14_days": -8,
  "price_history_under_90_days": -15,
  "missing_company_fields": -15
}
```

Every deduction rule is defined upfront and auditable. The score never blocks the pipeline — it flows through as a signal that the Judge Agent uses to calibrate confidence in its output.

**3. Write tests**

All deduction rules must have passing unit tests before moving on.

> Don't rely on LLM judgment for data validation. Rules are faster, cheaper, and auditable.

### Exit Criteria

- Clean structured data
- Confidence score with clear deduction breakdown
- Issues list that catches real problems
- 14 passing unit tests

### Status: ✅ Complete

---

## Phase 3 — Research Pack

### Goal

Create a stable contract between pipeline stages.

### Task

Transform validated data into a single object passed to all downstream agents:

```json
{
  "company_summary": "...",
  "company_snapshot": {...},
  "financial_snapshot": {...},
  "price_movement": {...},
  "recent_news": [...],
  "analyst_recommendations": [...],
  "data_confidence": 0-100,
  "flags": []
}
```

> This is not optional. Without it your agents become inconsistent and hard to debug.

### Exit Criteria

- Single clean object that every downstream agent receives
- No agent fetches its own data after this point (with one deliberate exception — see Competitive agent below)

### Status: ✅ Complete

---

## Phase 4 — Panel Agents

### Goal

Parallel, specialised reasoning from four distinct lenses.

Build ONE agent at a time. Do not parallelize development.

Three of the four agents are pure transformations: they consume the research pack and produce structured output. The Competitive agent is the deliberate exception — it uses MCP tools to fetch data on competitor tickers dynamically, because cross-ticker comparison genuinely cannot be done from the primary ticker's research pack alone.

### 4.1 Fundamentals Agent ✅

- Revenue trends
- Profitability
- Valuation signals (P/E, margins)
- Analyst consensus

**Data source:** `financial_snapshot`, `company_snapshot`, `analyst_recommendations` from research pack.

**Status:** Complete. Output validated via Pydantic, evidence-grounded prompt.

### 4.2 Sentiment Agent ✅

- News tone and volume
- Short-term narrative (what's the market talking about)
- Any major recent events

**Data source:** `recent_news` from research pack.

**Status:** Complete. Output validated via Pydantic.

### 4.3 Risk Agent ✅

- Downside scenarios (what could go wrong, grounded in specific data)
- Concentration and dependency risks
- Balance sheet fragility under stress
- Thesis breakers — falsifiable conditions that invalidate a bullish view

**Data source:** `financial_snapshot`, `company_snapshot`, `recent_news`, `flags`, `price_movement` from research pack.

> Originally scoped as Risk/Macro. Macro reasoning was dropped because yfinance and Finnhub free tier provide no macro data, and reasoning about macro from LLM priors would launder unsupported claims as data-driven analysis. Scope now strictly company-specific risk.

**Status:** Complete. Output validated via Pydantic.

### 4.4 Competitive Agent ✅

The only agent with dynamic MCP tool access. The justification: meaningful competitive analysis requires data on competitors themselves — their financials, their valuation, their recent news — not just mentions of them in the primary ticker's news. The research pack cannot pre-fetch this because competitors are only knowable after the LLM examines the company summary.

**Workflow:**

1. Call `get_peers(ticker)` via MCP to retrieve a Finnhub peer list for the target ticker
2. Review all returned tickers and select up to 3 best candidates based on sector alignment, market cap proximity, and business model overlap
3. Call `get_research_pack(peer_ticker)` for each selected peer — this runs the full data pipeline (fetch → validate → research pack) on the peer
4. Produce comparative analysis grounded in the fetched research packs

**Data source:** primary ticker's research pack + dynamic MCP calls (`get_peers`, `get_research_pack`) for competitor data.

**Constraints:**

- **Fixed selection of ≤3 peers before any `get_research_pack` calls.** Selection is not expanded after failures.
- **Graceful failure on missing peers.** Errors recorded in `data_limitations`; agent produces output with whatever valid peers it has.
- **`data_limitations` field in output schema** — lists failed peer fetches and data gaps so the Judge can see what comparison was made.

**Output focus:**

- Selected peer set with selection rationale
- Per-peer competitive factors labelled positive (target stronger) or negative (peer stronger)
- Per-peer relative position score (−100 to +100)
- Overall competitive summary and strength score (analytical confidence, not competitive dominance)

> This is the agent that justifies the MCP architecture in this project. It's also the agent with the most failure modes — peer lists include delisted tickers, MCP calls fail, comparison data is incomplete. The prompt enforces fixed pre-selection to prevent the agent from iterating indefinitely through the peer list.

**Status:** Complete. End-to-end tested.

### Critical Rule

Each agent must:

- Have a distinct interpretive lens that doesn't overlap with others (same data, different question is fine)
- Produce structured output validated by Pydantic
- Cite evidence from its data sources for every non-trivial claim

If two agents sound the same → your prompts are wrong. Tighten the schemas and the scope boundaries.

### Exit Criteria

For one ticker, you get 4 clearly different perspectives with non-overlapping insights and evidence-grounded claims. The Competitive agent's `competitors_analyzed` field is non-empty for at least one large-cap ticker.

### Status: ✅ Complete

---

## Phase 5 — Judge Agent

### Goal

Synthesise multiple perspectives into one coherent, structured thesis.

**Output schema (implemented):**

```json
{
  "thesis": "...",
  "time_horizon": "short-term | medium-term | long-term",
  "strengths": ["..."],
  "risks": ["..."],
  "conflicting_signals": [
    { "description": "...", "agents": ["fundamentals", "risk"] }
  ],
  "data_gaps": ["..."],
  "agent_evidence": [
    { "agent": "fundamentals | sentiment | risk | competition", "summary": "...", "impact": "positive | negative | neutral | mixed" }
  ],
  "summary": "...",
  "recommendation": "highly recommended | recommended | neutral | caution advised | not recommended"
}
```

**Key design decisions:**

- `agent_evidence` has exactly 4 entries (enforced by Pydantic `model_validator`) — one per panel agent, making the Judge's reasoning fully transparent
- `conflicting_signals` explicitly surfaces where agents disagree, with the conflicting agent names attached
- `data_gaps` aggregates data quality issues from all panel outputs in one place
- `time_horizon` grounds the thesis in a concrete investment timeframe
- `recommendation` replaces a numeric score — the system never says buy or sell
- `strengths` and `risks` are uncapped — the Judge surfaces every well-supported signal
- Runs at `temperature=0` for consistency
- Input is a `PanelOutputs` wrapper (ticker + 4 agent outputs) — the Judge never sees the raw ResearchPack

### Exit Criteria

- Output is structured, readable, and non-generic
- Conflicting signals are explicitly called out
- You can explain every field to an interviewer

### Status: ✅ Complete

---

## Phase 6 — Orchestration

### Goal

Wire everything together into a reliable, observable pipeline.

### Flow

```
fetch (yfinance + Finnhub) → validate (data integrity layer) → research pack → panel agents (parallel) → judge
```

**Implementation:**

- Panel agents run in parallel via `asyncio.TaskGroup` (structured concurrency — cleaner failure propagation than `asyncio.gather`)
- Per-stage timeouts: panel agents 60s, competition agent 120s, judge 60s
- `_named()` helper wraps all agent exceptions with agent name and ticker for clear error attribution
- `except* RuntimeError` catches the first panel failure and re-raises immediately
- `main.py` catches all `RuntimeError` from the pipeline and returns HTTP 500 with logging

### Exit Criteria

- One API call runs the full pipeline reliably
- Individual stage failures are caught and logged, not silently swallowed
- Competitive agent failures are handled gracefully without taking down the run

### Status: ✅ Complete

---

## Phase 7 — Auth + Persistence

### Goal

Make the tool usable across sessions with per-user history.

### Auth

Use **Clerk** or **Supabase Auth**. Do not build auth from scratch — it doesn't demonstrate AI engineering skills and will take a week you don't have. Drop it in and move on.

### Database

**Neon (Postgres)** with **SQLAlchemy** + **asyncpg**.

### Store

- User ID (from auth)
- Ticker
- Timestamp
- Final judge output (JSON)
- Optionally: intermediate panel outputs for debugging

### Exit Criteria

- Users can log in
- Past analyses are tied to their account
- History is retrievable via a `/history` endpoint

### Status: ⏳ Pending

---

## Phase 8 — Minimal Frontend

### Goal

View results. Nothing more.

### Features

- Ticker input
- Trigger analysis
- Display: summary, risks, tailwinds, confidence score, conflicting signals, competitors analyzed
- Analysis history per user

> No design obsession. Have AI generate the UI. Your time is in the backend.

### Exit Criteria

- A non-technical person could use this without explanation
- History is visible and navigable

### Status: ⏳ Pending

---

## Phase 9 — Deployment

### Goal

Get a public URL. A project that only runs locally is significantly weaker as a portfolio piece.

### Tasks

- Deploy FastAPI backend to **Railway** or **Render**
- Deploy frontend to **Vercel**
- Connect Neon — your connection string works as-is in both platforms
- Set environment variables
- Smoke test the full pipeline on the deployed version

### Exit Criteria

- Public URL that anyone can visit
- Full pipeline runs end-to-end on the deployed version
- URL goes in your README and portfolio

### Status: ⏳ Pending

---

## Phase 10 — Evaluation Layer ⭐ High Value

### Goal

Prove your system produces meaningfully better output than a naive approach.

### Tasks

**1. Define a baseline**

Single prompt to a plain LLM:

> "Analyse [TICKER] as an investment. What are the key risks and opportunities?"

**2. Run structured comparison**

Pick 5 tickers. For each, run both your system and the baseline. Score both on this rubric:

| Dimension                   | Score 0-3                                           | Notes |
| --------------------------- | --------------------------------------------------- | ----- |
| Specificity                 | Does it reference actual figures, not generalities? |       |
| Risk awareness              | Does it surface non-obvious risks?                  |       |
| Consistency                 | Would it give the same answer twice?                |       |
| Uncertainty acknowledgement | Does it flag what it doesn't know?                  |       |
| Structure                   | Is the output actionable and readable?              |       |

**3. Add a consistency test**

Run your system twice on the same ticker. Compare `thesis_strength` scores, `key_risks` lists, and `final_summary`. Document any meaningful divergence — this signals you understand LLM non-determinism.

**4. Evaluate the Competitive agent specifically**

For 3 tickers, manually verify:

- The competitors the agent identified are reasonable
- The comparative claims it made are supported by the fetched data
- The output meaningfully differs from what the agent could produce without MCP calls

**5. Document results honestly in the README**

### Exit Criteria

- You can say with evidence: "My system produces more structured and risk-aware outputs than a single-prompt baseline"
- The Competitive agent's MCP usage produces measurably better output than a research-pack-only version
- Results are documented in the README

### Status: ⏳ Pending

---

## Phase 11 — Polish

- Tighten prompts based on real outputs you've seen
- Improve schemas where agents are still producing vague outputs
- Edge case handling: tickers with no news, very small companies, delisted stocks, tickers with no obvious competitors
- README: architecture diagram, tech stack, eval results, public URL

### Status: ⏳ Pending

---

## Biggest Risks

**1. Agent outputs become generic**
Fix: tighten schemas, force each agent to reference specific figures from the research pack via evidence-grounding fields enforced by Pydantic.

**2. Competitive agent picks wrong competitors or hallucinates comparisons**
Fix: hard cap on competitor count, graceful failure on missing data, `competitors_analyzed` field in the output so failures are visible. Evaluate output quality against a research-pack-only baseline in Phase 10.

**3. You stall on frontend**
Fix: have AI generate the entire UI. Your value is in the backend.

**4. Auth becomes a rabbit hole**
Fix: Clerk or Supabase Auth only. One afternoon maximum.

**5. You skip deployment**
Fix: it's not optional. A private repo with no public URL is not a portfolio piece.

**6. You don't finish**
Fix: Phases 7–11 are where most portfolio projects die. The eval layer (Phase 10) is the single highest-value differentiator. Don't stall at Phase 6 because orchestration feels less satisfying than design.

---

## Final Check

If you finish this, you will have:

- A real deployed system with a public URL
- Multi-agent orchestration with a non-trivial panel + judge pattern
- Pydantic-validated agent outputs with evidence-grounding enforcement
- A research pack contract that cleanly separates data layer from reasoning layer
- A Competitive agent that uses MCP for genuine cross-ticker comparative analysis — load-bearing, not decorative
- Structured evaluation methodology you can defend, including a head-to-head Competitive agent eval
- Per-user persistence with auth

If you half-build it, it becomes another AI project with no depth.
