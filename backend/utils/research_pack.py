from datetime import datetime, timedelta

from schemas.raw_data import (
    CompanyInformation,
    ValidatedData,
    Financials,
    News,
    PriceHistory,
)
from schemas.research_pack import (
    CompanySnapshot,
    FinancialSnapshot,
    PriceMovement,
    ResearchPack,
)


def build_research_pack(data: ValidatedData) -> ResearchPack:
    """
    Transforms validated MCP data into a structured research pack
    consumed by all downstream panel agents.
    """
    company_summary = get_company_summary(data.clean_data.company_information)
    company_snapshot = get_company_snapshot(data.clean_data.company_information)
    financial_snapshot = get_financial_snapshot(data.clean_data.financials)
    price_movement = get_price_movement(data.clean_data.price_history)
    recent_news = get_recent_news(data.clean_data.news)

    return ResearchPack(
        company_summary=company_summary,
        company_snapshot=company_snapshot,
        financial_snapshot=financial_snapshot,
        price_movement=price_movement,
        recent_news=recent_news,
        analyst_recommendations=data.clean_data.analyst_recommendations,
        data_confidence=data.confidence_score.score,
        flags=data.issues,
    )


def get_company_summary(company_info: CompanyInformation) -> str:
    """Returns the long business summary string from company information."""
    return company_info.long_business_summary or ""


def get_company_snapshot(company_info: CompanyInformation) -> CompanySnapshot:
    """Extracts key valuation and market metrics from company information."""
    keys = [
        "symbol",
        "short_name",
        "recommendation_key",
        "recommendation_mean",
        "number_of_analyst_opinions",
        "current_price",
        "fifty_two_week_low",
        "fifty_two_week_high",
        "trailing_pe",
        "forward_pe",
        "profit_margins",
        "revenue_growth",
        "earnings_growth",
        "target_mean_price",
        "target_high_price",
        "target_low_price",
        "beta",
        "sector",
        "industry",
        "market_cap",
    ]
    return CompanySnapshot(**{k: getattr(company_info, k, None) for k in keys})


def get_financial_snapshot(company_financials: Financials) -> FinancialSnapshot:
    """
    Extracts key income statement metrics per fiscal year, sorted newest first.
    Years with no usable data are excluded.
    """
    snapshot: FinancialSnapshot = {}
    sorted_years = sorted(company_financials.items(), reverse=True)

    for date, year_data in sorted_years:
        # year_data is a FinancialYearData model; check if any field has a value
        if any(v is not None for v in year_data.model_dump().values()):
            snapshot[date] = year_data

    return snapshot


def get_price_movement(company_price_movement: PriceHistory) -> PriceMovement:
    """
    Derives price movement signals from raw price history.
    Uses Close prices only. Percentage changes are relative to the past price.
    """
    close_prices = company_price_movement.get("Close", {})
    valid_close_prices = {k: v for k, v in close_prices.items() if v is not None}
    if not valid_close_prices:
        return PriceMovement()

    parsed_dates = {k: datetime.fromisoformat(k) for k in valid_close_prices}
    latest_key = max(parsed_dates, key=parsed_dates.__getitem__)
    latest_date = parsed_dates[latest_key]
    current_price = valid_close_prices[latest_key]

    def _nearest_prior_price(target_date) -> float | None:
        candidates = [k for k, d in parsed_dates.items() if d <= target_date]
        if not candidates:
            return None
        best_key = max(candidates, key=parsed_dates.__getitem__)
        return valid_close_prices[best_key]

    price_30d_ago = _nearest_prior_price(latest_date - timedelta(days=30))
    price_90d_ago = _nearest_prior_price(latest_date - timedelta(days=90))

    def _pct_change(current: float, previous: float | None) -> float | None:
        if previous in (None, 0):
            return None
        return ((current - previous) / previous) * 100

    change_30d_pct = _pct_change(current_price, price_30d_ago)
    change_90d_pct = _pct_change(current_price, price_90d_ago)

    cutoff_365d = latest_date - timedelta(days=365)
    year_prices = [
        v for k, v in valid_close_prices.items() if parsed_dates[k] >= cutoff_365d
    ]
    year_high = max(year_prices) if year_prices else None
    year_low = min(year_prices) if year_prices else None

    return PriceMovement(
        current_price=current_price,
        price_30d_ago=price_30d_ago,
        price_90d_ago=price_90d_ago,
        change_30d_pct=change_30d_pct,
        change_90d_pct=change_90d_pct,
        year_high=year_high,
        year_low=year_low,
    )


def get_recent_news(company_news: list[News]) -> list[News]:
    """Returns the 15 most recent news articles sorted by datetime descending."""
    sorted_news = sorted(
        company_news, key=lambda article: article.datetime, reverse=True
    )
    return sorted_news[:15]
