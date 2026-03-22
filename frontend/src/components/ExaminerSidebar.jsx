// ExaminerSidebar.jsx - Shared sidebar component for all examiner pages
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  navy:   "#1a3a6b",
  blue:   "#2563eb",
  orange: "#f97316",
  red:    "#dc2626",
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

function getNavIcon(iconType, color = C.body) {
  const iconMap = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h3v-5h4v5h3a1 1 0 001-1v-9"/></svg>,
    pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M17 3a2.828 2.828 0 115.656 0L5 21H3v-2L17 3z"/></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M3 3v18h18M3 18l4-5 4 3 5-7 5 3"/></svg>,
    trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 7H20v10a2 2 0 01-2 2H6.5a2 2 0 01-2-2V4.5z"/></svg>,
    info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:14, height:14 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  };
  return iconMap[iconType] || iconMap.home;
}

function ExaminerSidebar({ active, onSelect, userName, onLogout }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(null);
  
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <aside style={{ width:240, background:C.sidebar, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, height:"100vh", overflowY:"auto", fontFamily:C.font }}>
      
      {/* Logo + Profile */}
      <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
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
        <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${C.orange}, ${C.orange}dd)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: `0 3px 12px ${C.orange}44, inset 0 1px 2px rgba(255,255,255,0.4)`, position:"relative" }}>
            <span style={{ fontSize:18, fontWeight:900, color:"white", letterSpacing:"-0.5px" }}>{getInitials(userName)}</span>
            <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#10b981", border:`2px solid white`, boxShadow:"0 2px 4px rgba(0,0,0,0.2)" }}></div>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{userName}</div>
            <div style={{ fontSize:11, color:C.muted }}>Examiner</div>
          </div>
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

      {/* Help & Support */}
      <div style={{ padding:"14px 20px" }}>
        <div onClick={() => navigate("/help")} style={{ background:C.altBg, borderRadius:12, border:`1px solid ${C.border}`, padding:"12px", cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 4px 12px ${C.blue}20`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ fontSize:11, fontWeight:800, color:C.navy, marginBottom:4, display:"flex", alignItems:"center", gap:4 }}>{getNavIcon('info')} Help &amp; Support</div>
          <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>Technical Support</div>
          <div style={{ fontSize:11, fontWeight:700, color:C.blue, display:"flex", alignItems:"center", gap:4 }}>{getNavIcon('phone')} 7037555457</div>
        </div>
      </div>

      {/* Logout */}
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

export default ExaminerSidebar;
