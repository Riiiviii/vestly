import json
from typing import cast

import yfinance as yf
import finnhub
import os
import re
from dotenv import load_dotenv
from datetime import datetime, timedelta
import asyncio
import pandas as pd
from schemas.mcp_data import AnalystRecommendation, CompanyInformation, MCPData, News

load_dotenv(override=True)
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)


def _camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


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

    return MCPData(
        company_information=CompanyInformation(**raw_ticker_info),
        news=[News(**n) for n in raw_ticker_news],
        financials=raw_financials,
        price_history=raw_price_history,
        analyst_recommendations=[
            AnalystRecommendation(**rec) for rec in raw_analyst_recs
        ],
    )


def fetch_analyst_recommendations(ticker: str):
    user_ticker = yf.Ticker(ticker)
    recs = user_ticker.recommendations
    if not isinstance(recs, pd.DataFrame) or recs.empty:
        return []
    raw = json.loads(recs.to_json(orient="records"))
    return [{_camel_to_snake(k): v for k, v in rec.items()} for rec in raw]


def fetch_financials(ticker: str):
    user_ticker = yf.Ticker(ticker)
    raw = user_ticker.financials.to_dict()

    converted = {}
    for timestamp, values in raw.items():
        cleaned = {k: (None if pd.isna(v) else v) for k, v in values.items()}
        converted[cast(datetime, timestamp).isoformat()] = cleaned
    return converted


def fetch_price_history(ticker: str):
    user_ticker = yf.Ticker(ticker)
    history = user_ticker.history(period="1y")
    raw = history.to_dict()

    converted = {}
    for column, values in raw.items():
        converted[column] = {k.isoformat(): v for k, v in values.items()}
    return converted


def fetch_records(ticker: str):
    user_ticker = yf.Ticker(ticker)
    ticker_info = user_ticker.info
    return {_camel_to_snake(str(k)): v for k, v in ticker_info.items()}


def fetch_news(ticker: str):
    today = datetime.today().strftime("%Y-%m-%d")
    month_ago = (datetime.today() - timedelta(days=30)).strftime("%Y-%m-%d")
    news = finnhub_client.company_news(ticker, _from=month_ago, to=today)
    return news
