import os
import json
import time
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from .state import AgentState
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini 2.5 Flash Lite (Absolute lowest latency)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0, max_tokens=150)

def screen_analysis_node(state: AgentState) -> Dict[str, Any]:
    start_time = time.time()
    raw_text = state.get('content', 'No content')
    
    print("\n" + "🔥"*25)
    print("NEW INCOMING SCREEN SCRAPE ANALYSIS")
    print("🔥"*25)
    print(f"\n--- RAW ACQUIRED TEXT (Last 1000 chars) ---\n{raw_text[-1000:]}...\n----------------------------------------------\n")
    print("Brain processing via Gemini 2.5 Flash Lite...")
    
    prompt = f"""
    You are a real-time cognitive defense AI. Identify the primary post or claim the user is currently looking at from this messy screen text (prioritize the bottom of the text).
    
    Raw Text: {raw_text[-2500:]}
    
    Return strict JSON with ONLY the following exact keys to minimize output latency:
    - "claims": A list with one dict containing the "claim" (string, max 10 words).
    - "reality_score": integer 0-100.
    - "explanation": A punchy 1-2 sentence summary explaining your verdict.
    
    Return ONLY valid JSON. Keep it extremely brief.
    """
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        json_str = response.content.replace('```json', '').replace('```', '').strip()
        
        # Sometimes the LLM wraps the JSON in extra text, let's find the {
        if "{" in json_str:
            json_str = json_str[json_str.find("{"):json_str.rfind("}")+1]
            
        data = json.loads(json_str)
        if not isinstance(data, dict):
            data = {}
            
        elapsed_time = time.time() - start_time
        print(f"\n✅ ANALYSIS COMPLETE in {elapsed_time:.2f} seconds!")
        
        # Safely extract claim regardless of whether LLM returned a string or dict inside the list
        raw_claims = data.get('claims', [])
        extracted = "None"
        if raw_claims and isinstance(raw_claims, list) and len(raw_claims) > 0:
            if isinstance(raw_claims[0], dict):
                extracted = raw_claims[0].get('claim', 'None')
            elif isinstance(raw_claims[0], str):
                extracted = raw_claims[0]
                
        print(f"🎯 EXTRACTED CLAIM: {extracted}")
        print(f"🛡️ REALITY SCORE: {data.get('reality_score', 'N/A')}/100")
        print("="*50 + "\n")
    except Exception as e:
        elapsed_time = time.time() - start_time
        print(f"❌ LLM Error after {elapsed_time:.2f} seconds: {e}")
        data = {}

    r_score = data.get("reality_score", 50)
    if r_score > 75:
        t_level = "High Trust"
    elif r_score > 40:
        t_level = "Medium Trust"
    else:
        t_level = "Low Trust"
        
    # Ensure claims is strictly a list of dicts for main.py Pydantic models
    raw_claims = data.get("claims", [])
    formatted_claims = []
    if isinstance(raw_claims, list):
        for c in raw_claims:
            if isinstance(c, dict):
                formatted_claims.append(c)
            elif isinstance(c, str):
                formatted_claims.append({"claim": c, "type": "general"})

    return {
        "extracted_text": data.get("extracted_text", raw_text[:200]),
        "claims": formatted_claims,
        "verdict": data.get("verdict", {"verdict": "Unknown", "confidence": 0.5}),
        "manipulation_risk": data.get("manipulation_risk", 20),
        "risk_indicators": data.get("risk_indicators", []),
        "reality_score": r_score,
        "truth_confidence": data.get("truth_confidence", 50),
        "explanation": data.get("explanation", "Could not fully analyze."),
        "trust_level": t_level,
        "sources": [], 
        "source_reliability": 50,
        "context_completeness": 50
    }

# To eliminate LangGraph sequential latency, we make the rest of the nodes instantaneous pass-throughs
def claim_extraction_node(state: AgentState) -> Dict[str, Any]:
    return {}
def fact_verification_node(state: AgentState) -> Dict[str, Any]:
    return {}
def context_node(state: AgentState) -> Dict[str, Any]:
    return {}
def manipulation_detection_node(state: AgentState) -> Dict[str, Any]:
    return {}
def ai_content_detection_node(state: AgentState) -> Dict[str, Any]:
    return {}
def explanation_node(state: AgentState) -> Dict[str, Any]:
    return {}
