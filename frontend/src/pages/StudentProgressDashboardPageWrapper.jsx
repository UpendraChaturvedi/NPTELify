import StudentDashboardLayout from "../components/StudentDashboardLayout";
import ProgressDashboardPage from "../components/ProgressDashboardPage";

export default function StudentProgressDashboardPageWrapper() {
  return (
    <StudentDashboardLayout pageTitle="progress" activeNav="progress">
      <ProgressDashboardPage />
    </StudentDashboardLayout>
  );
}
