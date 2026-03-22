import { Routes, Route, Navigate } from "react-router-dom";
import StudentMainDashboardPageWrapper from "../pages/StudentMainDashboardPageWrapper";
import StudentResultsDashboardPageWrapper from "../pages/StudentResultsDashboardPageWrapper";
import StudentProgressDashboardPageWrapper from "../pages/StudentProgressDashboardPageWrapper";
import StudentSolutionsDashboardPageWrapper from "../pages/StudentSolutionsDashboardPageWrapper";
import CandidateProfilePage from "../pages/CandidateProfilePage";
import QuizPage from "../pages/QuizPage";
import PrivateRoute from "./PrivateRoute";

const CandidateRoutes = () => {
  return (
    <Routes>
      <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
      <Route path="/candidate/dashboard"
        element={
          <PrivateRoute role="candidate">
            <StudentMainDashboardPageWrapper />
          </PrivateRoute>
        }
      />
      <Route path="/candidate/results"
        element={
          <PrivateRoute role="candidate">
            <StudentResultsDashboardPageWrapper />
          </PrivateRoute>
        }
      />
      <Route path="/candidate/progress"
        element={
          <PrivateRoute role="candidate">
            <StudentProgressDashboardPageWrapper />
          </PrivateRoute>
        }
      />
      <Route path="/candidate/solutions"
        element={
          <PrivateRoute role="candidate">
            <StudentSolutionsDashboardPageWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate/profile"
        element={
          <PrivateRoute role="candidate">
            <CandidateProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidate/quiz/:id"
        element={
          <PrivateRoute role="candidate">
            <QuizPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default CandidateRoutes;