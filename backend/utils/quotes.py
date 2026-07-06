import asyncio
import logging
import os
import finnhub
from typing import TypedDict, cast
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

api_key = os.getenv("FINNHUB_API_KEY")
if not api_key:
    raise RuntimeError("FINNHUB_API_KEY environment variable is not set")

_client = finnhub.Client(api_key=api_key)


class _FinnhubQuote(TypedDict):
    c: float
    d: float
    dp: float


class Quote(TypedDict):
    ticker: str
    price: float
    change: float
    changePercent: float


async def fetch_quotes(tickers: list[str]) -> list[Quote]:
    async def fetch_one(symbol: str) -> Quote | None:
        try:
            data = cast(_FinnhubQuote, await asyncio.to_thread(_client.quote, symbol))
            return {
                "ticker": symbol,
                "price": data["c"],
                "change": data["d"],
                "changePercent": data["dp"],
            }
        except Exception:
            logger.warning("Failed to fetch quote for %s", symbol)
            return None

    results = await asyncio.gather(*[fetch_one(symbol) for symbol in tickers])
    return [q for q in results if q is not None]
