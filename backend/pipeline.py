from schemas.raw_data import RawData
from utils.confidence_calculator import calculate_confidence_score
from utils.fetcher import run_analysis
from utils.research_pack import build_research_pack
from schemas.research_pack import ResearchPack


async def analyze_ticker(ticker: str) -> ResearchPack:
    raw_data: RawData = await run_analysis(ticker)
    validated_data = calculate_confidence_score(raw_data)
    return build_research_pack(validated_data)
