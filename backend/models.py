from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class Claim(BaseModel):
    claim: str
    type: str

class VerificationResult(BaseModel):
    verdict: str
    confidence: float

class AnalysisRequest(BaseModel):
    content_type: str # "text", "image", "demo"
    content: str # text or image base64 or demo_id

class AnalysisResponse(BaseModel):
    reality_score: int
    trust_level: str
    confidence: float
    risk_indicators: List[str]
    evidence_summary: str
    sources: List[Dict[str, str]]
    claims: List[Claim]
    manipulation_risk: int
    truth_confidence: int
    source_reliability: int
    context_completeness: int
