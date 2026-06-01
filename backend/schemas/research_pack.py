from pydantic import BaseModel, Field

from schemas.primitives import MODEL_CONFIG
from schemas.raw_data import (
    AnalystRecommendation,
    FinancialYearData,
    Issue,
    News,
)


class CompanySnapshot(BaseModel):
    model_config = MODEL_CONFIG

    symbol: str | None = None
    short_name: str | None = None
    recommendation_key: str | None = None
    recommendation_mean: float | None = None
    number_of_analyst_opinions: int | None = None
    current_price: float | None = None
    fifty_two_week_low: float | None = None
    fifty_two_week_high: float | None = None
    trailing_pe: float | None = None
    forward_pe: float | None = None
    profit_margins: float | None = None
    revenue_growth: float | None = None
    earnings_growth: float | None = None
    target_mean_price: float | None = None
    target_high_price: float | None = None
    target_low_price: float | None = None
    beta: float | None = None
    sector: str | None = None
    industry: str | None = None
    market_cap: int | None = None


class PriceMovement(BaseModel):
    model_config = MODEL_CONFIG

    current_price: float | None = None
    price_30d_ago: float | None = None
    price_90d_ago: float | None = None
    change_30d_pct: float | None = None
    change_90d_pct: float | None = None
    year_high: float | None = None
    year_low: float | None = None


FinancialSnapshot = dict[str, FinancialYearData]


class ResearchPack(BaseModel):
    model_config = MODEL_CONFIG

    company_summary: str
    company_snapshot: CompanySnapshot
    financial_snapshot: FinancialSnapshot
    price_movement: PriceMovement
    recent_news: list[News]
    analyst_recommendations: list[AnalystRecommendation]
    data_confidence: int = Field(ge=0, le=100)
    flags: list[Issue]
