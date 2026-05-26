from typing import Literal

from pydantic import BaseModel, Field

from schemas.mcp_data import News
from schemas.primitives import MODEL_CONFIG


class SentimentOutput(BaseModel):
    model_config = MODEL_CONFIG

    general_sentiment: Literal["positive", "neutral", "negative", "mixed"]
    summary: str = Field(min_length=1)
    notable_events: list[News]
    strength: int = Field(ge=0, le=100)
