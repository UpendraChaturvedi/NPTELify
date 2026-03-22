import StudentDashboardLayout from "../components/StudentDashboardLayout";
import SolutionDashboardPage from "../components/SolutionDashBoardPage";

export default function StudentSolutionsDashboardPageWrapper() {
  return (
    <StudentDashboardLayout pageTitle="solutions" activeNav="solutions">
      <SolutionDashboardPage />
    </StudentDashboardLayout>
  );
}
