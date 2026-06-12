# RealityCheck AI - Agentic Misinformation & Manipulation Detection Overlay

RealityCheck AI is an AI-powered cognitive defense layer that helps users identify misinformation, manipulation, propaganda, and missing context while browsing social media.

This repository contains the production-grade MVP consisting of a FastAPI backend orchestrated with LangGraph and a Next.js frontend featuring a sleek, mobile-first, dark-mode, glassmorphic UI.

## Architecture

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: FastAPI, Python
- **Agent Orchestration**: LangGraph
- **Agents**:
  - Screen Analysis
  - Claim Extraction
  - Fact Verification
  - Context Generation
  - Manipulation Detection
  - AI Content Detection
  - Explanation Synthesis

## How to Run locally

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

### Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## Demo Scenario

The Next.js frontend has a built-in demo feed containing three sample posts:
1. Misleading statistic post ("Crime has increased by 300%...")
2. Fake health claim ("miracle supplement cures 99%...")
3. Factual post ("NASA confirms successful launch...")

Clicking on "Verify with RealityCheck" under any post triggers the LangGraph agent architecture which simulates processing the claim through the multimodal and contextual agent pipelines and displays the results in the floating, expandable overlay bubble.

## Deployment Instructions

### Backend (Vercel / Render)
1. You can deploy the FastAPI application using services like Render or Railway.
2. Set up the `requirements.txt` and use the start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.

### Frontend (Vercel)
1. Deploy the Next.js app seamlessly on Vercel.
2. Set the `NEXT_PUBLIC_API_URL` environment variable pointing to the production backend URL (replace `http://localhost:8000` in `page.tsx`).
