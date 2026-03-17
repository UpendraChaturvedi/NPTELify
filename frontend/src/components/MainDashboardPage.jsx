import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizzes, getMyAttempts } from "../api/quizApi";
import { useAuth } from "../context/AuthContext";
import { notificationStore } from "../utils/notificationStore";

const C = {
  navy: "#1a3a6b", blue: "#2563eb", orange: "#f97316",
  bg: "#f5f8ff", card: "#ffffff", altBg: "#eaf0fb",
  border: "#dce8fb", muted: "#7a8faf", body: "#4a6490",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

/* Icon SVG Renderer for Dashboard */
function getDashboardIcon(iconType) {
  const iconMap = {
    quizzes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:20, height:20 }}><path d="M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7M9 7h6M9 11h6M9 15h2M4 7h16M9 3h6a2 2 0 012 2v2H7V5a2 2 0 012-2z"/></svg>,
    completed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:20, height:20 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4l-8.97 9.97-4.22-3.604"/></svg>,
    live: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:20, height:20 }}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
    upcoming: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:20, height:20 }}><path d="M12 2v20M2 12h20M4 4l16 16M20 4l-16 16"/></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  };
  return iconMap[iconType] || iconMap.quizzes;
}

function CountdownTimer({ scheduledDateTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const scheduled = new Date(scheduledDateTime);
      const now = new Date();
      const diff = scheduled.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("⚪ Starting now!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m`);
      } else if (mins > 0) {
        setTimeLeft(`${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${secs}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [scheduledDateTime]);

  return <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316", display:"flex", alignItems:"center", gap:4 }}>{getDashboardIcon('clock')} {timeLeft}</span>;
}

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
      .then(([qs, ats]) => {
        setQuizzes(qs);
        setAttempts(ats);
        setLoading(false);

        // Check for quizzes starting soon and trigger notifications
        const now = new Date();
        qs.forEach(quiz => {
          if (quiz.scheduledDateTime) {
            const scheduled = new Date(quiz.scheduledDateTime);
            const endTime = new Date(scheduled.getTime() + quiz.durationMinutes * 60 * 1000);
            const timeUntilStart = scheduled.getTime() - now.getTime();
            const timeUntilEnd = endTime.getTime() - now.getTime();
            const oneHour = 60 * 60 * 1000;
            const hasAttempted = ats.some(a => a.quizId === quiz.id);

            // Notify if quiz is live
            if (scheduled <= now && now < endTime && !hasAttempted) {
              notificationStore.notifyQuizLive(quiz.title);
            }
            // Notify if quiz is starting within 1 hour
            else if (timeUntilStart <= oneHour && timeUntilStart > 0) {
              notificationStore.notifyQuizStartingSoon(quiz.title);
            }
          }
        });
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const attemptedIds = new Set(attempts.map(a => a.quizId));
  
  // Categorize quizzes by live status
  const now = new Date();
  const liveQuizzes = quizzes.filter(q => {
    if (!q.scheduledDateTime) return false;
    const scheduled = new Date(q.scheduledDateTime);
    const endTime = new Date(scheduled.getTime() + q.durationMinutes * 60 * 1000);
    return scheduled <= now && now < endTime;
  });
  
  const upcomingQuizzes = quizzes.filter(q => {
    if (!q.scheduledDateTime) return false;
    const scheduled = new Date(q.scheduledDateTime);
    return scheduled > now;
  });
  
  const pastQuizzes = quizzes.filter(q => {
    if (!q.scheduledDateTime) return false;
    const scheduled = new Date(q.scheduledDateTime);
    const endTime = new Date(scheduled.getTime() + q.durationMinutes * 60 * 1000);
    return now >= endTime;
  });
  
  // Available = live quizzes not yet attempted
  const available = liveQuizzes.filter(q => !attemptedIds.has(q.id));
  const completed = quizzes.filter(q => attemptedIds.has(q.id));

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
          <div style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4, display:"flex", alignItems:"center", gap:8 }}>Hey {user?.name || "Candidate"}! <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ width:24, height:24 }}><path d="M12 2v20M2 12h20M4 4l16 16M20 4l-16 16"/></svg></div>
          <div style={{ fontSize:14, color:"#a8c0e0" }}>
            You have <span style={{ color:C.orange, fontWeight:700 }}>{available.length} quiz{available.length !== 1 ? "zes" : ""} available to attempt right now</span> (live quizzes only).
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        {[
          { icon:"quizzes", label:"Total Quizzes",  value:quizzes.length,        color:C.blue },
          { icon:"completed", label:"Completed",      value:completed.length,      color:"#16a34a" },
          { icon:"live", label:"Live Now",      value:available.length,      color:"#dc2626" },
          { icon:"upcoming", label:"Upcoming",       value:upcomingQuizzes.length, color:C.orange },
        ].map(s => (
          <div key={s.label} style={{ background:C.card, borderRadius:16, padding:"16px 20px", border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}12`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}>{getDashboardIcon(s.icon)}</div>
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
        /* Three columns */
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18 }}>
          {/* Live Quizzes */}
          <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#dc2626", display:"inline-block" }}/>
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ width:16, height:16 }}><circle cx="12" cy="12" r="10"/></svg>
              Live Now
            </div>
            {available.length === 0 ? (
              <div style={{ fontSize:13, color:C.muted, padding:"12px 0" }}>No live quizzes available right now.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                {available.map(q => {
                  const qDate = new Date(q.scheduledDateTime);
                  const dateStr = qDate.toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" });
                  const timeStr = qDate.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
                  return (
                  <div key={q.id} style={{ padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{q.title}</div>
                      <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:"#fff3ee", color:C.orange, whiteSpace:"nowrap", flexShrink:0 }}>{q.durationMinutes}m</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                      <Badge subject={q.subject} />
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:1 }}>
                        <span style={{ fontSize:10, fontWeight:600, color:C.blue }}>{dateStr}</span>
                        <span style={{ fontSize:9, color:C.muted, display:"flex", alignItems:"center", gap:3 }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:12, height:12 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {timeStr}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/candidate/quiz/${q.id}`)}
                      style={{ padding:"6px 16px", borderRadius:10, background:C.blue, color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:C.font, width:"100%", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:14, height:14 }}><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      Start Quiz
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Quizzes */}
          <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.orange, display:"inline-block" }}/>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2" style={{ width:16, height:16 }}><path d="M12 2v20M2 12h20M4 4l16 16M20 4l-16 16"/></svg>
              Upcoming
            </div>
            {upcomingQuizzes.length === 0 ? (
              <div style={{ fontSize:13, color:C.muted, padding:"12px 0" }}>No upcoming quizzes scheduled.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                {upcomingQuizzes.map(q => {
                  const qDate = new Date(q.scheduledDateTime);
                  const dateStr = qDate.toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" });
                  const timeStr = qDate.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
                  return (
                  <div key={q.id} style={{ padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:"#fffbeb" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{q.title}</div>
                      <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:"#fff3ee", color:C.orange, whiteSpace:"nowrap", flexShrink:0 }}>{q.durationMinutes}m</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <Badge subject={q.subject} />
                      <CountdownTimer scheduledDateTime={q.scheduledDateTime} />
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:1, marginBottom:6, paddingBottom:6, borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:10, fontWeight:600, color:C.blue }}>{dateStr}</span>
                      <span style={{ fontSize:9, color:C.muted, display:"flex", alignItems:"center", gap:3 }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:12, height:12 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {timeStr}</span>
                    </div>
                    <button disabled style={{ padding:"6px 16px", borderRadius:10, background:"#e5e7eb", color:"#9ca3af", border:"none", fontSize:12, fontWeight:700, cursor:"not-allowed", fontFamily:C.font, width:"100%" }}>
                      Coming Soon...
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed */}
          <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.blue, display:"inline-block" }}/>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" style={{ width:16, height:16 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4l-8.97 9.97-4.22-3.604"/></svg>
              Completed
            </div>
            {completed.length === 0 ? (
              <div style={{ fontSize:13, color:C.muted, padding:"12px 0" }}>No completed quizzes yet.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                {completed.map(q => {
                  const att  = attempts.find(a => a.quizId === q.id);
                  const pct  = att?.percentage ?? 0;
                  const pass = pct >= 60;
                  const qDate = new Date(q.scheduledDateTime);
                  const dateStr = qDate.toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" });
                  const timeStr = qDate.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
                  return (
                    <div key={q.id} style={{ padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{q.title}</div>
                        <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, whiteSpace:"nowrap", flexShrink:0, background:pass?"#f0fdf4":"#fef2f2", color:pass?"#16a34a":"#dc2626", display:"flex", alignItems:"center", gap:4 }}>{pass ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:14, height:14 }}><path d="M5 13l4 4L19 7"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:14, height:14 }}><path d="M6 18L18 6M6 6l12 12"/></svg>} {pass ? "Pass" : "Fail"}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <div style={{ flex:1, height:5, borderRadius:999, background:C.border, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:pass?"#16a34a":"#dc2626" }}/>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:pass?"#16a34a":"#dc2626", minWidth:44 }}>{att?.score}/{att?.totalQuestions}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <Badge subject={q.subject} />
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:1 }}>
                          <span style={{ fontSize:10, fontWeight:600, color:C.blue }}>{dateStr}</span>
                          <span style={{ fontSize:9, color:C.muted, display:"flex", alignItems:"center", gap:3 }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:12, height:12 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {timeStr}</span>
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:pass?"#16a34a":"#dc2626" }}>{pct.toFixed(1)}%</span>
                      </div>
                      <button onClick={() => navigate(`/candidate/results?quizId=${q.id}`)}
                        style={{ padding:"6px 14px", borderRadius:8, background:C.blue, color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:C.font, width:"100%", transition:"all 0.2s", opacity:0.9, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                        onMouseEnter={(e) => e.target.style.opacity = "1"}
                        onMouseLeave={(e) => e.target.style.opacity = "0.9"}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:14, height:14 }}><path d="M3 3v18h18M3 18l4-5 4 3 5-7 5 3"/></svg>
                        View Result
                      </button>
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
