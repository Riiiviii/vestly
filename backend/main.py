from fastapi import FastAPI
from pipeline import analyze_ticker

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/analyze")
async def analyze(ticker: str):
    data = await analyze_ticker(ticker)
    return data
