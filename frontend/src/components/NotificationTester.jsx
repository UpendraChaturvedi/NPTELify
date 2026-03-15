// NotificationTester.jsx - For testing notifications during development

import { notificationStore } from "../utils/notificationStore";

const C = {
  navy:"#1a3a6b",blue:"#2563eb",orange:"#f97316",green:"#16a34a",red:"#dc2626",purple:"#7c3aed",
  bg:"#f5f8ff",card:"#ffffff",altBg:"#eaf0fb",border:"#dce8fb",muted:"#7a8faf",body:"#4a6490",
};

export default function NotificationTester() {
  const testNotifications = {
    studentQuizStarting: () => notificationStore.notifyQuizStartingSoon("Mathematics Quiz"),
    studentQuizLive: () => notificationStore.notifyQuizLive("Mathematics Quiz"),
    studentQuizEnded: () => notificationStore.notifyQuizEnded("Mathematics Quiz"),
    studentResultsAvailable: () => notificationStore.notifyResultsAvailable("Mathematics Quiz"),
    examinerNewAttempt: () => notificationStore.notifyNewAttempt("Arun Kumar", "Data Structures Quiz"),
    examinerQuizStarted: () => notificationStore.notifyQuizStartedExaminer("Python Programming"),
    examinerQuizEnded: () => notificationStore.notifyQuizEndedExaminer("Python Programming"),
    examinerQuizCreated: () => notificationStore.notifyQuizCreated("Web Development Quiz"),
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 10000, maxWidth: 280 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 12 }}>
        🧪 Notification Tester
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, marginBottom: 4 }}>Student Notifications:</div>
        {["studentQuizStarting", "studentQuizLive", "studentQuizEnded", "studentResultsAvailable"].map(key => (
          <button
            key={key}
            onClick={testNotifications[key]}
            style={{
              padding: "6px 10px",
              fontSize: 10,
              fontWeight: 600,
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.navy,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.background = C.altBg; }}
          >
            {key.replace(/^student/, "")}
          </button>
        ))}
        
        <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginBottom: 4, marginTop: 8 }}>Examiner Notifications:</div>
        {["examinerNewAttempt", "examinerQuizStarted", "examinerQuizEnded", "examinerQuizCreated"].map(key => (
          <button
            key={key}
            onClick={testNotifications[key]}
            style={{
              padding: "6px 10px",
              fontSize: 10,
              fontWeight: 600,
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.navy,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.background = C.altBg; }}
          >
            {key.replace(/^examiner/, "")}
          </button>
        ))}

        <button
          onClick={() => notificationStore.clearAll()}
          style={{
            padding: "6px 10px",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 6,
            border: `1px solid ${C.red}`,
            background: "#fef2f2",
            color: C.red,
            cursor: "pointer",
            marginTop: 8,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = C.red; }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
