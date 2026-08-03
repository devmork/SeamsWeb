import type { RouteConfig } from '../routes.types';
import { LoginForm, SignupForm } from '@/features/auth';

export const publicRoutes: RouteConfig[] = [
  { path: '/login', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
];
