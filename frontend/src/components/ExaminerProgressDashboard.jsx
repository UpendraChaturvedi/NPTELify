// ExaminerProgressDashboard.jsx
import { useState, useEffect } from "react";
import { getExaminerStats } from "../api/quizApi";

const C = {
  navy:"#1a3a6b",blue:"#2563eb",orange:"#f97316",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",
  bg:"#f5f8ff",card:"#ffffff",altBg:"#eaf0fb",border:"#dce8fb",muted:"#7a8faf",body:"#4a6490",
  font:"'DM Sans','Segoe UI',sans-serif",
};

function RadialRing({ value, size=72, stroke=9, color }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, filled=(value/100)*circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round"
        style={{ transform:"rotate(-90deg)",transformOrigin:"50% 50%" }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" style={{ fontSize:12,fontWeight:900,fill:C.navy,fontFamily:C.font }}>{value}%</text>
    </svg>
  );
}

function MiniSparkline({ scores, color }) {
  const W=100, H=36, pad=4;
  const maxV=100, step=(W-pad*2)/(Math.max(1, scores.length-1));
  const sy=v => H-pad-(v/maxV)*(H-pad*2);
  const pts=scores.length === 1 
    ? `${pad+40},${sy(scores[0])}` 
    : scores.map((s,i)=>`${pad+i*step},${sy(s)}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {scores.length > 1 && <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>}
      {scores.map((s,i)=>{
        const x = scores.length === 1 ? pad+40 : pad+(i*step);
        const y = sy(s);
        return <circle key={i} cx={x} cy={y} r={2.5} fill={color}/>;
      })}
    </svg>
  );
}

export default function ExaminerProgressDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getExaminerStats();
        setStats(data);
      } catch (e) {
        setError(e.message || "Failed to load statistics");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh",fontFamily:C.font }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:16,fontWeight:700,color:C.navy }}>Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh",fontFamily:C.font }}>
        <div style={{ textAlign:"center",color:C.red }}>
          <div style={{ fontSize:16,fontWeight:700 }}>Error loading statistics</div>
          <div style={{ fontSize:12,marginTop:8 }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh",fontFamily:C.font }}>
        <div style={{ textAlign:"center",color:C.muted }}>
          <div style={{ fontSize:16,fontWeight:700,color:C.navy }}>No data available</div>
          <div style={{ fontSize:12,marginTop:8 }}>Create and evaluate quizzes to see statistics</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20,fontFamily:C.font }}>

      {/* Radial summary */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
        {[
          { label:"Class Avg Score",   value:Math.round(stats.classAverage), color:C.blue   },
          { label:"Avg Pass Rate",     value:Math.round(stats.passRate),     color:C.green  },
          { label:"Submission Rate",   value:Math.round(stats.submissionRate), color:C.orange },
          { label:"Engagement Score",  value:Math.round(stats.engagementScore), color:C.purple },
        ].map(s=>(
          <div key={s.label} style={{ background:C.card,borderRadius:16,padding:"20px",border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:14 }}>
            <RadialRing value={s.value} color={s.color}/>
            <div>
              <div style={{ fontSize:12,fontWeight:800,color:C.navy }}>{s.label}</div>
              <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>All quizzes</div>
            </div>
          </div>
        ))}
      </div>

      {/* Subject avg */}
      {stats.subjects && stats.subjects.length > 0 && (
        <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"22px 24px" }}>
          <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:18 }}>Subject-wise Class Average</div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {stats.subjects.map((s,i)=>{
              const up=s.trend.startsWith("+");
              return (
                <div key={i}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                    <span style={{ fontSize:13,fontWeight:700,color:C.navy }}>{s.subject}</span>
                    <div style={{ display:"flex",gap:14,alignItems:"center" }}>
                      <span style={{ fontSize:12,fontWeight:700,color:up?C.green:C.red }}>{s.trend}</span>
                      <span style={{ fontSize:12,fontWeight:800,color:s.color }}>{Math.round(s.averageScore)}% avg</span>
                    </div>
                  </div>
                  <div style={{ height:8,borderRadius:999,background:C.border,overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(100, s.averageScore)}%`,height:"100%",borderRadius:999,background:s.color }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz trend */}
      {stats.quizzes && stats.quizzes.length > 0 && (
        <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"22px 24px" }}>
          <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:18 }}>Quiz-wise Score Trend (Class Avg)</div>
          {(() => {
            const avgPerQ = stats.quizzes.map(q => Math.round(q.averageScore));
            const W=480,H=110,padL=28,padB=24;
            const step=avgPerQ.length > 1 ? (W-padL)/(avgPerQ.length-1) : W/2;
            const sy=v=>H-padB-(v/100)*(H-padB-10);
            const pts=avgPerQ.length === 1 
              ? `${padL+W/2},${sy(avgPerQ[0])}` 
              : avgPerQ.map((v,i)=>`${padL+i*step},${sy(v)}`).join(" ");
            return (
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
                {[0,25,50,75,100].map(v=>(
                  <g key={v}>
                    <line x1={padL} y1={sy(v)} x2={W} y2={sy(v)} stroke={C.border} strokeWidth="1" strokeDasharray="3 3"/>
                    <text x={padL-4} y={sy(v)+4} textAnchor="end" style={{ fontSize:9,fill:C.muted,fontFamily:C.font }}>{v}</text>
                  </g>
                ))}
                {avgPerQ.length > 1 && <polyline points={pts} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>}
                {avgPerQ.map((v,i)=>{
                  const x=avgPerQ.length === 1 ? padL+W/2 : padL+i*step, y=sy(v);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={5} fill={C.blue}/>
                      <text x={x} y={y-10} textAnchor="middle" style={{ fontSize:10,fontWeight:700,fill:C.navy,fontFamily:C.font }}>{v}%</text>
                      <text x={x} y={H-4} textAnchor="middle" style={{ fontSize:9,fill:C.muted,fontFamily:C.font }}>{stats.quizzes[i].title.length > 10 ? stats.quizzes[i].title.substring(0,10)+"..." : stats.quizzes[i].title}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}
        </div>
      )}

      {/* Student leaderboard */}
      {stats.studentPerformance && stats.studentPerformance.length > 0 && (
        <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,overflow:"hidden" }}>
          <div style={{ padding:"16px 22px",borderBottom:`1.5px solid ${C.border}`,fontSize:14,fontWeight:800,color:C.navy }}>Student Performance Tracker</div>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.altBg }}>
                {["#","Student","Email","Scores Trend","Avg Score","Trend","Status"].map(h=>(
                  <th key={h} style={{ padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.studentPerformance.map((s,i)=>{
                const avg=Math.round(s.averageScore);
                const pass=avg>=60;
                const up=s.trend.startsWith("+");
                const rankColors=[C.orange,"#94a3b8","#cd7f32"];
                return (
                  <tr key={s.candidateId} style={{ borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.bg }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ width:24,height:24,borderRadius:"50%",background:i<3?`${rankColors[i]}18`:C.altBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:i<3?rankColors[i]:C.muted }}>{i+1}</div>
                    </td>
                    <td style={{ padding:"12px 16px",fontSize:13,fontWeight:700,color:C.navy }}>{s.candidateName}</td>
                    <td style={{ padding:"12px 16px",fontSize:12,color:C.muted }}>{s.email}</td>
                    <td style={{ padding:"12px 16px" }}><MiniSparkline scores={s.scoresTrend.length > 0 ? s.scoresTrend : [0]} color={pass?C.blue:C.red}/></td>
                    <td style={{ padding:"12px 16px",fontSize:14,fontWeight:900,color:pass?C.green:C.red }}>{avg}%</td>
                    <td style={{ padding:"12px 16px",fontSize:12,fontWeight:700,color:up?C.green:C.red }}>{s.trend}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:pass?"#f0fdf4":"#fef2f2",color:pass?C.green:C.red }}>{pass?"On Track":"Needs Help"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}