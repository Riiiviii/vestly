from pydantic import BaseModel, Field

from schemas.primitives import MODEL_CONFIG


class ValuationSignals(BaseModel):
    model_config = MODEL_CONFIG

    trailing_pe: float | None = None
    forward_pe: float | None = None
    profit_margins: float | None = None
    earnings_growth: float | None = None
    revenue_growth: float | None = None
    market_cap: float | None = None


class AnalystConsensus(BaseModel):
    model_config = MODEL_CONFIG

    recommendation: str | None = None
    mean_score: float | None = None
    num_analyst: int | None = None
    price_target_mean: float | None = None
    price_target_high: float | None = None
    price_target_low: float | None = None


class FundamentalsOutput(BaseModel):
    model_config = MODEL_CONFIG

    revenue_trends: str = Field(min_length=1)
    profitability: str = Field(min_length=1)
    valuation_signals: ValuationSignals
    analyst_consensus: AnalystConsensus
    summary: str = Field(min_length=1)
    strength: int = Field(ge=0, le=100)
