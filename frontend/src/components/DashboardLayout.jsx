// DashboardLayout.jsx — Shared header and sidebar for all examiner pages
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "./NotificationCenter";

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

const NAV = [
  { id:"main",           label:"Main Dashboard",       icon:"home" },
  { id:"create",         label:"Create Quiz",          icon:"pencil" },
  { id:"results",        label:"Results Dashboard",    icon:"chart" },
  { id:"progress",       label:"Progress Dashboard",   icon:"trending" },
  { id:"question-bank",  label:"Question Bank",        icon:"book" },
];

/* Icon SVG Renderer */
function getNavIcon(iconType, color = C.body) {
  const iconMap = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h3v-5h4v5h3a1 1 0 001-1v-9"/></svg>,
    pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M17 3a2.828 2.828 0 115.656 0L5 21H3v-2L17 3z"/></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M3 3v18h18M3 18l4-5 4 3 5-7 5 3"/></svg>,
    trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 7H20v10a2 2 0 01-2 2H6.5a2 2 0 01-2-2V4.5z"/></svg>
  };
  return iconMap[iconType] || iconMap.home;
}

function Sidebar({ active, onSelect, userName }) {
  const [hov, setHov] = useState(null);
  const navigate = useNavigate();

  return (
    <aside style={{ width:240, background:C.sidebar, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, height:"100vh", overflowY:"auto", fontFamily:C.font }}>
      {/* Logo */}
      <button onClick={() => navigate("/examiner")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:"16px 20px" }}>
        <img src="/logo_half.png" alt="logo" style={{ width: 36, height: 36, objectFit: "contain" }}/>
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
              <span style={{ color: isA ? C.blue : isH ? C.navy : C.body, flexShrink:0 }}>{getNavIcon(item.icon, isA ? C.blue : isH ? C.navy : C.body)}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding:"14px 20px", borderTop:`2px solid ${C.border}` }}>
        <button onClick={() => {}}
          style={{display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 900, color: C.red }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar({ pageTitle, userName }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ height:52, background:C.card, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0, fontFamily:C.font }}>
      <div>
        <span style={{ fontSize:15, fontWeight:800, color:C.navy }}>{pageTitle}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:1, height:24, background:C.border }}></div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <NotificationCenter/>
          <div style={{ position:"relative" }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"6px 12px", borderRadius:10, transition:"all 0.3s", border:"none", background: profileOpen ? `${C.blue}08` : "transparent" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${C.orange}, ${C.orange}dd)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: `0 3px 12px ${C.orange}44` }}>
                <span style={{ fontSize:16, fontWeight:900, color:"white" }}>{getInitials(userName)}</span>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{userName}</div>
                <div style={{ fontSize:10, color:C.muted }}>Examiner</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ pageTitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "Examiner";

  const handleSelect = (id) => {
    if (id === "main") navigate("/examiner");
    else navigate(`/examiner/${id}`);
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:C.font, overflow:"hidden" }}>
      <Sidebar active={""} onSelect={handleSelect} userName={userName}/>
      <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
        <Topbar pageTitle={pageTitle} userName={userName}/>
        <div style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
