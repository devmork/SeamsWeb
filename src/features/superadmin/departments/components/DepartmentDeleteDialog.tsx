import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Department } from '@/features/departments';

interface DepartmentDeleteDialogProps {
  open: boolean;
  department: Department | null;
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DepartmentDeleteDialog({
  open,
  department,
  isProcessing,
  onConfirm,
  onClose,
}: DepartmentDeleteDialogProps) {
  if (!open || !department) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface rounded-xl shadow-elevated w-full max-w-sm mx-4 p-6">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sticker-orange-tint">
            <AlertTriangle className="size-7 text-sticker-orange-ink" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-ink">
          Delete Department
        </h2>
        <p className="mb-4 text-center text-sm text-ink-secondary">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{department.name}</span>?
        </p>

        <div className="mb-6 rounded-lg border border-sticker-orange/30 bg-sticker-orange-tint p-3">
          <p className="text-xs text-sticker-orange-ink">
            Departments that still have students, events or members are
            deactivated instead of removed.
          </p>
        </div>

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
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-destructive text-white hover:bg-destructive/90"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
