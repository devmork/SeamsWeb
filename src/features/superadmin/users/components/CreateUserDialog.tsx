import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departmentService } from '@/features/departments';
import type { Department } from '@/features/departments';
import type { UserRole } from '@/features/auth/types';
import { userService } from '../services/userService';
import { ASSIGNABLE_ROLES } from '../types';

const NO_DEPARTMENT = 'none';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === 'object') {
      if ('Error' in data && typeof data.Error === 'string' && data.Error) {
        return data.Error;
      }
      // ASP.NET validation problems return a { errors: { field: [msg] } } map.
      if ('errors' in data && data.errors && typeof data.errors === 'object') {
        const first = Object.values(
          data.errors as Record<string, unknown>,
        ).flat()[0];
        if (typeof first === 'string' && first) return first;
      }
    }
  }
  return fallback;
}

export default function CreateUserDialog({
  open,
  onClose,
  onCreated,
}: CreateUserDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('student');
  const [departmentId, setDepartmentId] = useState<string>(NO_DEPARTMENT);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setEmail('');
    setPassword('');
    setRole('student');
    setDepartmentId(NO_DEPARTMENT);
    setError('');
    (async () => {
      try {
        setDepartments(await departmentService.getDepartments());
      } catch {
        // Departments are optional; leave the picker empty.
        setDepartments([]);
      }
    })();
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await userService.createUser({
        email: email.trim(),
        password,
        role: role as UserRole,
        departmentId:
          departmentId === NO_DEPARTMENT ? undefined : Number(departmentId),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'Unable to create the user.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface rounded-xl shadow-elevated w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-ink">New User</h2>
        <p className="mt-1 mb-5 text-sm text-ink-muted">
          Creates the account with the role you choose. Share the password with
          the user.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-user-email">Email</Label>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@dmc.edu.ph"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-user-password">Password</Label>
            <Input
              id="new-user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNABLE_ROLES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_DEPARTMENT}>No department</SelectItem>
                {departments.map((department) => (
                  <SelectItem
                    key={department.departmentId}
                    value={String(department.departmentId)}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Creating…
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
