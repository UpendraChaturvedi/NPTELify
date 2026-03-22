import StudentDashboardLayout from "../components/StudentDashboardLayout";
import MainDashboardPage from "../components/MainDashboardPage";

export default function StudentMainDashboardPageWrapper() {
  return (
    <StudentDashboardLayout pageTitle="main" activeNav="main">
      <MainDashboardPage />
    </StudentDashboardLayout>
  );
}
