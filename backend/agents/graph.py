from langgraph.graph import StateGraph, END
from .state import AgentState
from .nodes import (
    screen_analysis_node,
    claim_extraction_node,
    fact_verification_node,
    context_node,
    manipulation_detection_node,
    ai_content_detection_node,
    explanation_node
)

def create_agent_graph():
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("screen_analysis", screen_analysis_node)
    workflow.add_node("claim_extraction", claim_extraction_node)
    workflow.add_node("fact_verification", fact_verification_node)
    workflow.add_node("context", context_node)
    workflow.add_node("manipulation_detection", manipulation_detection_node)
    workflow.add_node("ai_content_detection", ai_content_detection_node)
    workflow.add_node("explanation", explanation_node)

    # Set Entry Point
    workflow.set_entry_point("screen_analysis")

    # Define Edges
    workflow.add_edge("screen_analysis", "claim_extraction")
    workflow.add_edge("screen_analysis", "ai_content_detection")
    
    workflow.add_edge("claim_extraction", "fact_verification")
    workflow.add_edge("claim_extraction", "context")
    workflow.add_edge("claim_extraction", "manipulation_detection")
    
    workflow.add_edge("fact_verification", "explanation")
    workflow.add_edge("context", "explanation")
    workflow.add_edge("manipulation_detection", "explanation")
    workflow.add_edge("ai_content_detection", "explanation")

    workflow.add_edge("explanation", END)

    app = workflow.compile()
    return app

agent_app = create_agent_graph()
