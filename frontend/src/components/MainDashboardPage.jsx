import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizzes, getMyAttempts } from "../api/quizApi";
import { useAuth } from "../context/AuthContext";

const C = {
  navy: "#1a3a6b", blue: "#2563eb", orange: "#f97316",
  bg: "#f5f8ff", card: "#ffffff", altBg: "#eaf0fb",
  border: "#dce8fb", muted: "#7a8faf", body: "#4a6490",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};
function subjectColor(subject) {
  const palette = [
    { bg:"#eaf0fb", color:"#2563eb" },
    { bg:"#fff3ee", color:"#f97316" },
    { bg:"#f0fdf4", color:"#16a34a" },
    { bg:"#fdf4ff", color:"#9333ea" },
    { bg:"#fff7ed", color:"#ea580c" },
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}
function Badge({ subject }) {
  const s = subjectColor(subject);
  return <span style={{ padding:"2px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:s.bg, color:s.color }}>{subject}</span>;
}
export default function MainDashboardPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [quizzes,  setQuizzes]  = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    Promise.all([getAllQuizzes(), getMyAttempts()])
      .then(([qs, ats]) => { setQuizzes(qs); setAttempts(ats); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const attemptedIds = new Set(attempts.map(a => a.quizId));
  const available    = quizzes.filter(q => !attemptedIds.has(q.id));
  const completed    = quizzes.filter(q => attemptedIds.has(q.id));

  const totalPassed  = attempts.filter(a => a.percentage >= 60).length;
  const avgScore     = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
    : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, fontFamily:C.font }}>
      {/* Banner */}
      <div style={{ borderRadius:18, padding:"24px 28px", background:C.navy, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:180, height:180, borderRadius:"50%", background:C.orange, opacity:.12 }}/>
        <div style={{ position:"absolute", bottom:-40, left:160, width:140, height:140, borderRadius:"50%", background:C.blue, opacity:.18 }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4 }}>Hey {user?.name || "Candidate"}! 👋</div>
          <div style={{ fontSize:14, color:"#a8c0e0" }}>
            You have <span style={{ color:C.orange, fontWeight:700 }}>{available.length} quiz{available.length !== 1 ? "zes" : ""} available</span> to attempt.
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        {[
          { icon:"📝", label:"Total Quizzes",  value:quizzes.length,        color:C.blue },
          { icon:"✅", label:"Completed",      value:completed.length,      color:"#16a34a" },
          { icon:"⏳", label:"Available",      value:available.length,      color:C.orange },
          { icon:"🎯", label:"Avg Score",      value:attempts.length ? `${avgScore}%` : "—", color:C.navy },
        ].map(s => (
          <div key={s.label} style={{ background:C.card, borderRadius:16, padding:"16px 20px", border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding:"40px", textAlign:"center", color:C.muted, fontSize:14 }}>Loading quizzes…</div>
      ) : error ? (
        <div style={{ padding:"16px", borderRadius:12, background:"#fef2f2", border:"1px solid #fca5a5", color:"#991b1b", fontSize:13 }}>{error}</div>
      ) : (
        /* Two columns */
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          {/* Available */}
          <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.orange, display:"inline-block" }}/>Available Quizzes
            </div>
            {available.length === 0 ? (
              <div style={{ fontSize:13, color:C.muted, padding:"12px 0" }}>No new quizzes available.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {available.map(q => (
                  <div key={q.id} style={{ padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{q.title}</div>
                      <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:"#fff3ee", color:C.orange, whiteSpace:"nowrap", flexShrink:0 }}>{q.durationMinutes}m</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <Badge subject={q.subject} />
                      <button onClick={() => navigate(`/candidate/quiz/${q.id}`)}
                        style={{ padding:"6px 16px", borderRadius:10, background:C.blue, color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:C.font }}>
                        Start Quiz →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.blue, display:"inline-block" }}/>Completed Quizzes
            </div>
            {completed.length === 0 ? (
              <div style={{ fontSize:13, color:C.muted, padding:"12px 0" }}>No completed quizzes yet.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                {completed.map(q => {
                  const att  = attempts.find(a => a.quizId === q.id);
                  const pct  = att?.percentage ?? 0;
                  const pass = pct >= 60;
                  return (
                    <div key={q.id} style={{ padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{q.title}</div>
                        <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, whiteSpace:"nowrap", flexShrink:0, background:pass?"#f0fdf4":"#fef2f2", color:pass?"#16a34a":"#dc2626" }}>{pass?"✓ Pass":"✗ Fail"}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <div style={{ flex:1, height:5, borderRadius:999, background:C.border, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:pass?"#16a34a":"#dc2626" }}/>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:pass?"#16a34a":"#dc2626", minWidth:44 }}>{att?.score}/{att?.totalQuestions}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <Badge subject={q.subject} />
                        <span style={{ fontSize:11, fontWeight:700, color:pass?"#16a34a":"#dc2626" }}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
