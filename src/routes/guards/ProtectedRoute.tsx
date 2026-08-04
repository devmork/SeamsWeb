import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '@/features/auth';

type Role = 'admin' | 'officer' | 'student';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user.role.toLowerCase() as Role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}
