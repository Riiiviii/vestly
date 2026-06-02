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
JUDGE_TIMEOUT = 60


async def _prepare_research_pack(ticker: str) -> ResearchPack:
    raw: RawData = await run_analysis(ticker)
    validated: ValidatedData = calculate_confidence_score(raw)
    return build_research_pack(validated)


async def _named(coro, name: str, ticker: str):
    try:
        return await coro
    except Exception as e:
        raise RuntimeError(f"{name} agent failed for {ticker}: {e}") from e


async def _run_panel_agents(research_pack: ResearchPack, ticker: str) -> PanelOutputs:
    try:
        async with asyncio.TaskGroup() as tg:
            t_fundamentals = tg.create_task(
                _named(
                    asyncio.wait_for(
                        AnalysisAgent(
                            "fundamentals", "fundamentals_agent.txt", FundamentalsOutput
                        ).run(research_pack),
                        timeout=PANEL_TIMEOUT,
                    ),
                    "fundamentals",
                    ticker,
                )
            )
            t_sentiment = tg.create_task(
                _named(
                    asyncio.wait_for(
                        AnalysisAgent(
                            "sentiment", "sentiment_agent.txt", SentimentOutput
                        ).run(research_pack),
                        timeout=PANEL_TIMEOUT,
                    ),
                    "sentiment",
                    ticker,
                )
            )
            t_risk = tg.create_task(
                _named(
                    asyncio.wait_for(
                        AnalysisAgent("risk", "risk_agent.txt", RiskOutput).run(
                            research_pack
                        ),
                        timeout=PANEL_TIMEOUT,
                    ),
                    "risk",
                    ticker,
                )
            )
            t_competition = tg.create_task(
                _named(
                    asyncio.wait_for(
                        CompetitionAgent().run(research_pack),
                        timeout=COMPETITION_TIMEOUT,
                    ),
                    "competition",
                    ticker,
                )
            )

    except* RuntimeError as eg:
        raise eg.exceptions[0]

    return PanelOutputs(
        ticker=ticker,
        fundamentals_output=cast(FundamentalsOutput, t_fundamentals.result()),
        sentiment_output=cast(SentimentOutput, t_sentiment.result()),
        risk_output=cast(RiskOutput, t_risk.result()),
        competition_output=cast(CompetitionOutput, t_competition.result()),
    )


async def analyze_ticker(ticker: str) -> JudgeOutput:
    try:
        research_pack = await _prepare_research_pack(ticker)
    except Exception as e:
        raise RuntimeError(f"Data preparation failed for {ticker}: {e}") from e

    panel = await _run_panel_agents(research_pack, ticker)

    try:
        return await asyncio.wait_for(JudgeAgent().run(panel), timeout=JUDGE_TIMEOUT)
    except asyncio.TimeoutError as e:
        raise RuntimeError(f"Judge agent timed out for {ticker}") from e
    except Exception as e:
        raise RuntimeError(f"Judge agent failed for {ticker}: {e}") from e
