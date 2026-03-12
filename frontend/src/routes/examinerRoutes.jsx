import { Routes, Route } from "react-router-dom";
import ExaminerDashboard from "../pages/ExaminerDashboard";
import PrivateRoute from "./PrivateRoute";

const ExaminerRoutes = () => {
  return (
    <Routes>
      {["/examiner", "/examiner/create", "/examiner/results", "/examiner/progress"].map(path => (
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
    </Routes>
  );
};

export default ExaminerRoutes;