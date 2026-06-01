from typing import Final
from pathlib import Path
from agents import Agent, ModelSettings, Runner, trace
from dotenv import load_dotenv
from schemas.judge_agent import JudgeOutput, PanelOutputs

load_dotenv()


class JudgeAgent:
    MODEL: Final = "gpt-4o"

    def __init__(
        self,
    ) -> None:
        self.name = "judge"
        self.output_model = JudgeOutput
        self.instruction: str = (
            Path(__file__).parent / "prompts" / "judge_agent.txt"
        ).read_text()

        self._agent = Agent(
            name=f"{self.name}-analysis-agent",
            instructions=self.instruction,
            model=self.MODEL,
            output_type=self.output_model,
            model_settings=ModelSettings(temperature=0),
        )

    async def run(self, agent_outputs: PanelOutputs) -> JudgeOutput:
        data = agent_outputs.model_dump_json()

        with trace(f"{self.name.capitalize()} Agent"):
            result = await Runner.run(self._agent, data, max_turns=10)
            if result.final_output is None:
                raise RuntimeError(
                    f"{self.name.capitalize()} agent produced no final output"
                )
            return result.final_output
