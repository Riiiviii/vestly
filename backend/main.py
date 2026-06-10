import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pipeline import analyze_ticker
from utils.quotes import fetch_quotes, Quote

logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
)


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/quotes")
def get_quotes(tickers: str) -> list[Quote]:
    symbols = [s.strip().upper() for s in tickers.split(",")]
    try:
        return fetch_quotes(symbols)
    except Exception as e:
        logger.exception("Failed to fetch quotes: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch quotes")


@app.get("/analyze")
async def analyze(ticker: str):
    try:
        return await analyze_ticker(ticker)
    except RuntimeError as e:
        logger.exception("Pipeline failed for ticker %s: %s", ticker, e)
        raise HTTPException(status_code=500, detail="Internal server error")
