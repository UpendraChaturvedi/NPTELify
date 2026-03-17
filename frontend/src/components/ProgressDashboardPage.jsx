import { useState, useEffect } from "react";
import { getMyAttempts } from "../api/quizApi";

const C = {
  navy: "#1a3a6b", blue: "#2563eb", orange: "#f97316",
  bg: "#f5f8ff", card: "#ffffff", altBg: "#eaf0fb",
  border: "#dce8fb", muted: "#7a8faf", body: "#4a6490",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

const BADGES = [
  { icon:"target", label:"First Quiz",    earned:true  },
  { icon:"flame", label:"5-Quiz Streak", earned:true  },
  { icon:"star", label:"90%+ Score",    earned:false },
  { icon:"trophy", label:"Top 10%",       earned:false },
  { icon:"book", label:"5 Subjects",    earned:true  },
  { icon:"lightbulb", label:"Perfect Score", earned:false },
];

const getProgressIcon = (type) => {
  const icons = {
    target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    flame: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M12 2c1 0 2 1 2 3 0 1-1 2-1 4 0 2 1 3 1 5 0 3-2 5-2 5 0 0-2-2-2-5 0-2 1-3 1-4 0-2-1-3-1-4 0-2 1-3 2-3z"/></svg>,
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><polygon points="12 2 15.09 10.26 24 10.27 17.18 16.91 20.27 25.07 12 19.39 3.73 25.07 6.82 16.91 0 10.27 8.91 10.26 12 2"/></svg>,
    trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M6 9H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2v-9a2 2 0 00-2-2h-2M6 5h12M9 5a3 3 0 016 0M9 5a3 3 0 011 2.83V9M15 5a3 3 0 00-1 2.83V9M12 12v3"/></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 7H20v10a2 2 0 01-2 2H6.5a2 2 0 01-2-2V4.5z"/></svg>,
    lightbulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  };
  return icons[type] || icons.target;
};

function RadialProgress({ value, size=80, stroke=10, color }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, filled=(value/100)*circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round"
        style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%" }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" style={{ fontSize:13, fontWeight:900, fill:C.navy, fontFamily:C.font }}>{value}%</text>
    </svg>
  );
}

function LineChart({ scores }) {
  const W=340,H=100,padL=24,padB=20,maxV=100;
  if (!scores || scores.length < 2) return <div style={{ color:C.muted, fontSize:13 }}>Not enough data yet</div>;
  const step=(W-padL)/(scores.length-1);
  const sy=v=>H-padB-(v/maxV)*(H-padB-8);
  const pts=scores.map((d,i)=>`${padL+i*step},${sy(d.s)}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {scores.map((d,i)=>{
        const x=padL+i*step, y=sy(d.s);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={C.blue}/>
            <text x={x} y={H-4} textAnchor="middle" style={{ fontSize:9, fill:C.muted, fontFamily:C.font }}>{d.w}</text>
            <text x={x} y={y-8} textAnchor="middle" style={{ fontSize:9, fontWeight:700, fill:C.navy, fontFamily:C.font }}>{d.s}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ProgressDashboardPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyAttempts()
      .then(data => { setAttempts(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding:40, textAlign:"center", color:C.muted }}>Loading progress…</div>;
  if (error)   return <div style={{ padding:40, textAlign:"center", color:"#dc2626" }}>Error: {error}</div>;

  const total = attempts.length;
  const passed = attempts.filter(a => a.percentage >= 60).length;
  const overall = total > 0 ? Math.round(attempts.reduce((s,a) => s+a.percentage, 0) / total) : 0;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Subject grouping
  const subjMap = {};
  attempts.forEach(a => {
    if (!subjMap[a.subject]) subjMap[a.subject] = [];
    subjMap[a.subject].push(a.percentage);
  });
  const COLS=[C.blue,C.orange,"#16a34a","#9333ea","#ea580c"];
  const subjectData = Object.entries(subjMap).map(([name, vals]) => ({
    name,
    completed: vals.length,
    avgScore: Math.round(vals.reduce((s,v) => s+v, 0) / vals.length),
  }));

  // Chronological weekly scores (group by week index)
  const sorted = [...attempts].sort((a,b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  const weeklyScores = sorted.map((a, i) => ({ w: `Q${i+1}`, s: Math.round(a.percentage) })).slice(-8);

  // Badge logic
  const earnedBadges = BADGES.map(b => {
    if (b.label === "First Quiz")    return { ...b, earned: total >= 1 };
    if (b.label === "5-Quiz Streak") return { ...b, earned: total >= 5 };
    if (b.label === "90%+ Score")    return { ...b, earned: attempts.some(a => a.percentage >= 90) };
    if (b.label === "5 Subjects")    return { ...b, earned: Object.keys(subjMap).length >= 5 };
    if (b.label === "Perfect Score") return { ...b, earned: attempts.some(a => a.percentage === 100) };
    return b;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Radial cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { v:overall,  label:"Overall Progress",  sub:`Across ${Object.keys(subjMap).length} subject(s)`, color:C.blue },
          { v:total>0?Math.min(Math.round((total/Math.max(total,1))*100),100):0, label:"Quizzes Completed", sub:`${total} attempt(s) total`, color:C.orange },
          { v:passRate, label:"Pass Rate",          sub:`${passed} of ${total} passed`,                     color:"#16a34a" },
        ].map(s=>(
          <div key={s.label} style={{ background:C.card, borderRadius:16, padding:"20px", border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", gap:16 }}>
            <RadialProgress value={s.v} size={72} stroke={9} color={s.color}/>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{s.label}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Trend */}
      <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"22px 24px" }}>
        <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:18 }}>Score Trend (last 8 attempts)</div>
        <LineChart scores={weeklyScores}/>
      </div>
      {/* Subject bars */}
      <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px 24px" }}>
        <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:16 }}>Subject-wise Progress</div>
        {subjectData.length === 0
          ? <div style={{ color:C.muted, fontSize:13 }}>No attempts yet</div>
          : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {subjectData.map((s,i)=>{
                const col=COLS[i%COLS.length];
                return (
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>{s.name}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:col }}>{s.avgScore}% avg</span>
                        <span style={{ fontSize:12, color:C.muted }}>{s.completed} attempt(s)</span>
                      </div>
                    </div>
                    <div style={{ height:8, borderRadius:999, background:C.border, overflow:"hidden" }}>
                      <div style={{ width:`${s.avgScore}%`, height:"100%", borderRadius:999, background:col }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }
      </div>
      {/* Badges */}
      <div style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:"20px 24px" }}>
        <div style={{ fontSize:14, fontWeight:800, color:C.navy, marginBottom:16 }}>Achievements</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
          {earnedBadges.map((b,i)=>(
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"14px 8px", borderRadius:14, border:`1.5px solid ${b.earned?C.blue:C.border}`, background:b.earned?C.altBg:C.bg, opacity:b.earned?1:0.45 }}>
              <span style={{ fontSize:26, color:b.earned?C.blue:C.muted, display:"flex", alignItems:"center", justifyContent:"center", width:28, height:28 }}>{getProgressIcon(b.icon)}</span>
              <span style={{ fontSize:11, fontWeight:700, color:b.earned?C.navy:C.muted, textAlign:"center", lineHeight:1.3 }}>{b.label}</span>
              {b.earned && <span style={{ fontSize:10, color:C.blue, fontWeight:700 }}>Earned</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
