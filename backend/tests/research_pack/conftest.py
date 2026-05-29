import pytest

from backend.schemas.raw_data import CompanyInformation, News

# ── Research Pack Data Fixtures ────────────────────────────────────────


@pytest.fixture
def valid_deduced_mcp(valid_mcp_data):
    from utils.confidence_calculator import calculate_confidence_score

    return calculate_confidence_score(valid_mcp_data)


# ── Research Pack Company Info Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_company_info() -> CompanyInformation:
    return CompanyInformation()


# ── Research Pack Company Snapshot Fixtures ────────────────────────────────────────


@pytest.fixture
def invalid_company_info() -> CompanyInformation:
    return CompanyInformation(
        symbol=None,
        short_name=None,
        recommendation_key=None,
        recommendation_mean=None,
        number_of_analyst_opinions=None,
        current_price=None,
        fifty_two_week_low=None,
        fifty_two_week_high=None,
        trailing_pe=None,
        forward_pe=None,
        profit_margins=None,
        revenue_growth=None,
        earnings_growth=None,
        target_mean_price=None,
        target_high_price=None,
        target_low_price=None,
        beta=None,
        sector=None,
        industry=None,
        market_cap=None,
    )


# ── Research Pack Financial Snapshot Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_company_financials():
    return {}


# ── Research Pack Price History Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_company_price_history():
    return {}


@pytest.fixture
def insufficient_price_history():
    return {
        "Close": {
            "2026-04-01T00:00:00-04:00": 270.0,
            "2026-04-23T00:00:00-04:00": 273.0,
        }
    }


# ── Research Pack News Fixtures ────────────────────────────────────────


@pytest.fixture
def less_than_15_news() -> list[News]:
    return [
        News(
            category="company",
            datetime=1777395120,
            headline="Apple's CEOs, Intel & AI, and Another SaaSpocalype",
            id=139918601,
            image="https://s.yimg.com/rz/stage/p/yahoo_finance_en-US_h_p_finance_2.png",
            related="AAPL",
            source="Yahoo",
            summary="Intel has such high demand from the AI market that it's selling chips it once thought were worthless.",
            url="https://finnhub.io/api/news?id=bd6df7daebf3de12e8d192c917b484e2ad71c64144ef903c58146f3c1001c622",
        )
    ]
