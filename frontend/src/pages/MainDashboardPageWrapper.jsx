import DashboardLayout from "../components/DashboardLayout";
import ExaminerMainDashboard from "../components/ExaminerMainDashboard";

export default function MainDashboardPageWrapper() {
  return (
    <DashboardLayout pageTitle="Main Dashboard" activeNav="main">
      <ExaminerMainDashboard />
    </DashboardLayout>
  );
}
