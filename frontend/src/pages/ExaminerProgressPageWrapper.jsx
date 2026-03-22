import DashboardLayout from "../components/DashboardLayout";
import ExaminerProgressDashboard from "../components/ExaminerProgressDashboard";

export default function ExaminerProgressPageWrapper() {
  return (
    <DashboardLayout pageTitle="Progress Dashboard" activeNav="progress">
      <ExaminerProgressDashboard />
    </DashboardLayout>
  );
}
