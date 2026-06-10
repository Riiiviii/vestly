import os
import finnhub
from typing import TypedDict, cast
from dotenv import load_dotenv

load_dotenv()

_client = finnhub.Client(api_key=os.getenv("FINNHUB_API_KEY"))


class _FinnhubQuote(TypedDict):
    c: float
    d: float
    dp: float


class Quote(TypedDict):
    ticker: str
    price: float
    change: float
    changePercent: float


def fetch_quotes(tickers: list[str]) -> list[Quote]:
    results: list[Quote] = []
    for symbol in tickers:
        data = cast(_FinnhubQuote, _client.quote(symbol))
        results.append({
            "ticker": symbol,
            "price": data["c"],
            "change": data["d"],
            "changePercent": data["dp"],
        })
    return results
