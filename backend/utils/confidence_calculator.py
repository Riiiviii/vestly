from typing import Final
from datetime import datetime, timedelta, timezone
from schemas.mcp_data import (
    CompanyInformation,
    ConfidenceScore,
    DeducedMCP,
    DeductionDetail,
    Issue,
    MCPData,
    News,
)

NEWS_COUNT_DEDUCTION: Final = -10
NEWS_RECENCY_DEDUCTION: Final = -8
MISSING_FINANCIALS_DEDUCTION: Final = -20
PRICE_HISTORY_DEDUCTION: Final = -15
MISSING_COMPANY_FIELDS_DEDUCTION: Final = -15


def calculate_confidence_score(mcp_data: MCPData) -> DeducedMCP:
    """
    Runs all deduction checks against raw MCP data and returns the full
    validated output including clean data, confidence score breakdown,
    and issues list.
    """
    issues: list[Issue] = []

    missing_financials_deduction = calculate_financial_deduction(mcp_data.financials)
    if missing_financials_deduction:
        issues.append(
            Issue(
                reason="missing_financials",
                description="No financial data available for this ticker",
            )
        )

    news_count_deduction, news_time_deduction = calculate_news_deductions(mcp_data.news)
    if news_count_deduction:
        issues.append(
            Issue(
                reason="insufficient_news",
                description=f"Only {len(mcp_data.news)} articles found, minimum is 3",
            )
        )
    if news_time_deduction:
        issues.append(
            Issue(
                reason="stale_news",
                description="Most recent article is older than 14 days",
            )
        )

    price_history_deduction = calculate_price_history_deduction(mcp_data.price_history)
    if price_history_deduction:
        issues.append(
            Issue(
                reason="insufficient_price_history",
                description="Price history spans fewer than 90 days",
            )
        )

    company_fields_deduction, missing_fields = calculate_information_deductions(
        mcp_data.company_information
    )
    if missing_fields:
        issues.append(
            Issue(
                reason="missing_company_fields",
                description=f"Missing fields: {', '.join(missing_fields)}",
            )
        )

    score = (
        100
        + missing_financials_deduction
        + news_count_deduction
        + news_time_deduction
        + price_history_deduction
        + company_fields_deduction
    )

    return DeducedMCP(
        clean_data=mcp_data,
        confidence_score=ConfidenceScore(
            score=score,
            deductions=DeductionDetail(
                missing_financials=missing_financials_deduction,
                news_count_below_3=news_count_deduction,
                news_older_than_14_days=news_time_deduction,
                price_history_under_90_days=price_history_deduction,
                missing_company_fields=company_fields_deduction,
            ),
        ),
        issues=issues,
    )


def calculate_financial_deduction(finances: dict) -> int:
    """Returns MISSING_FINANCIALS_DEDUCTION if finances is empty, 0 otherwise."""
    if not finances:
        return MISSING_FINANCIALS_DEDUCTION
    return 0


def calculate_news_deductions(news: list[News]) -> tuple[int, int]:
    """
    Returns count and recency deductions for news data.

    Returns a tuple of (news_count_deduction, news_recency_deduction).
    Both deductions apply if news is empty. Uses Unix timestamps from
    Finnhub.
    """
    if not news:
        return (NEWS_COUNT_DEDUCTION, NEWS_RECENCY_DEDUCTION)

    news_count_deduction = NEWS_COUNT_DEDUCTION if len(news) < 3 else 0

    most_recent = max(
        datetime.fromtimestamp(article.datetime, tz=timezone.utc) for article in news
    )
    cutoff = datetime.now(timezone.utc) - timedelta(days=14)
    news_time_deduction = NEWS_RECENCY_DEDUCTION if most_recent < cutoff else 0

    return (news_count_deduction, news_time_deduction)


def calculate_price_history_deduction(price_history: dict) -> int:
    """
    Returns PRICE_HISTORY_DEDUCTION if price history spans fewer than 90 days.

    Uses the Close key from the yfinance history dict. Dates are ISO strings,
    not Unix timestamps.
    """
    if not price_history:
        return PRICE_HISTORY_DEDUCTION

    close_dates = list(price_history.get("Close", {}).keys())

    if not close_dates:
        return PRICE_HISTORY_DEDUCTION

    earliest = datetime.fromisoformat(close_dates[0])
    latest = datetime.fromisoformat(close_dates[-1])
    days_of_data = (latest - earliest).days

    return PRICE_HISTORY_DEDUCTION if days_of_data < 90 else 0


def calculate_information_deductions(info: CompanyInformation) -> tuple[int, list[str]]:
    """
    Returns deduction and list of missing fields from sector, industry, and market_cap.
    Returns the deduction if any field is missing, along with which fields were absent.
    """
    required_fields = ["sector", "industry", "market_cap"]
    if not info:
        return (MISSING_COMPANY_FIELDS_DEDUCTION, required_fields)

    missing_fields = [
        field for field in required_fields if not getattr(info, field, None)
    ]
    deduction = MISSING_COMPANY_FIELDS_DEDUCTION if missing_fields else 0
    return (deduction, missing_fields)
