
import { AuthProvider } from './context/AuthContext';
import AuthRoutes from './routes/authRoutes';
import CandidateRoutes from './routes/candidateRoutes';
import ExaminerRoutes from './routes/examinerRoutes';

const App = () => {
    return(
        <AuthProvider>
            <AuthRoutes/>
            <CandidateRoutes/>
            <ExaminerRoutes/>
        </AuthProvider>
    );
};

export default App;
