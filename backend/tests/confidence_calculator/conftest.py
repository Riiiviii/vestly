import pytest
from pathlib import Path
from datetime import datetime, timezone

from schemas.mcp_data import CompanyInformation, News

FIXTURES_DIR = Path(__file__).parent.parent / "_fixtures"

# ── Company Price History Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_price_history():
    return {}


@pytest.fixture
def no_close_price_history():
    return {"Open": {"2026-01-01T00:00:00-05:00": 150.0}}


@pytest.fixture
def insufficient_price_history():
    return {
        "Close": {
            "2026-04-01T00:00:00-04:00": 270.0,
            "2026-04-23T00:00:00-04:00": 273.0,
        }
    }


# ── Company Information Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_company_info() -> CompanyInformation:
    return CompanyInformation()


@pytest.fixture
def missing_fields_company_info() -> CompanyInformation:
    # Has some fields populated but the three required for full confidence
    # (sector, industry, market_cap) are absent.
    return CompanyInformation(
        symbol="AAPL",
        short_name="Apple",
        long_business_summary="Designs and sells consumer electronics.",
    )


# ── Company News Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_news() -> list[News]:
    return []


@pytest.fixture
def insufficient_company_news() -> list[News]:
    now_ts = int(datetime.now(timezone.utc).timestamp())
    return [
        News(
            datetime=now_ts,
            headline="",
            category="",
            id=1,
            image="",
            related="",
            source="",
            summary="",
            url="",
        ),
        News(
            datetime=now_ts,
            headline="",
            category="",
            id=2,
            image="",
            related="",
            source="",
            summary="",
            url="",
        ),
    ]


@pytest.fixture
def stale_company_news() -> list[News]:
    return [
        News(
            datetime=1609459200,
            headline="",
            category="",
            id=1,
            image="",
            related="",
            source="",
            summary="",
            url="",
        ),
        News(
            datetime=1609459200,
            headline="",
            category="",
            id=2,
            image="",
            related="",
            source="",
            summary="",
            url="",
        ),
        News(
            datetime=1609459200,
            headline="",
            category="",
            id=3,
            image="",
            related="",
            source="",
            summary="",
            url="",
        ),
    ]


# ── Company Financial Fixtures ────────────────────────────────────────


@pytest.fixture
def empty_financials():
    return {}
