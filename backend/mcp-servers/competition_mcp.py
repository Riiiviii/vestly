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


if __name__ == "__main__":
    print(f"MCP Server Status: {server_name} initialized")
    mcp.run()
