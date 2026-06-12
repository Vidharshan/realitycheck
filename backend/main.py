from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AnalysisRequest, AnalysisResponse, Claim
from agents.graph import agent_app

app = FastAPI(title="RealityCheck AI MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_content(request: AnalysisRequest):
    try:
        initial_state = {
            "content_type": request.content_type,
            "content": request.content,
            "extracted_text": "",
            "claims": [],
            "verdict": {},
            "context_info": "",
            "manipulation_risk": 0,
            "risk_indicators": [],
            "ai_content_confidence": 0.0,
            "explanation": "",
            "sources": [],
            "reality_score": 0,
            "trust_level": "",
            "truth_confidence": 0,
            "source_reliability": 0,
            "context_completeness": 0
        }
        
        final_state = agent_app.invoke(initial_state)
        
        # Convert claims dict to Claim objects
        claims = [Claim(**c) for c in final_state.get("claims", [])]
        
        return AnalysisResponse(
            reality_score=final_state.get("reality_score", 0),
            trust_level=final_state.get("trust_level", "Unknown"),
            confidence=final_state.get("verdict", {}).get("confidence", 0.0),
            risk_indicators=final_state.get("risk_indicators", []),
            evidence_summary=final_state.get("explanation", ""),
            sources=final_state.get("sources", []),
            claims=claims,
            manipulation_risk=final_state.get("manipulation_risk", 0),
            truth_confidence=final_state.get("truth_confidence", 0),
            source_reliability=final_state.get("source_reliability", 0),
            context_completeness=final_state.get("context_completeness", 0)
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
