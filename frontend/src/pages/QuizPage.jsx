// QuizPage.jsx — Full-screen quiz taking experience
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getQuizById, submitAttempt } from "../api/quizApi";

const C = {
  navy:"#1a3a6b", blue:"#2563eb", orange:"#f97316", green:"#16a34a", red:"#dc2626",
  bg:"#f5f8ff", card:"#ffffff", altBg:"#eaf0fb", border:"#dce8fb", muted:"#7a8faf", body:"#4a6490",
  font:"'DM Sans','Segoe UI',sans-serif",
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export default function QuizPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [quiz,     setQuiz]     = useState(null);
  const [answers,  setAnswers]  = useState([]);   // array of ints (null = not answered)
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result,   setResult]   = useState(null);  // AttemptResponse after submit
  const [tabSwitchCount, setTabSwitchCount] = useState(() => {
    // Load tab switch count from sessionStorage on mount
    const stored = sessionStorage.getItem(`quiz_${id}_tabSwitches`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showTabWarning, setShowTabWarning] = useState(false);
  const pageLeftRef = useRef(false);

  useEffect(() => {
    getQuizById(id)
      .then(data => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
        setTimeLeft(data.durationMinutes * 60);
        setLoading(false);
        
        // Request fullscreen mode on quiz load
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => {
            console.log("⚠️ Fullscreen request failed:", err);
          });
        }
      })
      .catch(e => { setError(e.message); setLoading(false); });
    
    // Cleanup: Exit fullscreen when quiz is unloaded
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [id]);

  const handleSubmit = useCallback(async (forced = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Replace any unanswered (null) with 0 since backend validates count
      const finalAnswers = answers.map(a => a ?? 0);
      const res = await submitAttempt(Number(id), finalAnswers);
      setResult(res);
    } catch (e) {
      alert(e.message || "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }, [id, answers, submitting]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, result, handleSubmit]);

  // Save tab switch count to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem(`quiz_${id}_tabSwitches`, tabSwitchCount);
  }, [id, tabSwitchCount]);

  // Clean up sessionStorage when quiz is submitted/completed
  useEffect(() => {
    if (result) {
      sessionStorage.removeItem(`quiz_${id}_tabSwitches`);
    }
  }, [id, result]);

  // Track browser back/forward navigation via location changes
  useEffect(() => {
    const quizPathRegex = new RegExp(`^/candidate/quiz/${id}$`);
    const isCurrentlyOnQuiz = quizPathRegex.test(location.pathname);

    // Mark if we're leaving the quiz page
    if (!isCurrentlyOnQuiz && pageLeftRef.current === false) {
      console.log("🔙 Left quiz page via navigation");
      pageLeftRef.current = true;
    }

    // If we were away and now returning to this specific quiz page
    if (isCurrentlyOnQuiz && pageLeftRef.current === true) {
      console.log("↩️ Returned to quiz page via back/forward!");
      pageLeftRef.current = false;
      
      const newCount = tabSwitchCount + 1;
      setTabSwitchCount(newCount);
      sessionStorage.setItem(`quiz_${id}_tabSwitches`, newCount);
      console.log(`📊 Back/Forward Navigation detected! Count: ${newCount}/3`);

      if (newCount === 1) {
        setShowTabWarning(true);
      } else if (newCount === 3) {
        setShowTabWarning(true);
      } else if (newCount > 3) {
        handleSubmit(true);
      } else {
        setShowTabWarning(true);
      }
    }
  }, [location.pathname, id, tabSwitchCount, handleSubmit]);

  // Block browser navigation and prevent leaving during quiz
  useEffect(() => {
    if (!quiz || result) return; // Only block while quiz is active
    
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "⚠️ You cannot leave the quiz. Your answers will be lost.";
      return "⚠️ You cannot leave the quiz. Your answers will be lost.";
    };
    
    const handlePopstate = (e) => {
      e.preventDefault();
      alert("❌ You cannot go back during a quiz. Please complete your attempt.");
      window.history.forward();
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);
    
    // Disable browser back button
    window.history.pushState(null, null, window.location.href);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [quiz, result]);

  // Tab switch and navigation detection
  useEffect(() => {
    let pageLeftViaNavigation = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pageLeftViaNavigation = true;
        console.log("👁️ Page hidden (tab/navigation away)");
      } else if (pageLeftViaNavigation) {
        // Page became visible after being hidden
        console.log("👁️ Page visible again!");
        pageLeftViaNavigation = false;
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        sessionStorage.setItem(`quiz_${id}_tabSwitches`, newCount);
        console.log(`📊 Navigation/Tab switch detected! Count: ${newCount}/3`);

        if (newCount === 3) {
          setShowTabWarning(true);
        } else if (newCount > 3) {
          handleSubmit(true);
        } else {
          setShowTabWarning(true);
        }
      }
    };

    // Also detect leaving page entirely
    const handleBeforeUnload = () => {
      console.log("🚪 beforeunload - user leaving page");
      pageLeftViaNavigation = true;
    };

    // When page regains focus after beforeunload
    const handleFocus = () => {
      if (pageLeftViaNavigation) {
        console.log("🎯 Page refocused after navigation!");
        pageLeftViaNavigation = false;
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        sessionStorage.setItem(`quiz_${id}_tabSwitches`, newCount);
        console.log(`📊 Back/Forward detected! Count: ${newCount}/3`);

        if (newCount === 3) {
          setShowTabWarning(true);
        } else if (newCount > 3) {
          handleSubmit(true);
        } else {
          setShowTabWarning(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("focus", handleFocus);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("focus", handleFocus);
    };
  }, [id, tabSwitchCount, handleSubmit]);

  // Block copy, paste, cut, select all, right-click, and developer tools
  useEffect(() => {
    const blockActions = (e) => {
      // Block keyboard shortcuts: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+Shift+I, F12
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
      }
      // Block right-click context menu
      if (e.button === 2) e.preventDefault();
    };

    const blockContextMenu = (e) => e.preventDefault();

    document.addEventListener("keydown", blockActions);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("copy", (e) => e.preventDefault());
    document.addEventListener("paste", (e) => e.preventDefault());
    document.addEventListener("cut", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("keydown", blockActions);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("copy", (e) => e.preventDefault());
      document.removeEventListener("paste", (e) => e.preventDefault());
      document.removeEventListener("cut", (e) => e.preventDefault());
    };
  }, []);

  const answeredCount = answers.filter(a => a !== null).length;
  const totalQ        = quiz?.questions?.length || 0;

  // ── Result screen ──────────────────────────────────────────
  if (result) {
    const pass = result.percentage >= 60;
    const r = 52, circ = 2 * Math.PI * r, filled = (result.percentage / 100) * circ;
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:C.font, padding:20 }}>
        <div style={{ background:C.card, borderRadius:20, maxWidth:480, width:"100%", overflow:"hidden", boxShadow:"0 8px 40px #1a3a6b18" }}>
          {/* Banner */}
          <div style={{ background:C.navy, padding:"32px 32px 28px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:40, width:120, height:120, borderRadius:"50%", background:C.orange, opacity:.1 }}/>
            <div style={{ position:"absolute", bottom:-30, left:30, width:100, height:100, borderRadius:"50%", background:C.blue, opacity:.15 }}/>
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:11, color:"#a8c0e0", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Quiz Complete</div>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ margin:"0 auto 10px", display:"block" }}>
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
                <circle cx="60" cy="60" r={r} fill="none" stroke={pass?"#4ade80":"#f87171"} strokeWidth="10"
                  strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round"
                  style={{ transform:"rotate(-90deg)", transformOrigin:"60px 60px" }}/>
                <text x="60" y="56" textAnchor="middle" style={{ fontSize:20, fontWeight:900, fill:"#fff", fontFamily:C.font }}>{result.percentage.toFixed(0)}%</text>
                <text x="60" y="72" textAnchor="middle" style={{ fontSize:11, fill:"#a8c0e0", fontFamily:C.font }}>{pass?"PASS":"FAIL"}</text>
              </svg>
              <div style={{ fontSize:22, fontWeight:900, color:pass?"#4ade80":"#f87171" }}>{pass?"Congratulations! 🎉":"Better luck next time"}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderBottom:`1.5px solid ${C.border}` }}>
            {[
              { label:"Score",    value:`${result.score}/${result.totalQuestions}`, color:C.navy },
              { label:"Correct",  value:result.score,       color:C.green },
              { label:"Wrong",    value:result.totalQuestions - result.score, color:C.red },
            ].map((s,i)=>(
              <div key={i} style={{ padding:"18px 16px", borderRight:i<2?`1px solid ${C.border}`:"none", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:12 }}>
            <button onClick={() => navigate("/candidate/solutions", { state:{ attemptId: result.id } })}
              style={{ padding:"12px", borderRadius:12, background:C.blue, color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:C.font }}>
              View Solutions
            </button>
            <button onClick={() => navigate("/candidate/dashboard")}
              style={{ padding:"12px", borderRadius:12, background:C.altBg, color:C.navy, border:`1.5px solid ${C.border}`, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:C.font }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading / Error ────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, fontFamily:C.font, color:C.muted, fontSize:15 }}>
        Loading quiz…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, fontFamily:C.font }}>
        <div style={{ background:"#fef2f2", border:"1.5px solid #fca5a5", borderRadius:16, padding:"32px 36px", color:"#991b1b", maxWidth:400, textAlign:"center" }}>
          <div style={{ fontSize:24, marginBottom:12 }}>⚠️</div>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Failed to load quiz</div>
          <div style={{ fontSize:13 }}>{error}</div>
          <button onClick={() => navigate("/candidate/dashboard")}
            style={{ marginTop:20, padding:"10px 24px", borderRadius:10, background:C.navy, color:"#fff", border:"none", fontWeight:700, cursor:"pointer", fontFamily:C.font }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz UI ────────────────────────────────────────────────
  const timerColor = timeLeft < 60 ? C.red : timeLeft < 5 * 60 ? C.orange : C.green;

  // Tab switch warning modal
  const TabWarningModal = () => (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div style={{ background:C.card, borderRadius:16, maxWidth:400, width:"90%", padding:"32px 28px", boxShadow:"0 16px 48px rgba(0,0,0,0.3)" }}>
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
          <div style={{ fontSize:18, fontWeight:900, color:C.navy, marginBottom:8 }}>
            {tabSwitchCount >= 3 ? "Final Warning!" : `Tab Switch Detected (${tabSwitchCount}/3)`}
          </div>
          <div style={{ fontSize:14, color:C.body, lineHeight:1.6 }}>
            {tabSwitchCount >= 3 
              ? "You've switched tabs 3 times. Any further attempt will automatically submit your quiz!"
              : `You switched tabs ${tabSwitchCount} time${tabSwitchCount > 1 ? 's' : ''}. You have ${3 - tabSwitchCount} more allowed switch${3 - tabSwitchCount > 1 ? 'es' : ''} before automatic submission.`}
          </div>
        </div>
        <button 
          onClick={() => setShowTabWarning(false)}
          style={{ width:"100%", padding:"12px", borderRadius:12, background:C.blue, color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:C.font }}>
          I Understand
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, width:"100vw", height:"100vh", overflow:"hidden", background:C.bg, fontFamily:C.font, display:"flex", flexDirection:"column" }}>
      {/* Fullscreen overlay to block interactions outside quiz */}
      {!result && <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:1 }}/>}
      
      {/* Tab switch warning modal */}
      {showTabWarning && <TabWarningModal />}
      
      {/* Main quiz container */}
      <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
        {/* Sticky header */}
        <div style={{ position:"sticky", top:0, zIndex:50, background:C.navy, padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 16px #1a3a6b28", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, color:"#a8c0e0", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>{quiz.subject}</div>
            <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginTop:2 }}>{quiz.title}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {/* Tab Switch Warning */}
            {tabSwitchCount > 0 && (
              <div style={{ textAlign:"center", padding:"8px 12px", background:"#fef3c7", borderRadius:8, border:"1.5px solid #fcd34d" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#92400e" }}>⚠️ Tab Switches</div>
                <div style={{ fontSize:12, fontWeight:900, color:"#dc2626" }}>{tabSwitchCount}/3</div>
              </div>
            )}
            {/* Progress */}
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:14, fontWeight:900, color:C.orange }}>{answeredCount}/{totalQ}</div>
              <div style={{ fontSize:10, color:"#a8c0e0" }}>Answered</div>
            </div>
            {/* Timer */}
            <div style={{ background:`${timerColor}22`, border:`1.5px solid ${timerColor}55`, borderRadius:12, padding:"8px 16px", textAlign:"center", minWidth:80 }}>
              <div style={{ fontSize:18, fontWeight:900, color:timerColor, fontVariantNumeric:"tabular-nums" }}>{formatTime(timeLeft)}</div>
              <div style={{ fontSize:10, color:"#a8c0e0" }}>Remaining</div>
            </div>
          </div>
        </div>

        {/* Questions - Scrollable */}
        <div style={{ flex:1, overflow:"auto", padding:"28px 20px 28px" }}>
          <div style={{ maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {quiz.questions.map((q, qi) => {
            const chosen = answers[qi];
            return (
              <div key={qi} style={{ background:C.card, borderRadius:16, border:`1.5px solid ${chosen !== null ? C.blue : C.border}`, overflow:"hidden", boxShadow:"0 2px 10px #1a3a6b08" }}>
                {/* Question header */}
                <div style={{ background:C.altBg, padding:"12px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:chosen !== null ? C.blue : C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", flexShrink:0 }}>
                    {qi + 1}
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:C.muted }}>Question {qi + 1} of {totalQ}</span>
                  {chosen !== null && <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:C.blue }}>✓ Answered</span>}
                </div>

                <div style={{ padding:"18px 20px" }}>
                  <p style={{ margin:"0 0 16px", fontSize:14, fontWeight:700, color:C.navy, lineHeight:1.6 }}>{q.text}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {q.options.map((opt, oi) => {
                      const isChosen = chosen === oi;
                      return (
                        <button key={oi} type="button"
                          onClick={() => {
                            const newAns = [...answers];
                            newAns[qi] = oi;
                            setAnswers(newAns);
                          }}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:12,
                            border:`1.5px solid ${isChosen ? C.blue : C.border}`,
                            background: isChosen ? C.altBg : C.bg,
                            cursor:"pointer", textAlign:"left", fontFamily:C.font, transition:"all 0.12s",
                          }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${isChosen ? C.blue : C.border}`, background:isChosen ? C.blue : "#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.12s" }}>
                            {isChosen && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                          </div>
                          <span style={{ fontSize:13, fontWeight: isChosen ? 700 : 400, color: isChosen ? C.navy : C.body }}>
                            <strong style={{ color:C.muted, marginRight:6 }}>{String.fromCharCode(65+oi)}.</strong>{opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>

        {/* Submit button bar - sticky at bottom */}
        <div style={{ background:C.card, borderTop:`1.5px solid ${C.border}`, padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 -4px 24px #1a3a6b10", flexShrink:0 }}>
          <div style={{ fontSize:13, color:C.muted }}>
            <span style={{ fontWeight:700, color:answeredCount === totalQ ? C.green : C.navy }}>{answeredCount}</span>/{totalQ} questions answered
            {answeredCount < totalQ && <span style={{ color:C.orange, marginLeft:6 }}>({totalQ - answeredCount} unanswered will be marked wrong)</span>}
          </div>
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            style={{ padding:"12px 32px", borderRadius:12, background:submitting ? "#93c5fd" : C.blue, color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:submitting ? "not-allowed" : "pointer", fontFamily:C.font, display:"flex", alignItems:"center", gap:8 }}>
            {submitting ? "Submitting…" : "Submit Quiz"}
            {!submitting && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:15,height:15 }}><path d="M5 13l4 4L19 7"/></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}
