import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HelpSupportPage from "../pages/HelpSupportPage";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/help" element={<HelpSupportPage />} />
    </Routes>
  );
};

export default AuthRoutes;