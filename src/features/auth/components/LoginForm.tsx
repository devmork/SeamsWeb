import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/motion/input';
import AuthLayout from '@/shared/layouts/AuthLayout';
import { logIn } from '@/features/auth/services/AuthService';
import { useAuthStore } from '@/features/auth/Stores/AuthStore';
import type { AuthResponse, User } from '@/features/auth/types';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .refine((val) => val.endsWith('@dmc.edu.ph'), {
      message: 'Must be a @dmc.edu.ph email',
    }),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function normalizeUser(response: AuthResponse): User {
  return {
    id: response.userId,
    name: response.name ?? response.email.split('@')[0],
    email: response.email,
    role: response.role.toLowerCase(),
    avatar: response.avatar ?? null,
  };
}

export default function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => logIn(data),
    onSuccess: (response) => {
      const user = normalizeUser(response);
      setAuth(response.token, user);

      const role = user.role;
      if (role === 'admin') {
        navigate({ to: '/admin/students' });
      } else if (role === 'officer') {
        navigate({ to: '/officer/dashboard' });
      } else {
        navigate({ to: '/student/dashboard' });
      }
    },
    onError: () => {
      toast.error('Invalid email or password. Please try again.');
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Login to your account to continue
            </p>
          </div>

          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  placeholder="email@dmc.edu.ph"
                  leftIcon={<Mail />}
                  className="bg-background"
                  error={form.formState.errors.email?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          {/* Password Field */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  error={form.formState.errors.password?.message}
                  value={field.value}
                  onChange={field.onChange}
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
              )}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Log in'}
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