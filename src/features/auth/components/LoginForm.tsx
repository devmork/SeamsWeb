import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import AuthLayout from '@/shared/layouts/AuthLayout';
import { logIn } from '@/features/auth/services/AuthService';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Input } from '@/components/motion/input';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailError =
    email.length > 0 && !email.includes('@dmc.edu.ph')
      ? 'Enter a valid email address.'
      : undefined;

  const passwordError =
    password.length > 0 &&
    (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
      ? 'Password must be at least 8 chars, include a number and an uppercase letter.'
      : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await logIn({ email, password });
      const role = response.role.toLowerCase();

      if (role === 'admin') navigate({ to: '/admin/students' });
      else if (role === 'officer') navigate({ to: '/officer/dashboard' });
      else navigate({ to: '/student/dashboard' });
    } catch {
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Login to your account to continue
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="email@dmc.edu.ph"
              leftIcon={<Mail />}
              error={emailError}
              required
              className="bg-background"
              value={email}
              onChange={setEmail}
            />
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={setPassword}
                error={passwordError}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="pointer-events-auto"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
              />
            </div>
          </Field>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
