import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/service/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = getCurrentUser();
  const role = user?.role;

  if (!role) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
