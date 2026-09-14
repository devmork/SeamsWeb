import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
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
    <div className="relative flex min-h-svh flex-col bg-background">
      {/* Center content */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
          <p className="text-sm text-muted-foreground">
            Please enter the verification code we sent to
            <br />
            <span className="font-semibold text-foreground">{email}</span>
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
                aria-label={`Digit ${i + 1}`}
                className="h-16 w-12 rounded-xl border border-input bg-muted text-center text-2xl font-medium text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40 disabled:opacity-50 sm:h-20 sm:w-14"
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0}
              className="font-semibold text-foreground underline underline-offset-4 disabled:text-muted-foreground disabled:no-underline"
            >
              Resend{secondsLeft > 0 ? ` (${secondsLeft})` : ''}
            </button>
          </p>

          {/* <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Protected by Student Data Privacy Act (RA 10173). Secure
            verification channel.
          </p> */}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center text-xs text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          Powered by CCS - Developers v0.0.0
        </p>
      </div>
    </div>
  );
}
