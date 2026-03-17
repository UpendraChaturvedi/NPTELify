// QuestionBankPage.jsx — Reusable question library management
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const C = {
  navy:"#1a3a6b", blue:"#2563eb", orange:"#f97316", green:"#16a34a", red:"#dc2626",
  bg:"#f5f8ff", card:"#ffffff", altBg:"#eaf0fb", border:"#dce8fb", muted:"#7a8faf", body:"#4a6490",
  font:"'DM Sans','Segoe UI',sans-serif",
};

const getQuestionBankIcon = (type) => {
  const icons = {
    import: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
    document: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7M9 7h6M9 11h6M9 15h2M4 7h16M9 3h6a2 2 0 012 2v2H7V5a2 2 0 012-2z"/></svg>,
    tools: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:'100%', height:'100%' }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2zm0 8h-2v2h2z"/></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:'100%', height:'100%' }}><path d="M12 5v14M5 12h14"/></svg>,
    back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:'100%', height:'100%' }}><path d="M15 18l-6-6 6-6"/></svg>,
  };
  return icons[type] || icons.document;
};

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    subject: "",
    difficulty: "medium",
  });

  // Load questions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("questionBank");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Save questions to localStorage
  const saveQuestions = (newQuestions) => {
    localStorage.setItem("questionBank", JSON.stringify(newQuestions));
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (!formData.text || formData.options.some(o => !o)) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId !== null) {
      // Update existing
      const updated = questions.map(q => q.id === editingId ? { ...formData, id: editingId } : q);
      saveQuestions(updated);
      setEditingId(null);
    } else {
      // Add new
      const newQuestion = {
        ...formData,
        id: Date.now(),
      };
      saveQuestions([...questions, newQuestion]);
    }

    setFormData({
      text: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      subject: "",
      difficulty: "medium",
    });
    setShowForm(false);
  };

  const handleEdit = (q) => {
    setFormData(q);
    setEditingId(q.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this question?")) {
      saveQuestions(questions.filter(q => q.id !== id));
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg, fontFamily:C.font }}>
        Loading question bank...
      </div>
    );
  }

  return (
    <DashboardLayout pageTitle="Question Bank">
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:C.font, padding:"32px 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, color:C.navy, margin:0 }}>Question Bank</h1>
            <p style={{ fontSize:14, color:C.muted, margin:"8px 0 0" }}>{questions.length} questions available</p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => navigate("/examiner/import-questions")}
              style={{ padding:"12px 24px", borderRadius:12, background:C.orange, color:"#fff", border:"none", fontWeight:700, cursor:"pointer", fontFamily:C.font, display:"flex", alignItems:"center", gap:8 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Import Questions
            </button>
            <button onClick={() => navigate("/examiner/quiz-builder")}
              style={{ padding:"12px 24px", borderRadius:12, background:C.blue, color:"#fff", border:"none", fontWeight:700, cursor:"pointer", fontFamily:C.font, display:"flex", alignItems:"center", gap:8 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:16, height:16 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2zm0-4h-2V9h2z"/></svg>
              Build Quiz
            </button>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); }}
              style={{ padding:"12px 24px", borderRadius:12, background:C.green, color:"#fff", border:"none", fontWeight:700, cursor:"pointer", fontFamily:C.font, display:"flex", alignItems:"center", gap:8 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:16, height:16 }}><path d="M12 5v14M5 12h14"/></svg>
              Add Question
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background:C.card, borderRadius:16, padding:24, marginBottom:24, border:`1.5px solid ${C.border}` }}>
            <h3 style={{ margin:"0 0 16px", color:C.navy }}>{editingId ? "Edit" : "Add New"} Question</h3>
            <textarea placeholder="Question text" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
              style={{ width:"100%", padding:12, borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:C.font, marginBottom:12, minHeight:80 }}/>
            
            {formData.options.map((opt, i) => (
              <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={e => {
                const newOpts = [...formData.options];
                newOpts[i] = e.target.value;
                setFormData({...formData, options: newOpts});
              }}
                style={{ width:"100%", padding:10, borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:C.font, marginBottom:10 }}/>
            ))}

            <div style={{ display:"flex", gap:16, marginBottom:16 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.muted, display:"block", marginBottom:6 }}>Correct Answer</label>
                <select value={formData.correctAnswerIndex} onChange={e => setFormData({...formData, correctAnswerIndex: parseInt(e.target.value)})}
                  style={{ width:"100%", padding:10, borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:C.font }}>
                  {formData.options.map((opt, i) => <option key={i} value={i}>{i + 1}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.muted, display:"block", marginBottom:6 }}>Subject</label>
                <input type="text" placeholder="e.g., Math" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                  style={{ width:"100%", padding:10, borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:C.font }}/>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.muted, display:"block", marginBottom:6 }}>Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}
                  style={{ width:"100%", padding:10, borderRadius:8, border:`1.5px solid ${C.border}`, fontFamily:C.font }}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button onClick={handleAddQuestion}
                style={{ flex:1, padding:12, borderRadius:8, background:C.green, color:"#fff", border:"none", fontWeight:700, cursor:"pointer", fontFamily:C.font }}>
                {editingId ? "Update" : "Add"} Question
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }}
                style={{ flex:1, padding:12, borderRadius:8, background:C.altBg, border:`1px solid ${C.border}`, fontWeight:700, cursor:"pointer", fontFamily:C.font }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div style={{ display:"grid", gap:16 }}>
          {questions.length === 0 ? (
            <div style={{ background:C.card, borderRadius:16, padding:32, textAlign:"center", border:`1.5px solid ${C.border}` }}>
              <p style={{ color:C.muted, fontSize:14 }}>No questions yet. Create one to get started!</p>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} style={{ background:C.card, borderRadius:16, padding:20, border:`1.5px solid ${C.border}`, boxShadow:"0 2px 10px #1a3a6b08" }}>
                <div style={{ display:"flex", gap:16, marginBottom:16, alignItems:"flex-start", justifyContent:"space-between" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:8 }}>
                      {q.subject} • <span style={{ color:q.difficulty === "easy" ? C.green : q.difficulty === "medium" ? C.orange : C.red }}>
                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                      </span>
                    </div>
                    <p style={{ fontSize:16, fontWeight:700, color:C.navy, margin:0, marginBottom:16 }}>{q.text}</p>
                    <div style={{ display:"grid", gap:8 }}>
                      {q.options.map((opt, i) => (
                        <div key={i} style={{ padding:10, borderRadius:8, background: i === q.correctAnswerIndex ? "#d1fae5" : C.altBg, border:`1px solid ${i === q.correctAnswerIndex ? "#10b981" : C.border}`, fontWeight: i === q.correctAnswerIndex ? 700 : 400 }}>
                          {String.fromCharCode(65 + i)}. {opt} {i === q.correctAnswerIndex && "✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={() => handleEdit(q)}
                      style={{ padding:"8px 12px", borderRadius:8, background:C.blue, color:"#fff", border:"none", cursor:"pointer", fontFamily:C.font, fontWeight:700, fontSize:12 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(q.id)}
                      style={{ padding:"8px 12px", borderRadius:8, background:C.red, color:"#fff", border:"none", cursor:"pointer", fontFamily:C.font, fontWeight:700, fontSize:12 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div style={{ marginTop:32, textAlign:"center" }}>
          <button onClick={() => navigate(-1)}
            style={{ padding:"12px 32px", borderRadius:12, background:C.altBg, border:`1.5px solid ${C.border}`, fontWeight:700, cursor:"pointer", fontFamily:C.font, display:"flex", alignItems:"center", gap:8, margin:"0 auto" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width:16, height:16 }}><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
