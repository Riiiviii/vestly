from typing import Literal
from pydantic import BaseModel, Field
from schemas.primitives import MODEL_CONFIG
from schemas.fundamentals_agent import FundamentalsOutput
from schemas.sentiment_agent import SentimentOutput
from schemas.risk_agent import RiskOutput
from schemas.competition_agent import CompetitionOutput


class AgentEvidence(BaseModel):
    model_config = MODEL_CONFIG

    agent: Literal["fundamentals", "sentiment", "risk", "competition"]
    summary: str
    impact: Literal["positive", "negative", "neutral", "mixed"]


class PanelOutputs(BaseModel):
    model_config = MODEL_CONFIG

    ticker: str = Field(min_length=1, max_length=10)
    fundamentals_output: FundamentalsOutput
    sentiment_output: SentimentOutput
    risk_output: RiskOutput
    competition_output: CompetitionOutput


class JudgeOutput(BaseModel):
    model_config = MODEL_CONFIG

    thesis: str = Field(min_length=1)
    risks: list[str] = Field(min_length=1)
    strengths: list[str] = Field(min_length=1)
    agent_evidence: list[AgentEvidence] = Field(min_length=4, max_length=4)
    score: int = Field(le=100, ge=0)
    summary: str = Field(min_length=1)
    recommendation: Literal[
        "highly recommended",
        "recommended",
        "neutral",
        "caution advised",
        "not recommended",
    ]
