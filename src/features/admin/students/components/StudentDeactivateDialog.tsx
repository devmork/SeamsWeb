import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Student } from '@/features/admin/students/student.type';
import { studentService } from '@/features/admin/students/services/StudentService';

interface StudentDeactivateDialogProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onDeactivate: () => void;
  isProcessing?: boolean;
  setIsProcessing?: (value: boolean) => void;
}

function getFullName(student: Student) {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
    student.suffix,
  ]
    .filter(Boolean)
    .join(' ');
}

function getInitials(student: Student) {
  return [student.firstName?.[0], student.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

export default function StudentDeactivateDialog({
  open,
  student,
  onClose,
  onDeactivate,
  isProcessing = false,
  setIsProcessing,
}: StudentDeactivateDialogProps) {
  if (!open || !student) return null;

  const handleConfirmDeactivate = async () => {
    if (setIsProcessing) setIsProcessing(true);
    try {
      await studentService.deactivateStudent(student.studentId);
      toast.success('Student Deactivated', {
        description: `${getFullName(student)} has been deactivated.`,
      });
      onDeactivate();
      onClose();
    } catch {
      toast.error('Failed to deactivate student');
    } finally {
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface rounded-xl shadow-elevated w-full max-w-sm mx-4 p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-sticker-orange-tint flex items-center justify-center">
            <AlertCircle className="size-7 text-sticker-orange-ink" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-ink text-center mb-2">
          Deactivate Student Account
        </h2>

        {/* Description */}
        <p className="text-sm text-ink-secondary text-center mb-4">
          Are you sure you want to deactivate{' '}
          <span className="font-semibold">{getFullName(student)}</span>?
        </p>

        {/* Warning */}
        <div className="bg-sticker-orange-tint border border-sticker-orange/30 rounded-lg p-3 mb-6">
          <p className="text-xs text-sticker-orange-ink">
            This student will lose access to the portal immediately and cannot
            log in until reactivated.
          </p>
        </div>

        {/* Student Card */}
        <div className="flex items-center gap-3 p-3 bg-canvas-soft rounded-lg mb-6 border border-hairline">
          <Avatar>
            <AvatarFallback className="bg-canvas-soft text-ink-muted">
              {getInitials(student)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ink truncate">
              {getFullName(student)}
            </p>
            <p className="text-xs text-ink-muted truncate">{student.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeactivate}
            disabled={isProcessing}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Deactivating...
              </>
            ) : (
              <>
                <AlertCircle size={14} className="mr-2" />
                Deactivate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
