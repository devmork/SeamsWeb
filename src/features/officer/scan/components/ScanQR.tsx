import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  Clock,
  LogIn,
  LogOut,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllEvents } from '@/features/admin/events/services/EventService';
import type { Event } from '@/features/admin/events/event.type';
import { attendanceService } from '@/features/admin/attendances';
import type { Attendance } from '@/features/admin/attendances';
import type { AttendanceQrResponse } from '@/features/admin/attendances';
import { attendanceRecordService } from '../services/AttendanceRecordService';
import {
  ATTENDANCE_STATUS,
  type AttendanceRecordResponse,
} from '../attendance-record.types';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatSessionLabel(session: Attendance): string {
  return `${session.title} — ${formatDate(session.date)}, ${formatTime(session.startTime)}`;
}

function StatusBadge({ status }: { status: number }) {
  return status === ATTENDANCE_STATUS.Present ? (
    <Badge variant="success">Present</Badge>
  ) : (
    <Badge variant="danger">Absent</Badge>
  );
}

/**
 * Officer portal — a Monitor surface: the rotating session QR is the focal
 * object and the scan feed is a dense, glanceable list. Lives inside
 * AuthenticatedLayout, so it renders no chrome of its own.
 */
export default function ScanQR() {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<Attendance[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string>('');

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);

  const [qr, setQr] = useState<AttendanceQrResponse | null>(null);
  const [scanHistory, setScanHistory] = useState<AttendanceRecordResponse[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedEvent = useMemo(
    () => events.find((e) => String(e.eventId) === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const selectedAttendance = useMemo(
    () =>
      sessions.find((s) => String(s.attendanceId) === selectedAttendanceId) ??
      null,
    [sessions, selectedAttendanceId],
  );

  // Load events once
  useEffect(() => {
    (async () => {
      try {
        setEvents(await getAllEvents());
      } catch {
        toast.error('Unable to load events.');
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, []);

  // Load sessions whenever the event changes
  useEffect(() => {
    setSelectedAttendanceId('');
    setSessions([]);
    setQr(null);
    setScanHistory([]);
    if (!selectedEventId) return;

    (async () => {
      setLoadingSessions(true);
      try {
        const data = await attendanceService.getAttendanceByEventId(
          Number(selectedEventId),
        );
        setSessions(data);
      } catch {
        toast.error('Unable to load attendance sessions for this event.');
      } finally {
        setLoadingSessions(false);
      }
    })();
  }, [selectedEventId]);

  // Load scan history whenever the session changes
  useEffect(() => {
    setScanHistory([]);
    if (!selectedAttendanceId) {
      setQr(null);
      return;
    }
    (async () => {
      try {
        const data = await attendanceRecordService.getByAttendanceId(
          Number(selectedAttendanceId),
        );
        setScanHistory(data);
      } catch {
        setScanHistory([]);
      }
    })();
  }, [selectedAttendanceId]);

  // Fetch + auto-refresh the rotating session QR
  const fetchQr = async (attendanceId: number) => {
    setLoadingQr(true);
    try {
      const data = await attendanceService.getAttendanceQr(attendanceId);
      setQr(data);
      setCountdown(data.refreshInSeconds);
    } catch {
      toast.error('Unable to load the session QR code.');
      setQr(null);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    if (!selectedAttendanceId) {
      setQr(null);
      return;
    }
    fetchQr(Number(selectedAttendanceId));

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [selectedAttendanceId]);

  // Schedule refresh + countdown whenever a new QR is loaded
  useEffect(() => {
    if (!qr || !selectedAttendanceId) return;

    if (countdownRef.current) clearInterval(countdownRef.current);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    refreshTimerRef.current = setTimeout(() => {
      fetchQr(Number(selectedAttendanceId));
    }, qr.refreshInSeconds * 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [qr?.token]);

  // Poll scan history periodically while a session is active
  useEffect(() => {
    if (!selectedAttendanceId) return;
    const interval = setInterval(async () => {
      try {
        const data = await attendanceRecordService.getByAttendanceId(
          Number(selectedAttendanceId),
        );
        setScanHistory(data);
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedAttendanceId]);

  const handleManualRefresh = () => {
    if (selectedAttendanceId) fetchQr(Number(selectedAttendanceId));
  };

  const qrSrc = qr?.qrCode
    ? `data:image/png;base64,${qr.qrCode}`
    : null;

  const rotationRatio =
    qr && qr.refreshInSeconds > 0
      ? Math.max(0, Math.min(1, countdown / qr.refreshInSeconds))
      : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="type-eyebrow text-ink-muted">Officer Portal</p>
        <h1 className="type-heading-2 mt-1 text-ink">Session QR</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Display the rotating QR for students to scan, and watch arrivals as
          they happen.
        </p>
      </div>

      {/* Session picker — the Operate part, kept compact above the monitor. */}
      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="officer-event"
              className="text-xs font-medium text-ink-muted"
            >
              Event
            </label>
            <Select
              value={selectedEventId}
              onValueChange={setSelectedEventId}
              disabled={loadingEvents}
            >
              <SelectTrigger id="officer-event">
                <SelectValue
                  placeholder={
                    loadingEvents ? 'Loading events…' : 'Choose an event'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.eventId} value={String(event.eventId)}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="officer-session"
              className="text-xs font-medium text-ink-muted"
            >
              Attendance session
            </label>
            <Select
              value={selectedAttendanceId}
              onValueChange={setSelectedAttendanceId}
              disabled={!selectedEventId || loadingSessions}
            >
              <SelectTrigger id="officer-session">
                <SelectValue
                  placeholder={
                    !selectedEventId
                      ? 'Select an event first'
                      : loadingSessions
                        ? 'Loading sessions…'
                        : 'Choose a session'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem
                    key={session.attendanceId}
                    value={String(session.attendanceId)}
                  >
                    <span className="flex items-center gap-2">
                      {session.logType?.toLowerCase().includes('out') ? (
                        <LogOut className="h-3.5 w-3.5 text-ink-muted" />
                      ) : (
                        <LogIn className="h-3.5 w-3.5 text-ink-muted" />
                      )}
                      {formatSessionLabel(session)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* QR stage — the focal object. */}
        <Card>
          <CardHeader>
            <CardTitle className="type-title text-ink">
              {selectedEvent?.title ?? 'Session QR'}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
              {selectedAttendance ? (
                <>
                  <span>{selectedAttendance.title}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(selectedAttendance.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(selectedAttendance.startTime)} –{' '}
                    {formatTime(selectedAttendance.endTime)}
                  </span>
                  <Badge variant="outline">{selectedAttendance.session}</Badge>
                </>
              ) : (
                'Select an event and session to start.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-hairline bg-canvas-soft/40">
              {!selectedAttendanceId ? (
                <div className="flex flex-col items-center gap-2 px-8 py-10 text-center">
                  <QrCode className="h-8 w-8 text-ink-faint" />
                  <p className="text-sm text-ink-muted">
                    Select an event and session to display the QR code.
                  </p>
                </div>
              ) : loadingQr ? (
                <div className="flex flex-col items-center gap-2 px-8 py-10 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-ink-faint" />
                  <p className="text-sm text-ink-muted">Generating QR code…</p>
                </div>
              ) : qrSrc ? (
                <div className="flex w-full flex-col items-center gap-3 px-6 py-6">
                  <img
                    src={qrSrc}
                    alt="Session attendance QR code"
                    className="h-64 w-64 rounded-lg border border-hairline bg-surface object-contain"
                  />
                  <div className="flex w-full max-w-64 flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3.5 w-3.5" />
                        Refreshes in {countdown}s
                      </span>
                      <span className="tabular-nums">
                        {qr?.refreshInSeconds ?? 0}s cycle
                      </span>
                    </div>
                    <div
                      className="h-1 w-full overflow-hidden rounded-full bg-primary-soft"
                      role="progressbar"
                      aria-label="Time until the QR code rotates"
                      aria-valuenow={countdown}
                      aria-valuemin={0}
                      aria-valuemax={qr?.refreshInSeconds ?? 0}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                        style={{ width: `${rotationRatio * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualRefresh}
                  >
                    Refresh now
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 px-8 py-10 text-center">
                  <QrCode className="h-8 w-8 text-ink-faint" />
                  <p className="text-sm text-ink-muted">QR code unavailable.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan feed — dense, glanceable, live. */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="type-title text-ink">Scans</CardTitle>
              <CardDescription className="text-xs text-ink-muted">
                Students who scanned this session
              </CardDescription>
            </div>
            <Badge variant="secondary" className="tabular-nums">
              {scanHistory.length}
            </Badge>
          </CardHeader>
          <CardContent className="flex-1">
            {scanHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <QrCode className="h-8 w-8 text-ink-faint" />
                <p className="text-sm font-medium text-ink">No scans yet</p>
                <p className="text-xs text-ink-muted">
                  Students appear here as they scan the QR.
                </p>
              </div>
            ) : (
              <ul
                role="log"
                aria-label="Attendance scan feed"
                className="max-h-105 divide-y divide-hairline overflow-y-auto"
              >
                {scanHistory.map((record) => (
                  <li
                    key={record.recordID}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {record.fullName}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {record.schoolStudentID}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={record.status} />
                      <span className="text-[11px] tabular-nums text-ink-faint">
                        {formatTime(record.timestamp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
