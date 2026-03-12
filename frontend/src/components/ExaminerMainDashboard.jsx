// ExaminerMainDashboard.jsx
import { useState, useEffect } from "react";
import { getMyQuizzes } from "../api/quizApi";
import { useAuth } from "../context/AuthContext";

const C = {
  navy:"#1a3a6b",blue:"#2563eb",orange:"#f97316",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",
  bg:"#f5f8ff",card:"#ffffff",altBg:"#eaf0fb",border:"#dce8fb",muted:"#7a8faf",body:"#4a6490",
  font:"'DM Sans','Segoe UI',sans-serif",
};

const SUBJ_COLORS = {
  default: { bg:C.altBg, color:C.navy },
};
function subjectColor(subject) {
  const palette = [
    { bg:"#eaf0fb", color:C.blue },
    { bg:"#fff3ee", color:C.orange },
    { bg:"#f0fdf4", color:C.green },
    { bg:"#fdf4ff", color:"#9333ea" },
    { bg:"#fff7ed", color:"#ea580c" },
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function Badge({ subject }) {
  const s = subjectColor(subject);
  return <span style={{ padding:"2px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:s.bg,color:s.color }}>{subject}</span>;
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background:C.card,borderRadius:16,padding:"18px 20px",border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:14,flex:1,minWidth:0 }}>
      <div style={{ width:44,height:44,borderRadius:12,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:24,fontWeight:900,color,lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{label}</div>
      </div>
    </div>
  );
}

function QuizCard({ quiz }) {
  const durationLabel = `${quiz.durationMinutes} min`;
  const qCount = quiz.questions?.length || 0;
  const date = quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
  return (
    <div style={{ padding:"13px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,background:C.bg }}>
      <div style={{ display:"flex",justifyContent:"space-between",gap:8,marginBottom:7 }}>
        <div style={{ fontSize:13,fontWeight:700,color:C.navy,lineHeight:1.35 }}>{quiz.title}</div>
        <span style={{ padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:"#fff3ee",color:C.orange,whiteSpace:"nowrap",flexShrink:0 }}>{durationLabel}</span>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6 }}>
        <Badge subject={quiz.subject} />
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <span style={{ fontSize:11,color:C.muted }}>{date}</span>
          <span style={{ fontSize:11,fontWeight:700,color:C.blue }}>📝 {qCount} Qs</span>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"40px",color:C.muted,fontSize:14 }}>
      Loading quizzes…
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div style={{ padding:"16px",borderRadius:12,background:"#fef2f2",border:`1.5px solid #fca5a5`,color:"#991b1b",fontSize:13 }}>
      {message}
    </div>
  );
}

export default function ExaminerMainDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    getMyQuizzes()
      .then(data => { setQuizzes(data); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  const totalQuestions = quizzes.reduce((a, q) => a + (q.questions?.length || 0), 0);
  // Split: recent (last 30 days) vs older
  const now = Date.now();
  const recent = quizzes.filter(q => q.createdAt && (now - new Date(q.createdAt).getTime()) < 30*24*60*60*1000);
  const older  = quizzes.filter(q => !q.createdAt || (now - new Date(q.createdAt).getTime()) >= 30*24*60*60*1000);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20,fontFamily:C.font }}>

      {/* Hero Banner */}
      <div style={{ borderRadius:18,padding:"24px 32px",background:C.navy,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-40,right:-40,width:220,height:220,borderRadius:"50%",background:C.orange,opacity:.1 }}/>
        <div style={{ position:"absolute",bottom:-50,left:180,width:160,height:160,borderRadius:"50%",background:C.blue,opacity:.15 }}/>
        <div style={{ position:"absolute",top:10,right:220,width:100,height:100,borderRadius:"50%",background:C.purple,opacity:.12 }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:11,color:"#a8c0e0",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6 }}>Examiner Portal</div>
          <div style={{ fontSize:24,fontWeight:900,color:"#fff",marginBottom:4 }}>Welcome back, {user?.name || "Examiner"}! 🎓</div>
          <div style={{ fontSize:14,color:"#a8c0e0" }}>
            You have <span style={{ color:C.orange,fontWeight:700 }}>{quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} created</span> in total.
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
        <StatCard icon="📋" label="Total Quizzes Created"  value={quizzes.length} color={C.blue} />
        <StatCard icon="📝" label="Total Questions"        value={totalQuestions}  color={C.purple} />
        <StatCard icon="🗓️" label="Created This Month"    value={recent.length}   color={C.green} />
        <StatCard icon="📂" label="Older Quizzes"          value={older.length}    color={C.orange} />
      </div>

      {/* Two-column */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>

        {/* Recent */}
        <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"20px" }}>
          <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:14,display:"flex",alignItems:"center",gap:7 }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:C.orange,display:"inline-block" }}/>
            Recent Quizzes (30 days)
          </div>
          {loading ? <LoadingState/> : error ? <ErrorState message={error}/> : recent.length === 0 ? (
            <div style={{ fontSize:13,color:C.muted,padding:"12px 0" }}>No quizzes created in the last 30 days.</div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {recent.map(q => <QuizCard key={q.id} quiz={q}/>)}
            </div>
          )}
        </div>

        {/* Older */}
        <div style={{ background:C.card,borderRadius:18,border:`1.5px solid ${C.border}`,padding:"20px" }}>
          <div style={{ fontSize:14,fontWeight:800,color:C.navy,marginBottom:14,display:"flex",alignItems:"center",gap:7 }}>
            <span style={{ width:8,height:8,borderRadius:"50%",background:C.blue,display:"inline-block" }}/>
            All Other Quizzes
          </div>
          {loading ? <LoadingState/> : error ? <ErrorState message={error}/> : older.length === 0 ? (
            <div style={{ fontSize:13,color:C.muted,padding:"12px 0" }}>No older quizzes found.</div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:10,maxHeight:420,overflowY:"auto" }}>
              {older.map(q => <QuizCard key={q.id} quiz={q}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}