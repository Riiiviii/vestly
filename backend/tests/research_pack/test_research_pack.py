from schemas.research_pack import CompanySnapshot

from utils.research_pack import (
    build_research_pack,
    get_company_snapshot,
    get_company_summary,
    get_financial_snapshot,
    get_price_movement,
    get_recent_news,
)

# ── Research Pack Generation Testing ────────────────────────────────────────


def test_build_research_pack_valid(valid_deduced_mcp):
    result = build_research_pack(valid_deduced_mcp)

    assert result.company_summary != ""
    assert result.company_snapshot.symbol == "AAPL"
    assert result.financial_snapshot != {}
    assert result.price_movement.current_price is not None
    assert len(result.recent_news) <= 15
    assert result.data_confidence == 100
    assert result.flags == []


# ── Research Pack Company Summary Testing ────────────────────────────────────


def test_get_company_summary_valid(valid_company_info):
    assert get_company_summary(valid_company_info) != ""


def test_get_company_summary_missing_field(empty_company_info):
    assert get_company_summary(empty_company_info) == ""


# ── Research Pack Company Snapshot Testing ────────────────────────────────────


def test_get_company_snapshot_valid(valid_company_info):
    result = get_company_snapshot(valid_company_info)
    assert result.model_dump(exclude_none=True) != {}


def test_get_company_snapshot_missing_fields(invalid_company_info):
    result: CompanySnapshot = get_company_snapshot(invalid_company_info)
    for v in result.model_dump().values():
        assert v is None


# ── Research Pack Financial Snapshot Testing ────────────────────────────────────


def test_get_financial_snapshot_valid(valid_company_financials):
    assert get_financial_snapshot(valid_company_financials) != {}


def test_get_financial_snapshot_empty(empty_company_financials):
    assert get_financial_snapshot(empty_company_financials) == {}


# ── Research Pack Price Movement Testing ────────────────────────────────────


def test_get_price_movement_valid(valid_company_price_history):
    result = get_price_movement(valid_company_price_history)
    assert result.model_dump(exclude_none=True) != {}


def test_get_price_movement_empty(empty_company_price_history):
    result = get_price_movement(empty_company_price_history)
    for v in result.model_dump().values():
        assert v is None


def test_get_price_movement_insufficient(insufficient_price_history):
    result = get_price_movement(insufficient_price_history)
    assert result.current_price is not None
    assert result.price_30d_ago is None
    assert result.price_90d_ago is None
    assert result.change_30d_pct is None
    assert result.change_90d_pct is None


# ── Research Pack News Testing ────────────────────────────────────


def test_get_recent_news_valid(valid_company_news):
    result = get_recent_news(valid_company_news)
    assert len(result) == 15


def test_get_recent_news_insufficient(less_than_15_news):
    result = get_recent_news(less_than_15_news)
    assert len(result) == 1
