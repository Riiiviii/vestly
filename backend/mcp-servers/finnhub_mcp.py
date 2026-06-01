import os
import finnhub
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")


server_name: str = "finnhub-mcp"
mcp = FastMCP(server_name)
client = finnhub.Client(api_key=FINNHUB_API_KEY)


@mcp.tool()
def get_company_news(ticker: str):
    """This tool provides the current business news for a given stock ticker with a range of a month.

    Args:
        ticker: the stock ticker
    """
    try:
        current_date = datetime.today().strftime("%Y-%m-%d")
        date_range = (datetime.today() - timedelta(days=30)).strftime("%Y-%m-%d")
        news = client.company_news(ticker, _from=date_range, to=current_date)

        if not news:
            return {"error": f"No data found for ticker: {ticker}"}

        return news
    except Exception as e:
        return {"error": f"Failed to fetch company news for {ticker}: {str(e)}"}


if __name__ == "__main__":
    print(f"MCP Server Status: {server_name} initialized")
    mcp.run()
