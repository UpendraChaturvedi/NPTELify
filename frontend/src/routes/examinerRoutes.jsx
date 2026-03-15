import { Routes, Route, Navigate } from "react-router-dom";
import ExaminerDashboard from "../pages/ExaminerDashboard";
import ExaminerProfilePage from "../pages/ExaminerProfilePage";
import PrivateRoute from "./PrivateRoute";

const ExaminerRoutes = () => {
  return (
    <Routes>
      <Route path="/examiner" element={<Navigate to="/examiner/dashboard" replace />} />
      {["/examiner/dashboard", "/examiner/create", "/examiner/results", "/examiner/progress"].map(path => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute role="examiner">
              <ExaminerDashboard />
            </PrivateRoute>
          }
        />
      ))}
      <Route
        path="/examiner/profile"
        element={
          <PrivateRoute role="examiner">
            <ExaminerProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ExaminerRoutes;