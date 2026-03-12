import { useState } from "react";
import ResultsDashboardPage from "../components/ResultDashboardPage";
import ProgressDashboardPage from "../components/ProgressDashboardPage";
import SolutionDashboardPage from "../components/SolutionDashBoardPage";
import MainDashboardPage from "../components/MainDashboardPage";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const C = {
  navy: "#1a3a6b", blue: "#2563eb", orange: "#f97316",
  bg: "#f5f8ff", card: "#ffffff", altBg: "#eaf0fb",
  border: "#dce8fb", muted: "#7a8faf", body: "#4a6490",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

const NAV = [
  {
    id: "main", label: "Main Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:18,height:18 }}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: "results", label: "Results Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:18,height:18 }}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  },
  {
    id: "progress", label: "Progress Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:18,height:18 }}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  },
  {
    id: "solutions", label: "Solution Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:18,height:18 }}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
];

function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
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
          </div>
    </button>
  );
}

function Sidebar({ active, onSelect, auth, navigate }) {
  const [hovId, setHovId] = useState(null);
  const userName = auth?.user?.name || "User";
  return (
    <aside style={{ width:238, background:C.card, borderRight:`1.5px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, fontFamily:C.font }}>
      {/* Logo + avatar */}
      <div style={{ padding:"20px 20px 16px", borderBottom:`1.5px solid ${C.border}` }}>
        <Logo onClick={() => navigate("/candidate")} />
        <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:C.altBg, border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" style={{ width:20,height:20 }}>
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{userName}</div>
            <div style={{ fontSize:11, color:C.muted }}>Candidate</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ padding:"12px", flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        <div style={{ fontSize:10, fontWeight:800, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", padding:"6px 14px 4px" }}>Menu</div>
        {NAV.map(item => {
          const isActive = active === item.id;
          const isHov    = hovId === item.id;
          return (
            <button key={item.id} onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHovId(item.id)}
              onMouseLeave={() => setHovId(null)}
              style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer", textAlign:"left", width:"100%", fontFamily:C.font, fontSize:13, fontWeight: isActive ? 700 : 500, transition:"all 0.15s",
                background: isActive ? C.altBg : isHov ? "#f8faff" : "transparent",
                color: isActive ? C.blue : isHov ? C.navy : C.body,
                borderLeft: isActive ? `3px solid ${C.blue}` : "3px solid transparent",
              }}>
              <span style={{ color: isActive ? C.blue : isHov ? C.navy : C.muted, flexShrink:0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      {/* Help */}
      <div style={{ padding:"14px 20px", borderTop:`1.5px solid ${C.border}` }}>
        <button
          onClick={() => { auth.logout(); navigate("/login"); }}
          style={{ fontSize:12, color:C.orange, fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:0 }}
        >
          Log Out
        </button>
      </div>
      <div style={{ padding:"14px 20px", borderTop:`1.5px solid ${C.border}` }}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Need help?</div>
        <a href="#" style={{ fontSize:12, color:C.blue, fontWeight:700, textDecoration:"none" }}>Contact Support →</a>
      </div>
    </aside>
  );
}

function Topbar({ activePage, userName }) {
  const titles = { main:"Main Dashboard", results:"Results Dashboard", progress:"Progress Dashboard", solutions:"Solution Dashboard" };
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) + ", " +
    now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
  return (
    <header style={{ height:60, background:C.card, borderBottom:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", flexShrink:0, fontFamily:C.font }}>
      <div>
        <span style={{ fontSize:15, fontWeight:800, color:C.navy }}>{titles[activePage]}</span>
        <span style={{ fontSize:12, color:C.muted, marginLeft:14 }}>{dateStr}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:C.altBg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" style={{ width:17,height:17 }}>
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div style={{ position:"absolute", top:6, right:7, width:8, height:8, borderRadius:"50%", background:C.orange, border:`2px solid ${C.card}` }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:C.altBg, border:`2px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" style={{ width:18,height:18 }}>
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy, lineHeight:1.2 }}>{userName}</div>
            <div style={{ fontSize:11, color:C.muted }}>Candidate</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const PAGES = {
  main:      <MainDashboardPage/>,
  results:   <ResultsDashboardPage/>,
  progress:  <ProgressDashboardPage/>,
  solutions: <SolutionDashboardPage/>,
};

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = { user, logout };

  const pathToPage = {
    "/candidate":           "main",
    "/candidate/results":   "results",
    "/candidate/progress":  "progress",
    "/candidate/solutions": "solutions",
  };
  const active = pathToPage[location.pathname] || "main";

  const handleSelect = (id) => {
    if (id === "main") navigate("/candidate");
    else navigate(`/candidate/${id}`);
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:C.font, overflow:"hidden" }}>
      <Sidebar active={active} onSelect={handleSelect} auth={auth} navigate={navigate}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar activePage={active} userName={user?.name || "User"}/>
        <main style={{ flex:1, overflow:"auto", padding:"24px 28px" }}>
          {PAGES[active]}
        </main>
      </div>
    </div>
  );
}
