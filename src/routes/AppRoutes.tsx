import { Navigate, Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';
import { publicRoutes } from './modules/public.routes';
import { adminRoutes } from './modules/admin.routes';
import { officerRoutes } from './modules/officer.routes';
import { studentRoutes } from './modules/student.routes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public — bounced to their dashboard if already logged in */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AuthenticatedLayout />}>
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>

      {/* Officer */}
      <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
        <Route element={<AuthenticatedLayout />}>
          {officerRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<AuthenticatedLayout />}>
          {studentRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
