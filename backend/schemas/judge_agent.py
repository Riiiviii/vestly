from typing import Literal
from pydantic import BaseModel, Field, model_validator
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
    summary: str = Field(min_length=1)
    recommendation: Literal[
        "highly recommended",
        "recommended",
        "neutral",
        "caution advised",
        "not recommended",
    ]

    @model_validator(mode="after")
    def validate_agent_evidence_coverage(self) -> "JudgeOutput":
        expected = {"fundamentals", "sentiment", "risk", "competition"}
        actual = {item.agent for item in self.agent_evidence}
        if actual != expected:
            raise ValueError(
                "agent_evidence must include exactly one entry for each of: "
                "fundamentals, sentiment, risk, competition"
            )
        return self
