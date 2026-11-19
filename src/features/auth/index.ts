export { default as LoginForm } from './components/LoginForm';
export { default as SignupForm } from './components/SignupForm';
export { default as VerifyEmail } from './components/VerifyEmail';

export { default as authService } from './services/AuthService';

export { requireRole, ROLE_HOME } from './guards';
export { normalizeRole } from './types';
export type { UserRole, User, AuthResponse } from './types';
