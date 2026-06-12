"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, Shield, Zap, Info, Activity, AlertCircle, Sparkles, Fingerprint, EyeOff, Bot, Search } from "lucide-react";

type AnalysisResult = {
  reality_score: number;
  trust_level: string;
  confidence: number;
  risk_indicators: string[];
  evidence_summary: string;
  sources: { title: string; url: string }[];
  claims: { claim: string; type: string }[];
  manipulation_risk: number;
  truth_confidence: number;
  source_reliability: number;
  context_completeness: number;
};

const DEMO_POSTS = [
  {
    id: 1,
    author: "Global News Network",
    handle: "@global_news",
    platform: "X",
    content: "Crime has increased by 300% because of immigrants. The official numbers are being hidden from you! Wake up! 😡🚨 #bordercrisis",
    image: "https://images.unsplash.com/photo-1548345680-f5475ea90f46?auto=format&fit=crop&w=600&q=80",
    likes: "12K",
    type: "demo_misleading"
  },
  {
    id: 2,
    author: "Health Optimization",
    handle: "@health_guru",
    platform: "Instagram",
    content: "This new miracle supplement cures 99% of all known ailments within 24 hours. Doctors hate it and Big Pharma is trying to ban this video. Link in bio!",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
    likes: "45K",
    type: "demo_medical"
  },
  {
    id: 3,
    author: "Science Daily",
    handle: "@science_daily",
    platform: "LinkedIn",
    content: "NASA confirms the successful launch of the Artemis II mission. The crew is safely in orbit and all systems are nominal.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80",
    likes: "102K",
    type: "demo_factual"
  }
];

export default function Home() {
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);
  const [analysisCache, setAnalysisCache] = useState<Record<number, AnalysisResult>>({});
  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'idle' | 'analyzing' | 'warning' | 'verified' | 'caution'>('idle');

  // Intersection Observer for Feed
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActivePostIndex(index);
          }
        });
      },
      { threshold: 0.6 } // Post is 60% visible
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Automatically analyze post when it comes into view
    const currentPost = DEMO_POSTS[activePostIndex];
    if (!analysisCache[currentPost.id]) {
      analyzeContent(currentPost);
    } else {
      updateButtonColor(analysisCache[currentPost.id]);
    }
  }, [activePostIndex]);

  const analyzeContent = async (post: any) => {
    setLoading(true);
    setButtonState('analyzing');

    try {
      const response = await fetch(`http://${window.location.hostname}:8000/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: post.type,
          content: post.content
        })
      });
      const data = await response.json();
      
      setAnalysisCache(prev => ({ ...prev, [post.id]: data }));
      updateButtonColor(data);
    } catch (error) {
      console.error("Analysis failed", error);
      setButtonState('idle');
    } finally {
      setLoading(false);
    }
  };

  const updateButtonColor = (data: AnalysisResult) => {
    if (data.reality_score >= 80) setButtonState('verified');
    else if (data.reality_score >= 50) setButtonState('caution');
    else setButtonState('warning');
  };

  const currentAnalysis = analysisCache[DEMO_POSTS[activePostIndex]?.id];

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-400";
    return "bg-rose-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative">
      
      {/* Simulated Feed */}
      <div className="max-w-md mx-auto h-screen overflow-y-auto snap-y snap-mandatory custom-scrollbar relative">
        <div className="py-12 px-4 text-center">
          <p className="text-neutral-500 text-sm">Scroll to simulate browsing different apps</p>
        </div>

        {DEMO_POSTS.map((post, index) => (
          <div 
            key={post.id} 
            data-index={index}
            ref={el => { postRefs.current[index] = el }}
            className="snap-center min-h-[90vh] flex items-center justify-center p-4"
          >
            <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/5 shadow-2xl w-full">
              {/* Fake App Header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">{post.platform}</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 p-0.5">
                  <div className="w-full h-full bg-neutral-900 rounded-full border-2 border-[#111]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight">{post.author}</h3>
                  <p className="text-neutral-500 text-sm">{post.handle} • 2h</p>
                </div>
              </div>
              
              <div className="px-4 pb-3">
                <p className="text-neutral-200 text-[15px] leading-relaxed">{post.content}</p>
              </div>

              <img src={post.image} alt="Post image" className="w-full h-72 object-cover" />
              
              <div className="p-4 flex justify-between items-center text-neutral-400">
                <div className="flex gap-6">
                  <span className="flex items-center gap-2 text-sm">🤍 {post.likes}</span>
                  <span className="flex items-center gap-2 text-sm">💬 1.2K</span>
                  <span className="flex items-center gap-2 text-sm">🔁 4K</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="h-20"></div>
      </div>

      {/* Floating Chat-Head Button */}
      <AnimatePresence>
        {!isOverlayExpanded && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOverlayExpanded(true)}
            className="fixed right-5 bottom-24 z-[9998] cursor-pointer group border-none bg-transparent p-0 m-0 outline-none"
          >
            {/* Pulsing ring for attention */}
            {buttonState === 'analyzing' && (
              <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping"></span>
            )}
            
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-500 border ${
              buttonState === 'idle' ? 'bg-neutral-800/80 border-white/10' :
              buttonState === 'analyzing' ? 'bg-blue-900/80 border-blue-500/50' :
              buttonState === 'verified' ? 'bg-emerald-900/80 border-emerald-500/50' :
              buttonState === 'warning' ? 'bg-rose-900/80 border-rose-500/50' :
              'bg-amber-900/80 border-amber-500/50'
            }`}>
              
              {buttonState === 'analyzing' ? (
                <Zap className="w-6 h-6 text-blue-400 animate-pulse" />
              ) : buttonState === 'verified' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : buttonState === 'warning' ? (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              ) : buttonState === 'caution' ? (
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              ) : (
                <Sparkles className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
              )}
              
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Minimal "Nutrition Label" Centered Card */}
      <AnimatePresence>
        {isOverlayExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsOverlayExpanded(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative"
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-200">RealityCheck</span>
                </div>
                <button 
                  onClick={() => setIsOverlayExpanded(false)}
                  className="text-neutral-500 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto custom-scrollbar">
                {loading || !currentAnalysis ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <Zap className="w-6 h-6 text-blue-400 animate-pulse" />
                    <p className="text-sm text-neutral-400">Analyzing context...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Score & Trust Level */}
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border ${
                        currentAnalysis.reality_score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                        currentAnalysis.reality_score >= 50 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                        'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {currentAnalysis.reality_score}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">{currentAnalysis.trust_level}</h2>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">Reality Score</p>
                      </div>
                    </div>

                    {/* AI Explanation */}
                    <p className="text-sm leading-relaxed text-neutral-300">
                      {currentAnalysis.evidence_summary}
                    </p>

                    {/* Minimal Patterns List */}
                    {currentAnalysis.risk_indicators?.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Flags</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {currentAnalysis.risk_indicators.map((indicator, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-neutral-300">
                              {indicator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Claims */}
                    {currentAnalysis.claims?.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Claims</h3>
                        <ul className="text-sm space-y-1 text-neutral-300 list-disc pl-4">
                          {currentAnalysis.claims.map((claim, idx) => (
                            <li key={idx}>"{claim.claim}"</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sources */}
                    {currentAnalysis.sources?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Sources</h3>
                        <div className="space-y-1">
                          {currentAnalysis.sources.map((source, idx) => (
                            <a key={idx} href={source.url} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5" />
                              {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; } /* Hide scrollbar for a cleaner mobile feel */
      `}</style>
    </div>
  );
}
