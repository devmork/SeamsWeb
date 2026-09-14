import { createFileRoute } from '@tanstack/react-router';
import VerifyEmail from '@/features/auth/components/VerifyEmail';

type VerifySearch = { email: string };

export const Route = createFileRoute('/_auth/verify')({
  validateSearch: (search: Record<string, unknown>): VerifySearch => ({
    email: (search.email as string) ?? '',
  }),
  component: VerifyEmail,
});
