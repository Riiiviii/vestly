import pytest
import json
import re
from pathlib import Path
from datetime import datetime, timezone

from schemas.mcp_data import (
    CompanyInformation,
    FinancialYearData,
    MCPData,
    News,
)

FIXTURES_DIR = Path(__file__).parent / "_fixtures"


def _camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


# ── Shared JSON fixtures ────────────────────────────────────────


@pytest.fixture
def valid_company_info() -> CompanyInformation:
    with open(FIXTURES_DIR / "company_info.json") as f:
        raw = json.load(f)
    snake_cased = {_camel_to_snake(k): v for k, v in raw.items()}
    return CompanyInformation(**snake_cased)


@pytest.fixture
def valid_company_price_history():
    with open(FIXTURES_DIR / "price_history.json") as f:
        return json.load(f)


@pytest.fixture
def valid_company_news() -> list[News]:
    with open(FIXTURES_DIR / "company_news.json") as f:
        news = json.load(f)
    now_ts = int(datetime.now(timezone.utc).timestamp())
    for i, article in enumerate(news):
        article["datetime"] = now_ts - (i * 3600)
    return [News(**article) for article in news]


@pytest.fixture
def valid_company_financials() -> dict[str, FinancialYearData]:
    with open(FIXTURES_DIR / "company_financials.json") as f:
        raw = json.load(f)
    return {date: FinancialYearData(**data) for date, data in raw.items()}


# ── Combined MCP fixture ────────────────────────────────────────


@pytest.fixture
def valid_mcp_data(
    valid_company_info,
    valid_company_financials,
    valid_company_news,
    valid_company_price_history,
) -> MCPData:
    return MCPData(
        company_information=valid_company_info,
        news=valid_company_news,
        financials=valid_company_financials,
        price_history=valid_company_price_history,
        analyst_recommendations=[],
    )
