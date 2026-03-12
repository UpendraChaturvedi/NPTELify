import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const effectiveUser = user || (
    storedToken && storedToken !== "null" && storedToken !== "undefined" && storedRole
      ? { token: storedToken, role: storedRole }
      : null
  );

  if (!effectiveUser || !effectiveUser.token || effectiveUser.token === "null" || effectiveUser.token === "undefined") {
    return <Navigate to="/login" replace />;
  }
  if (role && effectiveUser.role !== role) return <Navigate to="/" replace />;
  return children;
}
