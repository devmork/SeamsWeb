import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Officer } from '@/features/admin/officers/officer.type';
import { officerService } from '@/features/admin/officers/services/OfficerService';

interface RemoveOfficerDialogProps {
  open: boolean;
  officer: Officer | null;
  onClose: () => void;
  onRemove: () => void;
  isRemoving?: boolean;
  setIsRemoving?: (value: boolean) => void;
}

export default function RemoveOfficerDialog({
  open,
  officer,
  onClose,
  onRemove,
  isRemoving = false,
  setIsRemoving,
}: RemoveOfficerDialogProps) {
  if (!open || !officer) return null;

  const handleConfirmRemove = async () => {
    if (setIsRemoving) setIsRemoving(true);
    try {
      await officerService.removeOfficer(officer.officerId);
      toast.success('Officer Removed', {
        description: `${officer.firstName} ${officer.lastName} has been reverted to student status.`,
      });
      onRemove();
      onClose();
    } catch {
      toast.error('Failed to remove officer');
    } finally {
      if (setIsRemoving) setIsRemoving(false);
    }
  };

  const getInitials = () => {
    return [officer.firstName?.[0], officer.lastName?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="size-7 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Remove Officer Access
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center mb-4">
          Are you sure you want to remove{' '}
          <span className="font-semibold">
            {officer.firstName} {officer.lastName}
          </span>{' '}
          as an officer?
        </p>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-red-700">
            They will revert to a Student account and lose Officer Portal access
            immediately.
          </p>
        </div>

        {/* Officer Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200">
          <Avatar>
            <AvatarFallback className="bg-[#2C5530]/10 text-[#2C5530]">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {officer.firstName} {officer.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{officer.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRemoving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            disabled={isRemoving}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isRemoving ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Removing...
              </>
            ) : (
              <>
                <AlertCircle size={14} className="mr-2" />
                Remove Officer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
