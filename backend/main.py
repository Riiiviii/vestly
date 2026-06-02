import logging
from fastapi import FastAPI, HTTPException
from pipeline import analyze_ticker

logger = logging.getLogger(__name__)

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/analyze")
async def analyze(ticker: str):
    try:
        return await analyze_ticker(ticker)
    except RuntimeError as e:
        logger.exception("Pipeline failed for ticker %s: %s", ticker, e)
        raise HTTPException(status_code=500, detail="Internal server error")
