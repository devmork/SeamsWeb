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
import type {
  Attendance,
  AttendanceFormData,
} from '@/features/attendances/attendance.type';

interface AttendanceDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  attendance?: Attendance | null;
  onClose: () => void;
  onSubmit: (data: AttendanceFormData) => Promise<void>;
}

const EMPTY_FORM: AttendanceFormData = {
  title: '',
  date: '',
  session: '',
  logType: '',
  startTime: '',
  endTime: '',
};

function toInputTime(iso: string): string {
  if (!iso) return '';
  const t = new Date(iso);
  return t.toTimeString().slice(0, 5);
}

function toInputDate(iso: string): string {
  if (!iso) return '';
  return iso.split('T')[0];
}

export default function AttendanceDialog({
  open,
  mode,
  attendance,
  onClose,
  onSubmit,
}: AttendanceDialogProps) {
  const [form, setForm] = useState<AttendanceFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<AttendanceFormData>>({});

  useEffect(() => {
    if (mode === 'edit' && attendance) {
      setForm({
        title: attendance.title ?? '',
        date: toInputDate(attendance.date),
        session: attendance.session ?? '',
        logType: attendance.logType ?? '',
        startTime: toInputTime(attendance.startTime),
        endTime: toInputTime(attendance.endTime),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, mode, attendance]);

  if (!open) return null;

  const setField = (field: keyof AttendanceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<AttendanceFormData> = {};
    if (!form.title.trim()) e.title = 'Session title is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.session) e.session = 'Session period is required.';
    if (!form.logType) e.logType = 'Log type is required.';
    if (!form.startTime) e.startTime = 'Start time is required.';
    if (!form.endTime) e.endTime = 'End time is required.';
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      e.endTime = 'End time must be after start time.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormFilled =
    form.title.trim() &&
    form.date &&
    form.session &&
    form.logType &&
    form.startTime &&
    form.endTime;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? 'Add Attendance Session' : 'Edit Session'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mode === 'create'
                ? 'Officers will scan QR codes during this session.'
                : 'Update the session details below.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-0.5"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-5">
          {/* Session Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="att-title">
              Session Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="att-title"
              placeholder="e.g., Morning Registration"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              className={errors.title ? 'border-red-400' : ''}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Session + Log Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>
                Session <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.session}
                onValueChange={(v) => setField('session', v)}
              >
                <SelectTrigger
                  className={errors.session ? 'border-red-400' : ''}
                >
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                </SelectContent>
              </Select>
              {errors.session && (
                <p className="text-xs text-red-500">{errors.session}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>
                Log Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.logType}
                onValueChange={(v) => setField('logType', v)}
              >
                <SelectTrigger
                  className={errors.logType ? 'border-red-400' : ''}
                >
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sign In">Sign In</SelectItem>
                  <SelectItem value="Sign Out">Sign Out</SelectItem>
                </SelectContent>
              </Select>
              {errors.logType && (
                <p className="text-xs text-red-500">{errors.logType}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="att-date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="att-date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className={errors.date ? 'border-red-400' : ''}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="att-start">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="att-start"
                type="time"
                value={form.startTime}
                onChange={(e) => setField('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-400' : ''}
              />
              {errors.startTime && (
                <p className="text-xs text-red-500">{errors.startTime}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="att-end">
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="att-end"
                type="time"
                value={form.endTime}
                onChange={(e) => setField('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-400' : ''}
              />
              {errors.endTime && (
                <p className="text-xs text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormFilled || isSubmitting}
            className="bg-[#2C5530] hover:bg-[#2C5530]/90 text-white min-w-28"
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : mode === 'create' ? (
              'Add Session'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
