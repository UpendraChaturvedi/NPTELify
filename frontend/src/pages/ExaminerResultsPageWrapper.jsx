import DashboardLayout from "../components/DashboardLayout";
import ExaminerResultDashboard from "../components/ExaminerResultDashboard";

export default function ExaminerResultsPageWrapper() {
  return (
    <DashboardLayout pageTitle="Results Dashboard" activeNav="results">
      <ExaminerResultDashboard />
    </DashboardLayout>
  );
}
