from schemas.research_pack import ResearchPack
from typing import Final
from pathlib import Path
from agents import Agent, Runner, trace
from dotenv import load_dotenv
from schemas.competition_agent import CompetitionOutput
from agents.mcp import MCPServerStdio

load_dotenv(override=True)


class CompetitionAgent:
    MODEL: Final = "gpt-4o"

    def __init__(
        self,
    ) -> None:
        self.name = "competition"
        self.output_model = CompetitionOutput
        self.instruction: str = (
            Path(__file__).parent / "prompts" / "competition_agent.txt"
        ).read_text()
        self._mcp_server = MCPServerStdio(
            params={
                "command": "python",
                "args": [
                    str(
                        Path(__file__).parent.parent
                        / "mcp_servers"
                        / "competition_mcp.py"
                    )
                ],
            }
        )
        self._agent = Agent(
            name=f"{self.name}-analysis-agent",
            instructions=self.instruction,
            model=self.MODEL,
            output_type=self.output_model,
            mcp_servers=[self._mcp_server],
        )

    async def run(self, research_pack: ResearchPack) -> CompetitionOutput:
        data = research_pack.model_dump_json()

        with trace(f"{self.name.capitalize()} Agent"):
            async with self._mcp_server:
                result = await Runner.run(self._agent, data, max_turns=25)
                if result.final_output is None:
                    raise RuntimeError(
                        f"{self.name.capitalize()} agent produced no final output"
                    )
                return result.final_output
