import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/features/auth';

export default function PublicRoute() {
  const user = authService.getCurrentUser();

  if (user) {
    const role = user.role.toLowerCase();
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}
