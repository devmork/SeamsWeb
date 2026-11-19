import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
import { logOut } from '@/features/auth/services/AuthService';
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
  if (status === ATTENDANCE_STATUS.Present) {
    return (
      <Badge className="bg-sticker-green-tint text-sticker-green-ink hover:bg-sticker-green-tint">
        Present
      </Badge>
    );
  }
  if (status === ATTENDANCE_STATUS.Late) {
    return (
      <Badge className="bg-sticker-orange-tint text-sticker-orange-ink hover:bg-sticker-orange-tint">
        Late
      </Badge>
    );
  }
  return (
    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">Absent</Badge>
  );
}

export default function ScanQR() {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    void logOut().finally(() => navigate({ to: '/login', replace: true }));
  };

  const handleManualRefresh = () => {
    if (selectedAttendanceId) fetchQr(Number(selectedAttendanceId));
  };

  const qrSrc = qr?.qrCode
    ? `data:image/png;base64,${qr.qrCode}`
    : null;

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="flex items-center justify-between border-b bg-surface px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-ink">
              SEAMS — Officer Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Session QR Display
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-sticker-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-4 w-4" />
              Session QR Code
            </CardTitle>
            <CardDescription>
              Select an event and session, then display the rotating QR for
              students to scan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                STEP 1{' '}
                <span className="ml-1 font-semibold text-foreground">
                  Select Event *
                </span>
              </span>
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
                disabled={loadingEvents}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingEvents ? 'Loading events…' : 'Choose an event'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem
                      key={event.eventId}
                      value={String(event.eventId)}
                    >
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                STEP 2{' '}
                <span className="ml-1 font-semibold text-foreground">
                  Select Attendance Session *
                </span>
              </span>
              <Select
                value={selectedAttendanceId}
                onValueChange={setSelectedAttendanceId}
                disabled={!selectedEventId || loadingSessions}
              >
                <SelectTrigger>
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
                          <LogOut className="h-3.5 w-3.5 text-sticker-green-ink" />
                        ) : (
                          <LogIn className="h-3.5 w-3.5 text-sticker-green-ink" />
                        )}
                        {formatSessionLabel(session)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAttendance && (
              <div className="rounded-lg border bg-sticker-green-tint p-3">
                <p className="text-xs font-medium text-sticker-green-ink">
                  Active Session
                </p>
                <p className="text-sm font-semibold">{selectedEvent?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAttendance.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-lg border">
              <div className="relative flex min-h-70 items-center justify-center bg-surface">
                {!selectedAttendanceId ? (
                  <div className="flex flex-col items-center gap-2 px-8 text-center text-muted-foreground">
                    <QrCode className="h-8 w-8" />
                    <p className="text-sm">
                      Select an event and session to display the QR code.
                    </p>
                  </div>
                ) : loadingQr ? (
                  <div className="flex flex-col items-center gap-2 px-8 text-center text-muted-foreground">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Generating QR code…</p>
                  </div>
                ) : qrSrc ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <img
                      src={qrSrc}
                      alt="Session attendance QR code"
                      className="h-64 w-64 rounded-lg border object-contain"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Refreshes in {countdown}s
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
                  <div className="flex flex-col items-center gap-2 px-8 text-center text-muted-foreground">
                    <QrCode className="h-8 w-8" />
                    <p className="text-sm">QR code unavailable.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scan History</CardTitle>
            <CardDescription>
              Students who scanned this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <QrCode className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">No scans yet</p>
                <p className="text-xs text-muted-foreground">
                  Students will appear here after they scan the QR
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {scanHistory.map((record) => (
                  <li
                    key={record.recordID}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{record.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.schoolStudentID}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={record.status} />
                      <span className="text-[11px] text-muted-foreground">
                        {formatTime(record.timestamp)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
