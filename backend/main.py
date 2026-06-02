from fastapi import FastAPI, HTTPException
from pipeline import analyze_ticker

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/analyze")
async def analyze(ticker: str):
    try:
        return await analyze_ticker(ticker)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
