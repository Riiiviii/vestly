import os
import finnhub
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
from utils.fetcher import run_analysis
from utils.research_pack import build_research_pack
from utils.confidence_calculator import calculate_confidence_score
from schemas.raw_data import RawData, ValidatedData
from schemas.research_pack import ResearchPack

load_dotenv()
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")

server_name: str = "competition-mcp"
mcp = FastMCP(server_name)
client = finnhub.Client(api_key=FINNHUB_API_KEY)


@mcp.tool()
def get_peers(ticker: str) -> list[str] | dict:
    """This tool provides a list of peers operating in the same country and sector/industry.

    Args:
        ticker: the stock ticker
    """
    try:
        peers = client.company_peers(ticker)
        return [p for p in peers if p != ticker]
    except Exception as e:
        return {"error": f"Failed to fetch company peers for {ticker}: {str(e)}"}


@mcp.tool()
async def get_research_pack(ticker: str) -> ResearchPack | dict:
    """This tool provides a research pack for a company. The research pack includes:

    - Company summary: Company information
    - Company snapshot: Key valuation and market metrics
    - Financial Snapshot: Key income statement metrics per fiscal year
    - Price movement: Close prices movement signals
    - Recent News: The 15 most recent news articles

    Args:
        ticker: the stock ticker
    """
    try:
        raw_data: RawData = await run_analysis(ticker)
        validated_data: ValidatedData = calculate_confidence_score(raw_data)
        research_pack: ResearchPack = build_research_pack(validated_data)
        return research_pack
    except Exception as e:
        return {
            "error": f"Failed to fetch company research pack for {ticker}: {str(e)}"
        }


if __name__ == "__main__":
    print(f"MCP Server Status: {server_name} initialized")
    mcp.run()
