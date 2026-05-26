from pydantic import BaseModel, Field

from schemas.primitives import MODEL_CONFIG, EvidenceSource, Severity


class DownsideScenario(BaseModel):
    model_config = MODEL_CONFIG

    scenario: str = Field(min_length=1)
    trigger: str = Field(min_length=1)
    evidence: str = Field(min_length=1)
    evidence_source: EvidenceSource
    severity: Severity


class ConcentrationRisk(BaseModel):
    model_config = MODEL_CONFIG

    risk: str = Field(min_length=1)
    evidence: str = Field(min_length=1)
    evidence_source: EvidenceSource
    severity: Severity


class BalanceSheetConcern(BaseModel):
    model_config = MODEL_CONFIG

    concern: str = Field(min_length=1)
    metric: str = Field(min_length=1)
    metric_value: float | None = None
    stress_implication: str = Field(min_length=1)
    severity: Severity


class RiskOutput(BaseModel):
    model_config = MODEL_CONFIG

    downside_scenarios: list[DownsideScenario]
    concentration_risks: list[ConcentrationRisk]
    balance_sheet_concerns: list[BalanceSheetConcern]
    data_layer_red_flags: list[str]
    thesis_breakers: list[str]
    data_limitations: list[str]
    summary: str = Field(min_length=1)
    strength: int = Field(ge=0, le=100)
