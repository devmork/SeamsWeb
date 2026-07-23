import { useState } from 'react';
import { X, Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { programOptions, yearLevelOptions } from '@/config/filter';
import type { Student, StudentRequest } from '@/features/students/student.type';
import { studentService } from '@/features/students/services/StudentService';

interface StudentDetailDialogProps {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onUpdated?: () => void;
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

function toRequest(student: Student): StudentRequest {
  return {
    firstName: student.firstName,
    middleName: student.middleName,
    lastName: student.lastName,
    suffix: student.suffix,
    email: student.email,
    schoolStudentId: student.schoolStudentId,
    yearLevel: student.yearLevel,
    course: student.course,
    photoUrl: student.photoUrl,
  };
}

export default function StudentDetailDialog({
  open,
  student,
  onClose,
  onUpdated,
}: StudentDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<StudentRequest | null>(null);

  if (!open || !student) return null;

  // Initialize form when entering edit mode
  const startEditing = () => {
    setForm(toRequest(student));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(null);
    setIsEditing(false);
  };

  const update = (patch: Partial<StudentRequest>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = async () => {
    if (!form) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error('Please fill in first name, last name, and email');
      return;
    }
    setIsSaving(true);
    try {
      await studentService.updateStudent(student.studentId, form);
      toast.success('Student Updated', {
        description: `${getFullName(student)}'s information has been updated.`,
      });
      setIsEditing(false);
      setForm(null);
      onUpdated?.();
      onClose();
    } catch {
      toast.error('Failed to update student');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Student' : 'Student Details'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? 'Update student information'
                : 'View complete student information'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b">
            <Avatar className="size-16">
              <AvatarImage src={student.photoUrl || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {getInitials(student)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {getFullName(student)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{student.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  className={
                    student.status === 1
                      ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }
                >
                  {student.status === 1 ? '● Active' : '● Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    value={form?.firstName ?? ''}
                    onChange={(e) => update({ firstName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{student.firstName}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Last Name
                </Label>
                {isEditing ? (
                  <Input
                    value={form?.lastName ?? ''}
                    onChange={(e) => update({ lastName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{student.lastName}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Middle Name
                </Label>
                {isEditing ? (
                  <Input
                    value={form?.middleName ?? ''}
                    onChange={(e) => update({ middleName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {student.middleName || '—'}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Suffix
                </Label>
                {isEditing ? (
                  <Input
                    value={form?.suffix ?? ''}
                    onChange={(e) => update({ suffix: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {student.suffix || '—'}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={form?.email ?? ''}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{student.email}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* School Information */}
          <div className="my-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              School Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Student ID
                </Label>
                {isEditing ? (
                  <Input
                    value={form?.schoolStudentId ?? ''}
                    onChange={(e) =>
                      update({ schoolStudentId: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                    {student.schoolStudentId}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Program
                </Label>
                {isEditing ? (
                  <Select
                    value={form?.course ?? ''}
                    onValueChange={(v) => update({ course: v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((prog) => (
                        <SelectItem key={prog} value={prog}>
                          {prog}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900">{student.course}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Year Level
                </Label>
                {isEditing ? (
                  <Select
                    value={String(form?.yearLevel ?? '')}
                    onValueChange={(v) => update({ yearLevel: Number(v) })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearLevelOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}st Year
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900">{student.yearLevel}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Information (read-only — status is managed via Deactivate) */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Account Status
            </h4>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {student.status === 1 ? 'Active' : 'Inactive'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {student.status === 1
                    ? 'Student can access the portal'
                    : 'Student cannot access the portal'}
                </p>
              </div>
              <Badge
                className={
                  student.status === 1
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                }
              >
                {student.status === 1 ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelEditing}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button onClick={startEditing} className="flex-1">
                <Pencil size={16} />
                Edit Information
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
