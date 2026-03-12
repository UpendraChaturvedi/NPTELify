import { Routes, Route } from "react-router-dom";
import CandidateDashboard from "../pages/CandidateDashboard";
import QuizPage from "../pages/QuizPage";
import PrivateRoute from "./PrivateRoute";

const CandidateRoutes = () => {
  return (
    <Routes>
      {["/candidate", "/candidate/results", "/candidate/progress", "/candidate/solutions"].map(path => (
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