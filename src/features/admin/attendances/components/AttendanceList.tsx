import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CalendarDays,
  Clock,
  LogIn,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
  Attendance,
  AttendanceFormData,
} from '@/features/admin/attendances';
import { attendanceService } from '@/features/admin/attendances';
import AttendanceDialog from './AttendanceDialog';

interface AttendanceListProps {
  eventId: number;
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AttendanceList({ eventId }: AttendanceListProps) {
  const [sessions, setSessions] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    attendance: Attendance | null;
  }>({ open: false, mode: 'create', attendance: null });

  useEffect(() => {
    load();
  }, [eventId]);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await attendanceService.getAttendanceByEventId(eventId);
      setSessions(data);
    } catch {
      toast.error('Failed to load sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: AttendanceFormData) => {
    const created = await attendanceService.createAttendance(eventId, data);
    setSessions((prev) => [...prev, created]);
    setDialog({ open: false, mode: 'create', attendance: null });
    toast.success('Session Added', {
      description: `"${data.title}" has been added.`,
    });
  };

  const handleEdit = async (data: AttendanceFormData) => {
    if (!dialog.attendance) return;
    const { attendanceId } = dialog.attendance;
    await attendanceService.updateAttendance(attendanceId, data);
    setSessions((prev) =>
      prev.map((a) =>
        a.attendanceId === attendanceId ? { ...a, ...data } : a,
      ),
    );
    setDialog({ open: false, mode: 'create', attendance: null });
    toast.success('Session Updated', {
      description: `"${data.title}" has been updated.`,
    });
  };

  const handleDelete = async (att: Attendance) => {
    setDeletingId(att.attendanceId);
    try {
      await attendanceService.deleteAttendance(att.attendanceId);
      setSessions((prev) =>
        prev.filter((a) => a.attendanceId !== att.attendanceId),
      );
      toast.success('Session Removed');
    } catch {
      toast.error('Failed to delete session.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={20} className="animate-spin text-ink-faint" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.length === 0 ? (
        <div className="text-center py-4 text-sm text-ink-faint">
          No sessions yet. Add one below.
        </div>
      ) : (
        sessions.map((att) => {
          const isSignIn = att.logType === 'Sign In';
          const isDeleting = deletingId === att.attendanceId;
          return (
            <div
              key={att.attendanceId}
              className="bg-surface border border-hairline rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSignIn ? 'bg-sticker-green-tint' : 'bg-sticker-orange-tint'
                }`}
              >
                {isSignIn ? (
                  <LogIn size={15} className="text-sticker-green-ink" />
                ) : (
                  <LogOut size={15} className="text-sticker-orange-ink" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-ink truncate">
                  {att.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <Badge
                    className={`text-xs px-1.5 py-0 ${
                      isSignIn
                        ? 'bg-sticker-green-tint text-sticker-green-ink hover:bg-sticker-green-tint'
                        : 'bg-sticker-orange-tint text-sticker-orange-ink hover:bg-sticker-orange-tint'
                    }`}
                  >
                    {att.logType}
                  </Badge>
                  <span className="text-xs text-ink-faint">
                    🕐 {att.session}
                  </span>
                  <span className="text-xs text-ink-faint flex items-center gap-1">
                    <CalendarDays size={11} /> {formatDate(att.date)}
                  </span>
                  <span className="text-xs text-ink-faint flex items-center gap-1">
                    <Clock size={11} /> {formatTime(att.startTime)} –{' '}
                    {formatTime(att.endTime)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-ink-faint hover:text-ink-secondary"
                  onClick={() =>
                    setDialog({ open: true, mode: 'edit', attendance: att })
                  }
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isDeleting}
                  className="h-7 w-7 text-ink-faint hover:text-destructive"
                  onClick={() => handleDelete(att)}
                >
                  {isDeleting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </Button>
              </div>
            </div>
          );
        })
      )}

      {/* Add session button */}
      <button
        onClick={() =>
          setDialog({ open: true, mode: 'create', attendance: null })
        }
        className="w-full mt-1 border border-dashed border-hairline rounded-lg py-2.5 text-sm text-ink-muted hover:border-primary/40 hover:text-primary hover:bg-primary-soft transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus size={14} /> Add Attendance Session
      </button>

      <AttendanceDialog
        open={dialog.open}
        mode={dialog.mode}
        attendance={dialog.attendance}
        onClose={() =>
          setDialog({ open: false, mode: 'create', attendance: null })
        }
        onSubmit={dialog.mode === 'create' ? handleCreate : handleEdit}
      />
    </div>
  );
}
