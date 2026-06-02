import asyncio
from typing import cast

# ── Utilities ────────────────────────────────────────
from utils.confidence_calculator import calculate_confidence_score
from utils.fetcher import run_analysis
from utils.research_pack import build_research_pack

# ── Agents ────────────────────────────────────────
from agent_modules.analysis_agent import AnalysisAgent
from agent_modules.competition_agent import CompetitionAgent
from agent_modules.judge_agent import JudgeAgent

# ── Schemas ────────────────────────────────────────
from schemas.raw_data import RawData, ValidatedData
from schemas.research_pack import ResearchPack
from schemas.fundamentals_agent import FundamentalsOutput
from schemas.sentiment_agent import SentimentOutput
from schemas.risk_agent import RiskOutput
from schemas.competition_agent import CompetitionOutput
from schemas.judge_agent import PanelOutputs, JudgeOutput

PANEL_TIMEOUT = 60
COMPETITION_TIMEOUT = 120


async def _prepare_research_pack(ticker: str) -> ResearchPack:
    raw: RawData = await run_analysis(ticker)
    validated: ValidatedData = calculate_confidence_score(raw)
    return build_research_pack(validated)


async def _run_panel_agents(research_pack: ResearchPack, ticker: str) -> PanelOutputs:
    results = await asyncio.gather(
        asyncio.wait_for(
            AnalysisAgent("fundamentals", "fundamentals_agent.txt", FundamentalsOutput).run(research_pack),
            timeout=PANEL_TIMEOUT,
        ),
        asyncio.wait_for(
            AnalysisAgent("sentiment", "sentiment_agent.txt", SentimentOutput).run(research_pack),
            timeout=PANEL_TIMEOUT,
        ),
        asyncio.wait_for(
            AnalysisAgent("risk", "risk_agent.txt", RiskOutput).run(research_pack),
            timeout=PANEL_TIMEOUT,
        ),
        asyncio.wait_for(
            CompetitionAgent().run(research_pack),
            timeout=COMPETITION_TIMEOUT,
        ),
        return_exceptions=True,
    )

    names = ["fundamentals", "sentiment", "risk", "competition"]
    for name, outcome in zip(names, results):
        if isinstance(outcome, Exception):
            raise RuntimeError(f"{name} agent failed for {ticker}: {outcome}") from outcome

    return PanelOutputs(
        ticker=ticker,
        fundamentals_output=cast(FundamentalsOutput, results[0]),
        sentiment_output=cast(SentimentOutput, results[1]),
        risk_output=cast(RiskOutput, results[2]),
        competition_output=cast(CompetitionOutput, results[3]),
    )


async def analyze_ticker(ticker: str) -> JudgeOutput:
    research_pack = await _prepare_research_pack(ticker)
    panel = await _run_panel_agents(research_pack, ticker)
    return await JudgeAgent().run(panel)