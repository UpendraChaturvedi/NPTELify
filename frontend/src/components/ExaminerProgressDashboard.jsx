// ExaminerProgressDashboard.jsx
const C = {
  navy:"#1a3a6b",blue:"#2563eb",orange:"#f97316",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",
  bg:"#f5f8ff",card:"#ffffff",altBg:"#eaf0fb",border:"#dce8fb",muted:"#7a8faf",body:"#4a6490",
  font:"'DM Sans','Segoe UI',sans-serif",
};

const STUDENTS = [
  { name:"Priya Sharma",    id:"2315000421", scores:[88,92,75,85,90], trend:"+4%" },
  { name:"Arjun Verma",     id:"2315000432", scores:[70,72,68,75,78], trend:"+6%" },
  { name:"Sneha Patel",     id:"2315000445", scores:[55,60,58,62,65], trend:"+8%" },
  { name:"Rahul Gupta",     id:"2315000458", scores:[90,88,92,95,91], trend:"+1%" },
  { name:"Ananya Singh",    id:"2315000462", scores:[45,48,52,55,58], trend:"+10%" },
  { name:"Vikram Nair",     id:"2315000475", scores:[78,82,80,85,88], trend:"+5%" },
];

const QUIZZES_LABELS = ["Quiz 1","Quiz 2","Quiz 3","Quiz 4","Quiz 5"];
const SUBJ_AVG       = [
  { subject:"Python for DS",    avg:78, trend:"+3%", color:C.blue },
  { subject:"Machine Learning", avg:72, trend:"-1%", color:C.orange },
  { subject:"Cloud Computing",  avg:61, trend:"+5%", color:C.green },
  { subject:"DBMS",             avg:69, trend:"+2%", color:"#9333ea" },
  { subject:"Operating Systems",avg:83, trend:"+7%", color:"#ea580c" },
];

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
  const maxV=100, step=(W-pad*2)/(scores.length-1);
  const sy=v => H-pad-(v/maxV)*(H-pad*2);
  const pts=scores.map((s,i)=>`${pad+i*step},${sy(s)}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {scores.map((s,i)=><circle key={i} cx={pad+i*step} cy={sy(s)} r={2.5} fill={color}/>)}
    </svg>
  );
}

export default function ExaminerProgressDashboard() {
  const overallAvg = Math.round(SUBJ_AVG.reduce((a,s)=>a+s.avg,0)/SUBJ_AVG.length);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20,fontFamily:C.font }}>

      {/* Radial summary */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
        {[
          { label:"Class Avg Score",   value:overallAvg, color:C.blue   },
          { label:"Avg Pass Rate",     value:77,         color:C.green  },
          { label:"Submission Rate",   value:93,         color:C.orange },
          { label:"Engagement Score",  value:82,         color:C.purple },
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
      <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"22px 24px" }}>
        <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:18 }}>Subject-wise Class Average</div>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {SUBJ_AVG.map((s,i)=>{
            const up=s.trend.startsWith("+");
            return (
              <div key={i}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                  <span style={{ fontSize:13,fontWeight:700,color:C.navy }}>{s.subject}</span>
                  <div style={{ display:"flex",gap:14,alignItems:"center" }}>
                    <span style={{ fontSize:12,fontWeight:700,color:up?C.green:C.red }}>{s.trend}</span>
                    <span style={{ fontSize:12,fontWeight:800,color:s.color }}>{s.avg}% avg</span>
                  </div>
                </div>
                <div style={{ height:8,borderRadius:999,background:C.border,overflow:"hidden" }}>
                  <div style={{ width:`${s.avg}%`,height:"100%",borderRadius:999,background:s.color }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz trend */}
      <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"22px 24px" }}>
        <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:18 }}>Quiz-wise Score Trend (Class Avg)</div>
        {(() => {
          const avgPerQ = QUIZZES_LABELS.map((_,qi) => Math.round(STUDENTS.reduce((a,s)=>a+(s.scores[qi]||0),0)/STUDENTS.length));
          const W=480,H=110,padL=28,padB=24;
          const step=(W-padL)/(avgPerQ.length-1), sy=v=>H-padB-(v/100)*(H-padB-10);
          const pts=avgPerQ.map((v,i)=>`${padL+i*step},${sy(v)}`).join(" ");
          return (
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
              {[0,25,50,75,100].map(v=>(
                <g key={v}>
                  <line x1={padL} y1={sy(v)} x2={W} y2={sy(v)} stroke={C.border} strokeWidth="1" strokeDasharray="3 3"/>
                  <text x={padL-4} y={sy(v)+4} textAnchor="end" style={{ fontSize:9,fill:C.muted,fontFamily:C.font }}>{v}</text>
                </g>
              ))}
              <polyline points={pts} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
              {avgPerQ.map((v,i)=>{
                const x=padL+i*step, y=sy(v);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={5} fill={C.blue}/>
                    <text x={x} y={y-10} textAnchor="middle" style={{ fontSize:10,fontWeight:700,fill:C.navy,fontFamily:C.font }}>{v}%</text>
                    <text x={x} y={H-4} textAnchor="middle" style={{ fontSize:9,fill:C.muted,fontFamily:C.font }}>{QUIZZES_LABELS[i]}</text>
                  </g>
                );
              })}
            </svg>
          );
        })()}
      </div>

      {/* Student leaderboard */}
      <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,overflow:"hidden" }}>
        <div style={{ padding:"16px 22px",borderBottom:`1.5px solid ${C.border}`,fontSize:14,fontWeight:800,color:C.navy }}>Student Performance Tracker</div>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.altBg }}>
              {["#","Student","ID","Scores Trend","Avg Score","Trend","Status"].map(h=>(
                <th key={h} style={{ padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...STUDENTS].sort((a,b)=>{
              const avgA=a.scores.reduce((s,v)=>s+v,0)/a.scores.length;
              const avgB=b.scores.reduce((s,v)=>s+v,0)/b.scores.length;
              return avgB-avgA;
            }).map((s,i)=>{
              const avg=Math.round(s.scores.reduce((a,v)=>a+v,0)/s.scores.length);
              const pass=avg>=60;
              const up=s.trend.startsWith("+");
              const rankColors=[C.orange,"#94a3b8","#cd7f32"];
              return (
                <tr key={s.id} style={{ borderBottom:`1px solid ${C.border}`,background:i%2===0?C.card:C.bg }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ width:24,height:24,borderRadius:"50%",background:i<3?`${rankColors[i]}18`:C.altBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:i<3?rankColors[i]:C.muted }}>{i+1}</div>
                  </td>
                  <td style={{ padding:"12px 16px",fontSize:13,fontWeight:700,color:C.navy }}>{s.name}</td>
                  <td style={{ padding:"12px 16px",fontSize:12,color:C.muted }}>{s.id}</td>
                  <td style={{ padding:"12px 16px" }}><MiniSparkline scores={s.scores} color={pass?C.blue:C.red}/></td>
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
    </div>
  );
}