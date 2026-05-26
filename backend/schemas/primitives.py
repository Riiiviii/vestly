from typing import Literal
from pydantic import ConfigDict

MODEL_CONFIG: ConfigDict = {"extra": "forbid"}

Severity = Literal["low", "medium", "high"]
EvidenceSource = Literal[
    "financial_snapshot",
    "company_snapshot",
    "recent_news",
    "flags",
    "price_movement",
    "company_summary",
]
