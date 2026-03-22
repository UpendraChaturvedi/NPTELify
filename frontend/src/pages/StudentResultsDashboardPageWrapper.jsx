import StudentDashboardLayout from "../components/StudentDashboardLayout";
import ResultsDashboardPage from "../components/ResultDashboardPage";

export default function StudentResultsDashboardPageWrapper() {
  return (
    <StudentDashboardLayout pageTitle="results" activeNav="results">
      <ResultsDashboardPage />
    </StudentDashboardLayout>
  );
}
