import { Routes, Route, Navigate } from "react-router-dom";
import ExaminerDashboard from "../pages/ExaminerDashboard";
import ExaminerProfilePage from "../pages/ExaminerProfilePage";
import QuestionBankPage from "../pages/QuestionBankPage";
import ImportQuestionsPage from "../pages/ImportQuestionsPage";
import QuizBuilderPage from "../pages/QuizBuilderPage";
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
      <Route
        path="/examiner/question-bank"
        element={
          <PrivateRoute role="examiner">
            <QuestionBankPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/examiner/import-questions"
        element={
          <PrivateRoute role="examiner">
            <ImportQuestionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/examiner/quiz-builder"
        element={
          <PrivateRoute role="examiner">
            <QuizBuilderPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ExaminerRoutes;