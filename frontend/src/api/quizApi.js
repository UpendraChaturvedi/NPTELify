const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function clearAuthAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  window.location.replace("/login");
}

async function request(url, options = {}) {
  const res = await fetch(url, { ...options, headers: getAuthHeaders() });
  if (res.status === 401) {
    clearAuthAndRedirect();
    throw new Error("Session expired. Please log in again.");
  }
  const text = await res.text();
  let data = {};
  try { if (text) data = JSON.parse(text); } catch { /* non-JSON */ }
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

// ── Quiz APIs ──────────────────────────────────────────────
export const createQuiz = (body) =>
  request("/api/quizzes", { method: "POST", body: JSON.stringify(body) });

export const getAllQuizzes = () => request("/api/quizzes");

export const getMyQuizzes = () => request("/api/quizzes/mine");

export const getQuizById = (id) => request(`/api/quizzes/${id}`);

// ── Attempt APIs ───────────────────────────────────────────
export const submitAttempt = (quizId, answers) =>
  request(`/api/attempts/${quizId}`, { method: "POST", body: JSON.stringify({ answers }) });

export const getMyAttempts = () => request("/api/attempts/my");

export const getAttemptsForQuiz = (quizId) => request(`/api/attempts/quiz/${quizId}`);

export const getAttemptDetail = (attemptId) => request(`/api/attempts/${attemptId}`);
