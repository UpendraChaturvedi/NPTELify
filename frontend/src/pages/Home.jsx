import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";



const NAV_LINKS = ["Features", "How It Works", "Subjects", "Testimonials"];

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>,
    title: "NPTEL-Specific Questions", accent: "#2563eb",
    desc: "Curated question banks mapped directly to official NPTEL syllabi — every week, every subject.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
    title: "Instant Feedback", accent: "#f97316",
    desc: "Know exactly where you went wrong the moment you submit. Detailed explanations for every answer.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    title: "Progress Analytics", accent: "#1a3a6b",
    desc: "Visual dashboards track your performance per topic, week, and assignment cycle.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    title: "Timed Mock Tests", accent: "#f97316",
    desc: "Simulate real NPTEL assignment pressure with timed quizzes matching the actual format.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    title: "Leaderboards", accent: "#2563eb",
    desc: "Compete with peers across India. See where you rank among thousands of NPTEL aspirants.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    title: "50+ Subjects", accent: "#1a3a6b",
    desc: "From CS to Management — all major NPTEL domains covered with regularly updated content.",
  },
];

const SUBJECTS = [
  "Data Science","Machine Learning","Python for DS","Programming in Java",
  "Computer Networks","Database Management","Operating Systems","Cloud Computing",
  "Digital Marketing","Business Analytics","Financial Management","Operations Research",
];

const STEPS = [
  { num:"01", title:"Pick Your Course", color:"#2563eb", desc:"Search for your active NPTEL course from our library of 50+ subjects." },
  { num:"02", title:"Take the Quiz",    color:"#f97316", desc:"Answer NPTEL-style questions with the same format as real assignments." },
  { num:"03", title:"Review & Learn",   color:"#1a3a6b", desc:"Study detailed explanations and identify your weak areas instantly." },
  { num:"04", title:"Track Progress",   color:"#f97316", desc:"Watch your score climb week over week with smart analytics." },
];

const TESTIMONIALS = [
  { name:"Arun Kushwah",  course:"ML · GLA University", score:"92%", text:"NPTELify helped me score in the top 5% of my cohort. The questions are spot-on with actual assignments." },
  { name:"Anmol Agarwal",   course:"Python · GLA University",  score:"88%", text:"Went from 60% to 88% in three weeks. The timed mock tests made all the difference for me." },
  { name:"Aryaman",   course:"Data Science · IIT Gandhinagar",score:"95%", text:"Best NPTEL prep tool out there. Analytics helped me focus exactly where I needed improvement." },
];

const STATS = [
  { value:"50,000+",   label:"Active Learners",    color:"#2563eb" },
  { value:"2,00,000+", label:"Questions Solved",   color:"#f97316" },
  { value:"50+",       label:"Subjects Covered",   color:"#1a3a6b" },
  { value:"87%",       label:"Score Improvement",  color:"#f97316" },
];

/* ─── shared inline style atoms ─── */
const pill = { fontSize:11, fontWeight:800, letterSpacing:"0.14em", color:"#f97316", textTransform:"uppercase" };
// const h2s  = { fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#1a3a6b", marginTop:8, letterSpacing:"-1px", margin:"8px 0 0" };

export default function Home() {
  const [activeSubject, setActiveSubject] = useState(null);
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f5f8ff", color:"#1a3a6b", minHeight:"100vh" }}>

      {/* ══ NAV ══ */}
      <nav style={{ background:"#fff", borderBottom:"1.5px solid #dce8fb", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* Logo */}
          <button onClick={() => navigate("/home")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <img
                src="/logo_half.png"
                alt="logo"
                style={{ width:36, height:36, objectFit:"contain" }}
                />
            <span style={{ fontWeight:900, fontSize:22, letterSpacing:"-0.5px" }}>
              <span style={{ color:"#1a3a6b" }}>NPTEL</span><span style={{ color:"#f97316" }}>ify</span>
            </span>
          </button>

          {/* Desktop links */}
          <div style={{ display:"flex", gap:32, alignItems:"center" }}>
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.replace(/\s/g,"-").toLowerCase()}`}
                style={{ fontSize:14, fontWeight:600, color:"#4a6490", textDecoration:"none" }}
                onMouseEnter={e=>e.target.style.color="#2563eb"}
                onMouseLeave={e=>e.target.style.color="#4a6490"}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <NavBtn to="/login" outline>Log In</NavBtn>
            <NavBtn to="/signup">Start Free</NavBtn>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position:"relative", overflow:"hidden", padding:"100px 24px 88px" }}>
        {/* background blobs */}
        <div style={{ position:"absolute", top:-80, right:-80, width:420, height:420, borderRadius:"50%", background:"#dce8fb", opacity:.65, zIndex:0 }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:300, height:300, borderRadius:"50%", background:"#fde8d4", opacity:.55, zIndex:0 }} />
        {/* dot grid */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.18, zIndex:0 }}>
          <defs><pattern id="dots" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#2563eb"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>

        <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", textAlign:"center" }}>
          {/* badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:999, background:"#dce8fb", border:"1.5px solid #b8d0f5", marginBottom:30 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#f97316", display:"inline-block" }} />
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", color:"#2563eb", textTransform:"uppercase" }}>NPTEL Assignment Prep</span>
          </div>

          <h1 style={{ fontSize:"clamp(38px,7vw,70px)", fontWeight:900, lineHeight:1.08, letterSpacing:"-2px", marginBottom:22, color:"#1a3a6b" }}>
            Ace Every{" "}
            <span style={{ color:"#2563eb", borderBottom:"4px solid #f97316", paddingBottom:3 }}>NPTEL</span>
            {" "}Quiz.{" "}
            <span style={{ color:"#f97316" }}>Every Week.</span>
          </h1>

          <p style={{ fontSize:18, color:"#4a6490", maxWidth:540, margin:"0 auto 38px", lineHeight:1.72 }}>
            Practice with thousands of curated NPTEL-style questions. Get instant feedback, track your progress, and dominate weekly assignments.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:64 }}>
            <Link to="/signup" style={{ padding:"14px 32px", background:"#2563eb", color:"#fff", fontWeight:800, fontSize:15, borderRadius:12, textDecoration:"none", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 22px #2563eb30", border:"none" }}>
              Start Practicing Free
              <ArrowRight />
            </Link>
            <a href="#how-it-works" style={{ padding:"14px 32px", background:"#fff", color:"#1a3a6b", fontWeight:700, fontSize:15, borderRadius:12, textDecoration:"none", display:"flex", alignItems:"center", gap:8, border:"1.5px solid #dce8fb", boxShadow:"0 2px 10px #1a3a6b10" }}>
              <PlayIcon /> See How It Works
            </a>
          </div>

          {/* stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, maxWidth:680, margin:"0 auto" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background:"#fff", border:"1.5px solid #dce8fb", borderRadius:16, padding:"18px 10px", textAlign:"center", boxShadow:"0 2px 12px #2563eb0b" }}>
                <div style={{ fontSize:26, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#7a8faf", marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding:"88px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader tag="Why NPTELify" title="Built for NPTEL Success" sub="Everything you need to consistently score 90%+ on NPTEL weekly assignments." />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:18 }}>
            {FEATURES.map((f,i) => <FeatureCard key={i} f={f} />)}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{ padding:"88px 24px", background:"#eaf0fb" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <SectionHeader tag="The Process" title="How It Works" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {STEPS.map((s,i) => (
              <div key={i} style={{ background:"#fff", border:`1.5px solid ${s.color}28`, borderRadius:18, padding:"28px 22px", display:"flex", gap:14, alignItems:"flex-start", boxShadow:`0 4px 18px ${s.color}0e` }}>
                <span style={{ fontSize:44, fontWeight:900, color:`${s.color}20`, lineHeight:1, userSelect:"none", flexShrink:0 }}>{s.num}</span>
                <div>
                  <h3 style={{ fontWeight:800, fontSize:16, color:"#1a3a6b", marginBottom:6 }}>{s.title}</h3>
                  <p style={{ fontSize:13.5, color:"#4a6490", lineHeight:1.65, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SUBJECTS ══ */}
      <section id="subjects" style={{ padding:"88px 24px", background:"#fff" }}>
        <div style={{ maxWidth:840, margin:"0 auto", textAlign:"center" }}>
          <SectionHeader tag="Course Library" title="Your Subject. Our Questions." sub="Covering every popular NPTEL course across IIT & IISc campuses." />
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginTop:8 }}>
            {SUBJECTS.map((sub,i) => (
              <button key={i} onClick={() => setActiveSubject(activeSubject===i?null:i)}
                style={{
                  padding:"10px 20px", borderRadius:999, fontSize:13, fontWeight:700, cursor:"pointer",
                  border:`1.5px solid ${activeSubject===i?"#2563eb":"#dce8fb"}`,
                  background: activeSubject===i?"#2563eb":"#f5f8ff",
                  color: activeSubject===i?"#fff":"#1a3a6b",
                  boxShadow: activeSubject===i?"0 4px 14px #2563eb2a":"none",
                  transition:"all .18s",
                }}>
                {sub}
              </button>
            ))}
          </div>
          <div style={{ marginTop:26 }}>
            <a href="#" style={{ fontSize:14, fontWeight:700, color:"#f97316", textDecoration:"none" }}>View all 50+ subjects →</a>
          </div>
        </div>
      </section>

      {/* ══ SAMPLE QUIZ ══ */}
      <section style={{ padding:"80px 24px", background:"#eaf0fb" }}>
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          <SectionHeader tag="Live Preview" title="Try a Sample Question" />
          <SampleQuiz />
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="testimonials" style={{ padding:"88px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <SectionHeader tag="Real Results" title="Students Love It" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:"#f5f8ff", border:"1.5px solid #dce8fb", borderRadius:20, padding:"26px", display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:2 }}>{[...Array(5)].map((_,j)=><span key={j} style={{ color:"#f97316", fontSize:16 }}>★</span>)}</div>
                <p style={{ fontSize:14, color:"#4a6490", lineHeight:1.7, flex:1, margin:0 }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:14, borderTop:"1.5px solid #dce8fb" }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:"#1a3a6b" }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"#7a8faf", marginTop:2 }}>{t.course}</div>
                  </div>
                  <div style={{ fontSize:24, fontWeight:900, color:"#2563eb" }}>{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding:"80px 24px", background:"#eaf0fb" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ background:"#1a3a6b", borderRadius:28, padding:"60px 44px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"#f97316", opacity:.14 }} />
            <div style={{ position:"absolute", bottom:-50, left:-30, width:160, height:160, borderRadius:"50%", background:"#2563eb", opacity:.2 }} />
            <div style={{ position:"relative" }}>
              <span style={{ ...pill, color:"#f97316" }}>Free to Start</span>
              <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#fff", margin:"10px 0 14px", letterSpacing:"-0.5px" }}>Ready to Score Higher?</h2>
              <p style={{ color:"#a8c0e0", marginBottom:34, maxWidth:400, margin:"0 auto 34px", lineHeight:1.65 }}>
                Join 50,000+ students already preparing smarter for NPTEL. No credit card required.
              </p>
              <Link to="/signup" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"15px 36px", background:"#f97316", color:"#fff", fontWeight:800, fontSize:15, borderRadius:12, textDecoration:"none", boxShadow:"0 4px 20px #f9731645" }}>
                Create Free Account <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop:"1.5px solid #dce8fb", padding:"30px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img
                src="/logo_half.png"
                alt="logo"
                style={{
                    width: 36,
                    height: 36,
                    objectFit: "contain"
                }}
                />
            <span style={{ fontWeight:900, fontSize:18 }}><span style={{ color:"#1a3a6b" }}>NPTEL</span><span style={{ color:"#f97316" }}>ify</span></span>
          </div>
          <p style={{ fontSize:13, color:"#7a8faf", margin:0 }}>© 2026 NPTELify. Built for NPTEL learners across India.</p>
          <div style={{ display:"flex", gap:22 }}>
            {["Privacy","Terms","Contact"].map(l=>(
              <a key={l} href="#" style={{ fontSize:13, color:"#7a8faf", textDecoration:"none", fontWeight:600 }}
                onMouseEnter={e=>e.target.style.color="#2563eb"}
                onMouseLeave={e=>e.target.style.color="#7a8faf"}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function NavBtn({ to, children, outline }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  return (
    <button onClick={() => navigate(to)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        padding:"8px 18px", fontSize:13, fontWeight:700, borderRadius:10, cursor:"pointer", transition:"all .18s",
        border: outline ? "1.5px solid #2563eb" : "none",
        background: outline ? (hov?"#2563eb":"transparent") : (hov?"#e56c0a":"#f97316"),
        color: outline ? (hov?"#fff":"#2563eb") : "#fff",
        fontFamily:"'DM Sans','Segoe UI',sans-serif",
      }}>
      {children}
    </button>
  );
}

function SectionHeader({ tag, title, sub }) {
  return (
    <div style={{ textAlign:"center", marginBottom:44 }}>
      <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.14em", color:"#f97316", textTransform:"uppercase" }}>{tag}</span>
      <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#1a3a6b", marginTop:8, letterSpacing:"-1px" }}>{title}</h2>
      {sub && <p style={{ color:"#4a6490", marginTop:10, maxWidth:480, margin:"10px auto 0" }}>{sub}</p>}
    </div>
  );
}

function FeatureCard({ f }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: hov?"#fff":"#f5f8ff",
        border:`1.5px solid ${hov?f.accent:"#dce8fb"}`,
        borderRadius:18, padding:"28px 24px", transition:"all .25s",
        boxShadow: hov?`0 8px 28px ${f.accent}18`:"none",
      }}>
      <div style={{ width:48, height:48, borderRadius:14, background:`${f.accent}15`, color:f.accent, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
        {f.icon}
      </div>
      <h3 style={{ fontWeight:800, fontSize:16, color:"#1a3a6b", marginBottom:8 }}>{f.title}</h3>
      <p style={{ fontSize:14, color:"#4a6490", lineHeight:1.65, margin:0 }}>{f.desc}</p>
    </div>
  );
}

function SampleQuiz() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = 1;
  const opts = ["List","Dictionary","Tuple","Set"];

  return (
    <div style={{ background:"#fff", border:"1.5px solid #dce8fb", borderRadius:20, padding:"36px 32px", boxShadow:"0 4px 24px #2563eb0c" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", color:"#2563eb", textTransform:"uppercase" }}>Python for Data Science · Q.17</span>
        <span style={{ fontSize:11, padding:"4px 12px", borderRadius:999, background:"#eaf0fb", color:"#1a3a6b", fontWeight:700 }}>2 marks</span>
      </div>

      <p style={{ fontWeight:700, fontSize:16, color:"#1a3a6b", marginBottom:22, lineHeight:1.5 }}>
        In Python, which data structure uses key-value pairs and provides O(1) average time complexity for lookups?
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
        {opts.map((opt,i) => {
          let bg="#f5f8ff", border="#dce8fb", color="#1a3a6b";
          if(submitted){
            if(i===correct){bg="#eaf0fb";border="#2563eb";}
            else if(i===selected){bg="#fff3ee";border="#f97316";color="#c2410c";}
          } else if(selected===i){bg="#eaf0fb";border="#2563eb";}
          return (
            <button key={i} disabled={submitted} onClick={()=>setSelected(i)}
              style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:12, padding:"13px 18px", textAlign:"left", fontSize:14, fontWeight:600, color, cursor:submitted?"default":"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all .15s" }}>
              <span><span style={{ fontWeight:800, color:"#2563eb", marginRight:10 }}>{String.fromCharCode(65+i)}.</span>{opt}</span>
              {submitted&&i===correct&&<span style={{ color:"#2563eb", fontWeight:800, fontSize:12 }}>✓ Correct</span>}
              {submitted&&i===selected&&i!==correct&&<span style={{ color:"#f97316", fontWeight:800, fontSize:12 }}>✗ Wrong</span>}
            </button>
          );
        })}
      </div>

      {submitted&&(
        <div style={{ background:"#eaf0fb", border:"1.5px solid #2563eb28", borderRadius:12, padding:"13px 18px", fontSize:13.5, color:"#4a6490", marginBottom:18, lineHeight:1.6 }}>
          <span style={{ fontWeight:800, color:"#2563eb" }}>Explanation: </span>
          Python dictionaries use hash tables internally, giving O(1) average-case complexity for lookup, insertion, and deletion.
        </div>
      )}

      {!submitted
        ? <button disabled={selected===null} onClick={()=>setSubmitted(true)}
            style={{ padding:"11px 24px", background:selected===null?"#dce8fb":"#f97316", color:selected===null?"#9ab0cc":"#fff", fontWeight:800, fontSize:14, borderRadius:10, border:"none", cursor:selected===null?"not-allowed":"pointer", transition:"background .2s" }}>
            Submit Answer
          </button>
        : <button onClick={()=>{setSelected(null);setSubmitted(false);}}
            style={{ padding:"11px 24px", background:"#fff", color:"#2563eb", fontWeight:800, fontSize:14, borderRadius:10, border:"1.5px solid #2563eb", cursor:"pointer" }}>
            Try Again
          </button>
      }
    </div>
  );
}

function ArrowRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>;
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
}