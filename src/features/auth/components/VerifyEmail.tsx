import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import {
  verifyEmail,
  resendVerification,
} from '@/features/auth/services/AuthService';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

type DialogState = {
  variant: 'default' | 'destructive';
  title: string;
  description: string;
  actionLabel: string;
  action: () => void;
} | null;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: '/_auth/verify' }) as { email: string };
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [dialog, setDialog] = useState<DialogState>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const closeDialog = () => setDialog(null);

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

      // ✅ Success — tell the user what happens next, then send them to login
      setDialog({
        variant: 'default',
        title: 'Email verified!',
        description:
          'Your application is now pending review by our admin team. If your account is approved, you will receive an email with your email address and a temporary password. You can use those credentials to log in.',
        actionLabel: 'Go to Login',
        action: () => navigate({ to: '/login' }),
      });
    } catch {
      setDialog({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Invalid or expired code. Please try again.',
        actionLabel: 'Try Again',
        action: () => {
          setDigits(Array(CODE_LENGTH).fill(''));
          // Focus on next tick so the dialog has already closed
          setTimeout(() => inputsRef.current[0]?.focus(), 0);
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      await resendVerification(email);
      setSecondsLeft(RESEND_SECONDS);
      setDialog({
        variant: 'default',
        title: 'Code resent',
        description: `We've sent a new verification code to ${email}. Check your inbox (and spam folder).`,
        actionLabel: 'Got it',
        action: () => closeDialog(),
      });
    } catch {
      setDialog({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Could not resend the code. Please try again later.',
        actionLabel: 'Try Again',
        action: () => closeDialog(),
      });
    }
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

      {/* ── Dialog ────────────────────────────────────────────────────── */}
      <AlertDialog
        open={!!dialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <AlertDialogContent className="max-w-sm gap-4">
          {/* X close button, top-right */}
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close"
            className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <X className="size-4" />
          </button>

          {/* Centered title + description */}
          <div className="flex flex-col items-center gap-2 px-4 pt-4 text-center">
            <AlertDialogTitle className="text-2xl font-bold">
              {dialog?.title ?? ''}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {dialog?.description ?? ''}
            </AlertDialogDescription>
          </div>

          {/* Centered action button */}
          <div className="flex justify-center pb-2">
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // keep dialog mounted until our action runs
                dialog?.action();
                if (
                  dialog?.variant === 'default' ||
                  dialog?.actionLabel === 'Got it'
                ) {
                  closeDialog();
                }
              }}
              variant={
                dialog?.variant === 'destructive' ? 'destructive' : 'default'
              }
              className="min-w-32 rounded-full px-6"
            >
              {dialog?.actionLabel ?? 'OK'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
