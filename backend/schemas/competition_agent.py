from typing import Literal
from pydantic import BaseModel, Field
from schemas.primitives import MODEL_CONFIG, EvidenceSource


class CompetitiveFactor(BaseModel):
    label: Literal["positive", "negative"]
    reason: str = Field(min_length=1)
    source: EvidenceSource


class Peer(BaseModel):
    ticker: str = Field(min_length=1, max_length=10)
    selection_reason: str = Field(min_length=1, max_length=150)
    factors: list[CompetitiveFactor] = Field(min_length=0, max_length=5)
    summary: str = Field(min_length=1)
    relative_position: int = Field(ge=-100, le=100)


class CompetitionOutput(BaseModel):
    model_config = MODEL_CONFIG
    peers: list[Peer] = Field(max_length=3)
    data_limitations: list[str]
    summary: str = Field(min_length=1)
    strength: int = Field(ge=0, le=100)
