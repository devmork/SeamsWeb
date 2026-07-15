import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/AuthLayout';
import { logIn } from '@/features/auth/services/AuthService';
import { toast } from 'sonner';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await logIn({ email, password });
      const role = response.role.toLowerCase();

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'officer') navigate('/officer/dashboard');
      else navigate('/student/dashboard');
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
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Input
              id="password"
              type="password"
              required
              className="bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
