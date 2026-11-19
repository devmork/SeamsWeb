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
import { Textarea } from '@/components/ui/textarea';
import {
  DEPARTMENT_STATUS,
  type Department,
  type DepartmentRequest,
} from '@/features/departments';

interface DepartmentDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  department?: Department | null;
  onClose: () => void;
  onSubmit: (data: DepartmentRequest) => Promise<void>;
}

export default function DepartmentDialog({
  open,
  mode,
  department,
  onClose,
  onSubmit,
}: DepartmentDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>(String(DEPARTMENT_STATUS.Active));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(department?.name ?? '');
    setDescription(department?.description ?? '');
    setStatus(String(department?.status ?? DEPARTMENT_STATUS.Active));
    setError('');
  }, [open, department]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Department name is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        status: Number(status),
      });
    } catch (err) {
      setError(
        (err as { response?: { data?: { Error?: string } } })?.response?.data
          ?.Error ?? 'Unable to save the department. Please try again.',
      );
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
        <h2 className="text-lg font-semibold text-ink mb-1">
          {mode === 'create' ? 'New Department' : 'Edit Department'}
        </h2>
        <p className="text-sm text-ink-muted mb-5">
          {mode === 'create'
            ? 'Departments group students, officers and events.'
            : `Update ${department?.name ?? 'this department'}.`}
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="department-name">Name</Label>
            <Input
              id="department-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. College of Computer Studies"
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="department-description">Description</Label>
            <Textarea
              id="department-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(DEPARTMENT_STATUS.Active)}>
                  Active
                </SelectItem>
                <SelectItem value={String(DEPARTMENT_STATUS.Inactive)}>
                  Inactive
                </SelectItem>
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
                <Loader2 size={14} className="animate-spin mr-2" />
                Saving…
              </>
            ) : mode === 'create' ? (
              'Create Department'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
