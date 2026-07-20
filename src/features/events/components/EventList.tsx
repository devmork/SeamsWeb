import { useEffect, useState } from 'react';
import {
  Plus,
  CalendarDays,
  Layers,
  Pencil,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  LogIn,
  LogOut,
  Search,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Event, EventFormData } from '@/features/events/event.type';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/features/events/services/EventService';
import EventDialog from './EventDialog';
import AttendanceDialog from '@/features/attendances/components/AttendanceDialog';
import type {
  Attendance,
  AttendanceFormData,
} from '@/features/attendances/attendance.type';
import attendanceService from '@/features/attendances/services/AttendanceService';

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<number, Attendance[]>
  >({});
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [loadingSessionsFor, setLoadingSessionsFor] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Event dialog state
  const [eventDialog, setEventDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    event: Event | null;
  }>({ open: false, mode: 'create', event: null });

  // Attendance dialog state
  const [attDialog, setAttDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    attendance: Attendance | null;
    eventId: number | null;
  }>({ open: false, mode: 'create', attendance: null, eventId: null });

  // Delete confirm state
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [deletingAttId, setDeletingAttId] = useState<number | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setError('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = async (eventId: number) => {
    const next = new Set(expandedIds);
    if (next.has(eventId)) {
      next.delete(eventId);
      setExpandedIds(next);
      return;
    }
    next.add(eventId);
    setExpandedIds(next);

    // Only fetch if not yet loaded
    if (!attendanceMap[eventId]) {
      setLoadingSessionsFor(eventId);
      try {
        const sessions =
          await attendanceService.getAttendanceByEventId(eventId);
        setAttendanceMap((prev) => ({ ...prev, [eventId]: sessions }));
      } catch {
        toast.error('Failed to load sessions.');
      } finally {
        setLoadingSessionsFor(null);
      }
    }
  };

  // ── Event CRUD ──────────────────────────────────────────────────────────────
  const handleCreateEvent = async (data: EventFormData) => {
    try {
      const created = await createEvent(data);
      setEvents((prev) => [...prev, created]);
      setEventDialog({ open: false, mode: 'create', event: null });
      toast.success('Event Created', {
        description: `"${data.title}" has been added.`,
      });
    } catch {
      toast.error('Failed to create event. Please try again.');
    }
  };

  const handleEditEvent = async (data: EventFormData) => {
    if (!eventDialog.event) return;
    const { eventId } = eventDialog.event;
    try {
      await updateEvent(eventId, data);
      setEvents((prev) =>
        prev.map((e) => (e.eventId === eventId ? { ...e, ...data } : e)),
      );
      setEventDialog({ open: false, mode: 'create', event: null });
      toast.success('Event Updated', {
        description: `"${data.title}" has been updated.`,
      });
    } catch {
      toast.error('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    setDeletingEventId(event.eventId);
    try {
      await deleteEvent(event.eventId);
      setEvents((prev) => prev.filter((e) => e.eventId !== event.eventId));
      setExpandedIds((prev) => {
        const n = new Set(prev);
        n.delete(event.eventId);
        return n;
      });
      toast.success('Event Deleted', {
        description: `"${event.title}" has been removed.`,
      });
    } catch {
      toast.error('Failed to delete event. Please try again.');
    } finally {
      setDeletingEventId(null);
    }
  };

  // ── Attendance CRUD ─────────────────────────────────────────────────────────
  const handleCreateAttendance = async (data: AttendanceFormData) => {
    if (!attDialog.eventId) return;
    const eventId = attDialog.eventId;
    try {
      const created = await attendanceService.createAttendance(eventId, data);
      setAttendanceMap((prev) => ({
        ...prev,
        [eventId]: [...(prev[eventId] ?? []), created],
      }));
      setAttDialog({
        open: false,
        mode: 'create',
        attendance: null,
        eventId: null,
      });
      toast.success('Session Added', {
        description: `"${data.title}" has been added.`,
      });
    } catch {
      toast.error('Failed to add session. Please try again.');
    }
  };

  const handleEditAttendance = async (data: AttendanceFormData) => {
    if (!attDialog.attendance) return;
    const { attendanceId, eventId } = attDialog.attendance;
    try {
      await attendanceService.updateAttendance(attendanceId, data);
      setAttendanceMap((prev) => ({
        ...prev,
        [eventId]: (prev[eventId] ?? []).map((a) =>
          a.attendanceId === attendanceId ? { ...a, ...data } : a,
        ),
      }));
      setAttDialog({
        open: false,
        mode: 'create',
        attendance: null,
        eventId: null,
      });
      toast.success('Session Updated', {
        description: `"${data.title}" has been updated.`,
      });
    } catch {
      toast.error('Failed to update session. Please try again.');
    }
  };

  const handleDeleteAttendance = async (att: Attendance) => {
    setDeletingAttId(att.attendanceId);
    try {
      await attendanceService.deleteAttendance(att.attendanceId);
      setAttendanceMap((prev) => ({
        ...prev,
        [att.eventId]: (prev[att.eventId] ?? []).filter(
          (a) => a.attendanceId !== att.attendanceId,
        ),
      }));
      toast.success('Session Removed');
    } catch {
      toast.error('Failed to delete session. Please try again.');
    } finally {
      setDeletingAttId(null);
    }
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search on the LEFT */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Event Button on the RIGHT */}
          <Button
            onClick={() =>
              setEventDialog({ open: true, mode: 'create', event: null })
            }
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Create Event
          </Button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={28} className="text-gray-400 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading events…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadEvents}>
            Try again
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2C5530]/10 flex items-center justify-center mb-4">
            <CalendarDays size={28} className="text-[#2C5530]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No events yet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-4">
            Create your first event to start managing SSG attendance sessions.
          </p>
          <Button
            onClick={() =>
              setEventDialog({ open: true, mode: 'create', event: null })
            }
            className="bg-[#2C5530] hover:bg-[#2C5530]/90 text-white flex items-center gap-1.5"
          >
            <Plus size={14} />
            Create Event
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={36} className="text-gray-300 mb-3" />
          <p className="text-gray-500">No events match your search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((event) => {
            const isExpanded = expandedIds.has(event.eventId);
            const sessions = attendanceMap[event.eventId] ?? [];
            const isLoadingSessions = loadingSessionsFor === event.eventId;
            const isDeletingEvent = deletingEventId === event.eventId;

            return (
              <Card
                key={event.eventId}
                className="overflow-hidden border border-gray-200 shadow-sm"
              >
                {/* Event row */}
                <CardContent className="p-0">
                  <div
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(event.eventId)}
                  >
                    {/* Folder icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#2C5530]/10 flex items-center justify-center shrink-0">
                      <FolderOpen size={18} className="text-[#2C5530]" />
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {formatDate(event.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers size={11} />
                          {sessions.length > 0 || isExpanded
                            ? `${sessions.length} session${sessions.length !== 1 ? 's' : ''}`
                            : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-gray-700"
                        onClick={() =>
                          setEventDialog({ open: true, mode: 'edit', event })
                        }
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeletingEvent}
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteEvent(event)}
                      >
                        {isDeletingEvent ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                      <Separator orientation="vertical" className="h-5 mx-1" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400"
                        onClick={() => toggleExpand(event.eventId)}
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded sessions */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 flex flex-col gap-2">
                      {isLoadingSessions ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2
                            size={20}
                            className="animate-spin text-gray-400"
                          />
                        </div>
                      ) : sessions.length === 0 ? (
                        <div className="text-center py-4 text-sm text-gray-400">
                          No sessions yet. Add one below.
                        </div>
                      ) : (
                        sessions.map((att) => {
                          const isDeletingAtt =
                            deletingAttId === att.attendanceId;
                          const isSignIn = att.logType === 'Sign In';
                          return (
                            <div
                              key={att.attendanceId}
                              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3"
                            >
                              {/* Log type icon */}
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSignIn ? 'bg-green-100' : 'bg-orange-100'
                                }`}
                              >
                                {isSignIn ? (
                                  <LogIn size={15} className="text-green-600" />
                                ) : (
                                  <LogOut
                                    size={15}
                                    className="text-orange-500"
                                  />
                                )}
                              </div>

                              {/* Session info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {att.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                  <Badge
                                    className={`text-xs px-1.5 py-0 ${
                                      isSignIn
                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                        : 'bg-orange-100 text-orange-600 hover:bg-orange-100'
                                    }`}
                                  >
                                    {att.logType}
                                  </Badge>
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    🕐 {att.session}
                                  </span>
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <CalendarDays size={11} />
                                    {formatDate(att.date)}
                                  </span>
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={11} />
                                    {formatTime(att.startTime)} –{' '}
                                    {formatTime(att.endTime)}
                                  </span>
                                </div>
                              </div>

                              {/* Session actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-gray-400 hover:text-gray-700"
                                  onClick={() =>
                                    setAttDialog({
                                      open: true,
                                      mode: 'edit',
                                      attendance: att,
                                      eventId: att.eventId,
                                    })
                                  }
                                >
                                  <Pencil size={13} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={isDeletingAtt}
                                  className="h-7 w-7 text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteAttendance(att)}
                                >
                                  {isDeletingAtt ? (
                                    <Loader2
                                      size={13}
                                      className="animate-spin"
                                    />
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
                          setAttDialog({
                            open: true,
                            mode: 'create',
                            attendance: null,
                            eventId: event.eventId,
                          })
                        }
                        className="w-full mt-1 border border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-500 hover:border-[#2C5530] hover:text-[#2C5530] hover:bg-[#2C5530]/5 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus size={14} />
                        Add Attendance Session
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <EventDialog
        open={eventDialog.open}
        mode={eventDialog.mode}
        event={eventDialog.event}
        onClose={() =>
          setEventDialog({ open: false, mode: 'create', event: null })
        }
        onSubmit={
          eventDialog.mode === 'create' ? handleCreateEvent : handleEditEvent
        }
      />

      <AttendanceDialog
        open={attDialog.open}
        mode={attDialog.mode}
        attendance={attDialog.attendance}
        onClose={() =>
          setAttDialog({
            open: false,
            mode: 'create',
            attendance: null,
            eventId: null,
          })
        }
        onSubmit={
          attDialog.mode === 'create'
            ? handleCreateAttendance
            : handleEditAttendance
        }
      />
    </div>
  );
}
