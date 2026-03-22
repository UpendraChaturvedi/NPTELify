import DashboardLayout from "../components/DashboardLayout";
import ExaminerCreateQuizDashboard from "../components/ExaminerCreateQuizDashboard";

export default function ExaminerCreateQuizPageWrapper() {
  return (
    <DashboardLayout pageTitle="Create Quiz" activeNav="create">
      <ExaminerCreateQuizDashboard />
    </DashboardLayout>
  );
}
