import { Routes, Route, Navigate } from "react-router-dom";
import MainDashboardPageWrapper from "../pages/MainDashboardPageWrapper";
import ExaminerCreateQuizPageWrapper from "../pages/ExaminerCreateQuizPageWrapper";
import ExaminerResultsPageWrapper from "../pages/ExaminerResultsPageWrapper";
import ExaminerProgressPageWrapper from "../pages/ExaminerProgressPageWrapper";
import ExaminerProfilePage from "../pages/ExaminerProfilePage";
import QuestionBankPage from "../pages/QuestionBankPage";
import ImportQuestionsPage from "../pages/ImportQuestionsPage";
import QuizBuilderPage from "../pages/QuizBuilderPage";
import PrivateRoute from "./PrivateRoute";

const ExaminerRoutes = () => {
  return (
    <Routes>
      <Route path="/examiner" element={<Navigate to="/examiner/dashboard" replace />} />
      <Route
        path="/examiner/dashboard"
        element={
          <PrivateRoute role="examiner">
            <MainDashboardPageWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/examiner/create"
        element={
          <PrivateRoute role="examiner">
            <ExaminerCreateQuizPageWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/examiner/results"
        element={
          <PrivateRoute role="examiner">
            <ExaminerResultsPageWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/examiner/progress"
        element={
          <PrivateRoute role="examiner">
            <ExaminerProgressPageWrapper />
          </PrivateRoute>
        }
      />
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