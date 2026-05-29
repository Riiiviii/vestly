import json
from typing import cast

import yfinance as yf
import finnhub
import os
import re
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd

load_dotenv()
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)


def _camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


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
