import { useState } from "react";
import ExaminerCreateQuizDashboard from "../components/ExaminerCreateQuizDashboard";
import ExaminerResultDashboard from "../components/ExaminerResultDashboard";
import ExaminerProgressDashboard from "../components/ExaminerProgressDashboard";
import ExaminerMainDashboard from "../components/ExaminerMainDashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   

/* ─── Theme ─────────────────────────────────────────── */
const C = {
  navy:   "#1a3a6b",
  blue:   "#2563eb",
  orange: "#f97316",
  green:  "#16a34a",
  red:    "#dc2626",
  purple: "#7c3aed",
  bg:     "#f0f4f8",
  card:   "#ffffff",
  altBg:  "#eaf0fb",
  border: "#dce8fb",
  muted:  "#7a8faf",
  body:   "#4a6490",
  sidebar:"#ffffff",
  font:   "'DM Sans','Segoe UI',sans-serif",
};

/* ─── Nav Items ──────────────────────────────────────── */
const NAV = [
  { id:"main",        label:"Main Dashboard",       icon:"🏠" },
  { id:"create",      label:"Create Quiz",           icon:"✏️" },
  { id:"results",     label:"Results Dashboard",     icon:"📊" },
  { id:"progress",    label:"Progress Dashboard",    icon:"📈" },
];

/* ─── Shared subject colors ──────────────────────────── */
const SUBJ = {
  "Python for DS":    { bg:"#eaf0fb", color:"#2563eb" },
  "Machine Learning": { bg:"#fff3ee", color:"#f97316" },
  "Cloud Computing":  { bg:"#f0fdf4", color:"#16a34a" },
  "DBMS":             { bg:"#fdf4ff", color:"#9333ea" },
  "Oper. Systems":    { bg:"#fff7ed", color:"#ea580c" },
};
function SBadge({ s }) {
  const c = SUBJ[s] || { bg:C.altBg, color:C.navy };
  return <span style={{ padding:"2px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:c.bg, color:c.color, whiteSpace:"nowrap" }}>{s}</span>;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
function Sidebar({ active, onSelect, userName, onLogout }) {
    const navigate = useNavigate();
  const [hov, setHov] = useState(null);
  return (
    <aside style={{ width:240, background:C.sidebar, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, height:"100vh", overflowY:"auto", fontFamily:C.font }}>
      
      {/* Logo */}
          <button onClick={() => navigate("/examiner")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <img
                src="/logo_half.png"
                alt="logo"
                style={{
                    width: 36,
                    height: 36,
                    objectFit: "contain"
                }}
                />
            <span style={{ fontWeight:900, fontSize:22, letterSpacing:"-0.5px" }}>
              <span style={{ color:"#1a3a6b" }}>NPTEL</span><span style={{ color:"#f97316" }}>ify</span>
            </span>
          </button>

      {/* Profile */}
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", border:`2px solid ${C.blue}`, background:C.altBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.5" style={{ width:34, height:34 }}>
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontWeight:800, fontSize:13, color:C.navy }}>{userName}</div>
          <div style={{ fontSize:11, color:C.muted }}>Examiner</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 10px" }}>
        {NAV.map(item => {
          const isA = active === item.id;
          const isH = hov === item.id;
          return (
            <button key={item.id}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}
              style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer", textAlign:"left", width:"100%", fontFamily:C.font, fontSize:13, fontWeight:isA?700:500, transition:"all 0.15s",
                background: isA ? C.altBg : isH ? "#f5f8ff" : "transparent",
                color:      isA ? C.blue  : isH ? C.navy    : C.body,
                borderLeft: isA ? `3px solid ${C.blue}` : "3px solid transparent",
                marginBottom:2,
              }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Help */}
      <div style={{ padding:"14px 20px", borderTop:`2px solid ${C.border}` }}>
        <button
            onClick={() => { onLogout(); navigate("/login"); }}
            style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 900,
            color: C.red
            }}
        >
            <div
            style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.red}
                strokeWidth="2"
                style={{ width: 14, height: 14 }}
            >
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            </div>

            <span>Log Out</span>
        </button>
        </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════
   TOP NAV BAR
══════════════════════════════════════════════════════ */
function Topbar({ activePage, userName }) {
  const titles = { main:"Main Dashboard", create:"Create Quiz", results:"Results Dashboard", progress:"Progress Dashboard", assignments:"Assignment Dashboard" };
  const now = new Date();
  const ds  = now.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) + ", " +
               now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
  return (
    <div style={{ height:52, background:C.card, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0, fontFamily:C.font }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:15, fontWeight:800, color:C.navy }}>{titles[activePage]}</span>
        <span style={{ fontSize:11, color:C.muted, background:C.bg, padding:"3px 10px", borderRadius:999, border:`1px solid ${C.border}` }}>{ds}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ position:"relative" }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:C.altBg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" style={{ width:16, height:16 }}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <div style={{ position:"absolute", top:5, right:5, width:8, height:8, borderRadius:"50%", background:C.orange, border:`2px solid ${C.card}` }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#fff3ee", border:`1.5px solid #fde8d4`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2" style={{ width:16, height:16 }}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:C.navy }}>{userName}</div>
            <div style={{ fontSize:10, color:C.muted }}>Examiner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   RIGHT CALENDAR PANEL
══════════════════════════════════════════════════════ */
function CalendarPanel() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS   = ["M","T","W","T","F","S","S"];

  // Days in month, first day offset (Mon=0)
  const dim    = new Date(year, month+1, 0).getDate();
  const first  = (new Date(year, month, 1).getDay() + 6) % 7; // Mon-based
  const cells  = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  // Dummy exam dates
  const examDates = [10, 12, 15, 18];

  return (
    <div style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:12, fontFamily:C.font }}>
      {/* Calendar */}
      <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"16px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:12, fontWeight:700, color:C.muted }}>{MONTHS[month]}</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.muted }}>{year}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
          {DAYS.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:C.muted, padding:"3px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {cells.map((d,i) => {
            if (!d) return <div key={i}/>;
            const isToday = d === today;
            const isExam  = examDates.includes(d);
            return (
              <div key={i} style={{ textAlign:"center", padding:"4px 0", borderRadius:6, fontSize:11, fontWeight:isToday?900:isExam?700:400,
                background: isToday ? C.blue : "transparent",
                color: isToday ? "#fff" : isExam ? C.orange : C.body,
                cursor:"pointer", position:"relative",
              }}>
                {d}
                {isExam && !isToday && <div style={{ width:4, height:4, borderRadius:"50%", background:C.orange, margin:"0 auto", marginTop:1 }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming mini list */}
      <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"14px" }}>
        <div style={{ fontSize:12, fontWeight:800, color:C.navy, marginBottom:10 }}>Upcoming Exams</div>
        {[
          { title:"Python DS Wk8", date:"10 Mar", color:C.blue },
          { title:"ML Module 4",   date:"12 Mar", color:C.orange },
          { title:"Cloud Mid-Term",date:"15 Mar", color:C.green },
        ].map((e,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 8px", borderRadius:8, background:C.bg }}>
            <div style={{ width:4, height:32, borderRadius:2, background:e.color, flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.navy }}>{e.title}</div>
              <div style={{ fontSize:10, color:C.muted }}>{e.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Help & support */}
      <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:"14px" }}>
        <div style={{ fontSize:12, fontWeight:800, color:C.navy, marginBottom:6 }}>ℹ️ Help &amp; Support</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Technical Support</div>
        <div style={{ fontSize:12, fontWeight:700, color:C.blue }}>📞 7037555457</div>
      </div>
    </div>
  );
}


const PAGES = {
  main:        ExaminerMainDashboard,
  create:      ExaminerCreateQuizDashboard,
  results:     ExaminerResultDashboard,
  progress:    ExaminerProgressDashboard,
};

export default function ExaminerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name || "Examiner";

  const pathToPage = {
    "/examiner":          "main",
    "/examiner/create":   "create",
    "/examiner/results":  "results",
    "/examiner/progress": "progress",
  };
  const active = pathToPage[location.pathname] || "main";

  const handleSelect = (id) => {
    if (id === "main") navigate("/examiner");
    else navigate(`/examiner/${id}`);
  };

  const PageComp = PAGES[active];

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:C.font, overflow:"hidden" }}>
      <Sidebar active={active} onSelect={handleSelect} userName={userName} onLogout={logout}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar activePage={active} userName={userName}/>
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Main scrollable area */}
          <main style={{ flex:1, overflow:"auto", padding:"20px 22px" }}>
            <PageComp/>
          </main>
        
            <div style={{ padding:"20px 16px 20px 0", overflowY:"auto", flexShrink:0 }}>
              <CalendarPanel/>
            </div>
          
        </div>
      </div>
    </div>
  );
}