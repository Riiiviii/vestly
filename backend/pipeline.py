from typing import cast

from dotenv import load_dotenv
import asyncio
from backend.schemas.raw_data import (
    AnalystRecommendation,
    CompanyInformation,
    RawData,
    News,
)
from backend.utils.fetcher import (
    fetch_analyst_recommendations,
    fetch_financials,
    fetch_news,
    fetch_price_history,
    fetch_records,
)


async def run_analysis(ticker: str):
    (
        raw_ticker_info,
        raw_ticker_news,
        raw_financials,
        raw_price_history,
        raw_analyst_recs,
    ) = await asyncio.gather(
        asyncio.to_thread(fetch_records, ticker),
        asyncio.to_thread(fetch_news, ticker),
        asyncio.to_thread(fetch_financials, ticker),
        asyncio.to_thread(fetch_price_history, ticker),
        asyncio.to_thread(fetch_analyst_recommendations, ticker),
    )

    return RawData(
        company_information=CompanyInformation(**raw_ticker_info),
        news=[News(**n) for n in raw_ticker_news],
        financials=raw_financials,
        price_history=raw_price_history,
        analyst_recommendations=[
            AnalystRecommendation(**rec) for rec in raw_analyst_recs
        ],
    )
