import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../pages/CandidateDashboard";
import CandidateProfilePage from "../pages/CandidateProfilePage";
import QuizPage from "../pages/QuizPage";
import PrivateRoute from "./PrivateRoute";

const CandidateRoutes = () => {
  return (
    <Routes>
      <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
      {["/candidate/dashboard", "/candidate/results", "/candidate/progress", "/candidate/solutions"].map(path => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute role="candidate">
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
      ))}
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