import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const effectiveUser = user || (
    storedToken && storedToken !== "null" && storedToken !== "undefined" && storedRole
      ? { token: storedToken, role: storedRole }
      : null
  );

  // Save current page to session storage for back button prevention
  useEffect(() => {
    if (effectiveUser && effectiveUser.token) {
      sessionStorage.setItem("lastPage", location.pathname);
    }
  }, [location.pathname, effectiveUser]);

  if (!effectiveUser || !effectiveUser.token || effectiveUser.token === "null" || effectiveUser.token === "undefined") {
    return <Navigate to="/login" replace />;
  }
  if (role && effectiveUser.role !== role) return <Navigate to="/" replace />;
  return children;
}
