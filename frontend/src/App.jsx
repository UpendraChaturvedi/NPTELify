
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthRoutes from './routes/authRoutes';
import CandidateRoutes from './routes/candidateRoutes';
import ExaminerRoutes from './routes/examinerRoutes';
import { notificationStore } from './utils/notificationStore';

// Component to sync auth state with notification store
function NotificationSyncProvider({ children }) {
  const auth = useAuth();

  useEffect(() => {
    // Update notification store with current user
    // Use token as unique user identifier (most reliable)
    if (auth.user && auth.user.token) {
      notificationStore.setCurrentUser(auth.user.token);
    } else {
      notificationStore.setCurrentUser(null);
    }
  }, [auth.user]);

  return children;
}

const App = () => {
    return(
        <AuthProvider>
            <NotificationSyncProvider>
                <AuthRoutes/>
                <CandidateRoutes/>
                <ExaminerRoutes/>
            </NotificationSyncProvider>
        </AuthProvider>
    );
};

export default App;
