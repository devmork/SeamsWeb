import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Event, EventFormData } from '@/features/events/event.type';

interface EventDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  event?: Event | null;
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
}

const EMPTY_FORM: EventFormData = { title: '', startDate: '', endDate: '' };

function toInputDate(iso: string): string {
  if (!iso) return '';
  return iso.split('T')[0]; // "2026-06-20T00:00:00" → "2026-06-20"
}

export default function EventDialog({
  open,
  mode,
  event,
  onClose,
  onSubmit,
}: EventDialogProps) {
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && event) {
      setForm({
        title: event.title ?? '',
        startDate: toInputDate(event.startDate),
        endDate: toInputDate(event.endDate),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, mode, event]);

  if (!open) return null;

  const set =
    (field: keyof EventFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<EventFormData> = {};
    if (!form.title.trim()) newErrors.title = 'Event name is required.';
    if (!form.startDate) newErrors.startDate = 'Start date is required.';
    if (!form.endDate) newErrors.endDate = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = 'End date must be after start date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const isFormFilled = form.title.trim() && form.startDate && form.endDate;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dialog */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? 'Create New Event' : 'Edit Event'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mode === 'create'
                ? 'Add attendance sessions to the event after creating it.'
                : 'Update the event details below.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 mt-5">
          {/* Event Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="event-title">
              Event Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="event-title"
              placeholder="e.g., DMC Founders Day 2026"
              value={form.title}
              onChange={set('title')}
              className={
                errors.title ? 'border-red-400 focus-visible:ring-red-300' : ''
              }
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-start">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-start"
                type="date"
                value={form.startDate}
                onChange={set('startDate')}
                className={
                  errors.startDate
                    ? 'border-red-400 focus-visible:ring-red-300'
                    : ''
                }
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-end">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-end"
                type="date"
                value={form.endDate}
                onChange={set('endDate')}
                min={form.startDate}
                className={
                  errors.endDate
                    ? 'border-red-400 focus-visible:ring-red-300'
                    : ''
                }
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
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
              'Create Event'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
