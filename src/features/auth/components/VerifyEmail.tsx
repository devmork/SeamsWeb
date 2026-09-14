import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import AuthLayout from '@/shared/layouts/AuthLayout';
import {
  verifyEmail,
  resendVerification,
} from '@/features/auth/services/AuthService';
import { toast } from 'sonner';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: '/_auth/verify' }) as { email: string };
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[i] = value;
    setDigits(next);
    if (value && i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join('').length === CODE_LENGTH) {
      submit(next.join(''));
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0)
      inputsRef.current[i - 1]?.focus();
  };

  const submit = async (code: string) => {
    setIsSubmitting(true);
    try {
      await verifyEmail(email, code);
      toast.success('Email verified!');
      navigate({ to: '/login' });
    } catch {
      toast.error('Invalid or expired code.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    await resendVerification(email);
    setSecondsLeft(RESEND_SECONDS);
    toast.success('Verification code resent.');
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          Please enter the verification code we sent to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <div className="flex gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isSubmitting}
              inputMode="numeric"
              maxLength={1}
              className="size-11 rounded-md border bg-muted/40 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Don&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0}
            className="font-medium text-foreground underline underline-offset-4 disabled:no-underline disabled:text-muted-foreground"
          >
            Resend {secondsLeft > 0 ? `(${secondsLeft}s)` : ''}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
