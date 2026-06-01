from schemas.research_pack import ResearchPack
from typing import Final
from pathlib import Path
from agents import Agent, Runner, trace
from dotenv import load_dotenv
from typing import Generic, TypeVar
from pydantic import BaseModel

load_dotenv(override=True)


TOutput = TypeVar("TOutput", bound=BaseModel)


class AnalysisAgent(Generic[TOutput]):
    MODEL: Final = "gpt-4o-mini"

    def __init__(
        self,
        name: str,
        prompt_file_name: str,
        output_model: type[TOutput],
    ) -> None:
        self.name = name
        self.output_model = output_model
        self.instruction: str = (
            Path(__file__).parent / "prompts" / prompt_file_name
        ).read_text()
        self._agent = Agent(
            name=f"{self.name}-analysis-agent",
            instructions=self.instruction,
            model=self.MODEL,
            output_type=self.output_model,
        )

    async def run(self, research_pack: ResearchPack) -> TOutput:
        data = research_pack.model_dump_json()

        with trace(f"{self.name.capitalize()} Agent"):
            result = await Runner.run(self._agent, data)
            if result.final_output is None:
                raise RuntimeError(
                    f"{self.name.capitalize()} agent produced no final output"
                )
            return result.final_output
