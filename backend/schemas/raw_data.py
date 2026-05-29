from pydantic import BaseModel, Field, ConfigDict

from schemas.primitives import MODEL_CONFIG


class News(BaseModel):
    model_config = MODEL_CONFIG

    category: str
    datetime: int
    headline: str
    id: int
    image: str
    related: str
    source: str
    summary: str
    url: str


class CompanyInformation(BaseModel):
    model_config = ConfigDict(extra="ignore")

    long_business_summary: str | None = None
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


class FinancialYearData(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    total_revenue: float | None = Field(None, alias="Total Revenue")
    gross_profit: float | None = Field(None, alias="Gross Profit")
    operating_income: float | None = Field(None, alias="Operating Income")
    net_income: float | None = Field(None, alias="Net Income")
    ebitda: float | None = Field(None, alias="EBITDA")
    diluted_eps: float | None = Field(None, alias="Diluted EPS")
    research_and_development: float | None = Field(
        None, alias="Research And Development"
    )
    operating_expense: float | None = Field(None, alias="Operating Expense")


class AnalystRecommendation(BaseModel):
    model_config = MODEL_CONFIG

    period: str
    strong_buy: int
    buy: int
    hold: int
    sell: int
    strong_sell: int


PriceHistory = dict[str, dict[str, float | None]]
Financials = dict[str, FinancialYearData]


class RawData(BaseModel):
    model_config = MODEL_CONFIG

    company_information: CompanyInformation
    news: list[News]
    financials: Financials
    price_history: PriceHistory
    analyst_recommendations: list[AnalystRecommendation]


class DeductionDetail(BaseModel):
    model_config = MODEL_CONFIG

    missing_financials: int
    news_count_below_3: int
    news_older_than_14_days: int
    price_history_under_90_days: int
    missing_company_fields: int


class ConfidenceScore(BaseModel):
    model_config = MODEL_CONFIG

    score: int
    deductions: DeductionDetail


class Issue(BaseModel):
    model_config = MODEL_CONFIG

    reason: str
    description: str


class ValidatedData(BaseModel):
    model_config = MODEL_CONFIG

    clean_data: RawData
    confidence_score: ConfidenceScore
    issues: list[Issue]
