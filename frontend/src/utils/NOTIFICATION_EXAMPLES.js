// Example: How to trigger notifications in your code
// Import this at the top of any component where you want to use notifications:
// import { notificationStore } from "../utils/notificationStore";

// STUDENT NOTIFICATIONS:
// ======================

// When user views a quiz that's starting soon (e.g., within 1 hour)
// notificationStore.notifyQuizStartingSoon("Data Structures Quiz");

// When a quiz becomes live
// notificationStore.notifyQuizLive("Data Structures Quiz");

// When a quiz ends
// notificationStore.notifyQuizEnded("Data Structures Quiz");

// When results are available
// notificationStore.notifyResultsAvailable("Data Structures Quiz");


// EXAMINER NOTIFICATIONS:
// ======================

// When a student submits an attempt
// notificationStore.notifyNewAttempt("John Doe", "Data Structures Quiz");

// When a created quiz goes live
// notificationStore.notifyQuizStartedExaminer("Data Structures Quiz");

// When a quiz ends
// notificationStore.notifyQuizEndedExaminer("Data Structures Quiz");

// When a new quiz is created
// notificationStore.notifyQuizCreated("Data Structures Quiz");


// EXAMPLE: Integrate in MainDashboardPage.jsx (Student)
// =======================================================
// Add this in useEffect hook after loading quizzes:
//
// useEffect(() => {
//   getAllQuizzes()
//     .then(data => {
//       setQuizzes(data);
//       
//       // Check for quizzes starting soon and trigger notifications
//       const now = new Date();
//       data.forEach(quiz => {
//         if (quiz.scheduledDateTime) {
//           const scheduled = new Date(quiz.scheduledDateTime);
//           const timeUntilStart = scheduled - now;
//           const oneHour = 60 * 60 * 1000;
//           
//           // If quiz starts within 1 hour, notify
//           if (timeUntilStart <= oneHour && timeUntilStart > 0) {
//             notificationStore.notifyQuizStartingSoon(quiz.title);
//           }
//         }
//       });
//     })
//     .catch(e => setError(e.message));
// }, []);


// EXAMPLE: Integrate in ExaminerMainDashboard.jsx (Examiner)
// ===========================================================
// Add this when creating a new quiz or after loading quizzes:
//
// const handleCreateQuiz = async () => {
//   try {
//     const response = await createQuiz(quizData);
//     notificationStore.notifyQuizCreated(response.title);
//     navigate("/examiner/main");
//   } catch (error) {
//     // handle error
//   }
// };
