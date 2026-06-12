from typing import TypedDict, List, Dict, Any

class AgentState(TypedDict):
    content_type: str
    content: str
    extracted_text: str
    claims: List[Dict[str, Any]]
    verdict: Dict[str, Any]
    context_info: str
    manipulation_risk: int
    risk_indicators: List[str]
    ai_content_confidence: float
    explanation: str
    sources: List[Dict[str, str]]
    
    # Final Output
    reality_score: int
    trust_level: str
    truth_confidence: int
    source_reliability: int
    context_completeness: int
