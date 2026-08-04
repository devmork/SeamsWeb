import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scanner,
  type IDetectedBarcode,
  type IScannerError,
} from '@yudiel/react-qr-scanner';
import {
  Camera,
  CalendarDays,
  Clock,
  LogIn,
  LogOut,
  QrCode,
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
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        Present
      </Badge>
    );
  }
  if (status === ATTENDANCE_STATUS.Late) {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
        Late
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Absent</Badge>
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

  const [scanHistory, setScanHistory] = useState<AttendanceRecordResponse[]>(
    [],
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setCameraError(null);
    if (!selectedAttendanceId) return;

    (async () => {
      try {
        const data = await attendanceRecordService.getByAttendanceId(
          Number(selectedAttendanceId),
        );
        setScanHistory(data);
      } catch {
        // 404 just means no records yet for this session — that's fine.
        setScanHistory([]);
      }
    })();
  }, [selectedAttendanceId]);

  const handleLogout = () => {
    logOut();
    navigate('/login', { replace: true });
  };

  const handleCameraError = (error: IScannerError) => {
    setCameraError(
      error.kind === 'permission-denied'
        ? 'Camera access was unavailable. Check your browser permission and try again.'
        : error.message || 'Unable to start the camera scanner.',
    );
  };

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (isProcessing || !selectedAttendanceId) return;

    const rawValue = detectedCodes[0]?.rawValue?.trim();
    if (!rawValue) return;

    // QR payload is generated as "{FullName} - {schoolStudentId}"
    const separatorIndex = rawValue.lastIndexOf(' - ');
    const schoolStudentId =
      separatorIndex !== -1
        ? rawValue.slice(separatorIndex + 3).trim()
        : rawValue;
    if (!schoolStudentId) return;

    setIsProcessing(true);
    try {
      const record = await attendanceRecordService.create({
        attendanceID: Number(selectedAttendanceId),
        schoolStudentID: schoolStudentId,
        status: ATTENDANCE_STATUS.Present,
      });
      setScanHistory((prev) => [record, ...prev]);
      toast.success(`${record.fullName} logged successfully.`);
    } catch (error) {
      const message =
        (error as { response?: { data?: string } })?.response?.data ??
        'Unable to log this student. Try scanning again.';
      toast.error(message as string);
    } finally {
      // Cooldown so the same code isn't immediately re-scanned
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-white">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-green-700">
              SEAMS — Officer Portal
            </h1>
            <p className="text-xs text-muted-foreground">QR Code Scanner</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Select an event and session, then scan student QR codes
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
                          <LogOut className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <LogIn className="h-3.5 w-3.5 text-green-600" />
                        )}
                        {formatSessionLabel(session)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAttendance && (
              <div className="rounded-lg border bg-green-50/60 p-3">
                <p className="text-xs font-medium text-green-700">
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
              <div className="relative flex min-h-70 items-center justify-center bg-[#0b1120]">
                {!selectedAttendanceId ? (
                  <div className="flex flex-col items-center gap-2 px-8 text-center text-white/70">
                    <Camera className="h-8 w-8" />
                    <p className="text-sm">
                      Select an event and session to begin scanning.
                    </p>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center gap-3 px-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-white/30">
                      <Camera className="h-8 w-8 text-white/50" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Preparing camera scanner
                    </p>
                    <p className="text-xs text-white/60">
                      Allow camera access when prompted to start scanning QR
                      codes.
                    </p>
                  </div>
                ) : (
                  <Scanner
                    onScan={handleScan}
                    onError={handleCameraError}
                    paused={isProcessing}
                    formats={['qr_code']}
                    constraints={{ facingMode: 'environment' }}
                    components={{ finder: true }}
                    styles={{ container: { width: '100%', height: '100%' } }}
                  />
                )}
              </div>
              {cameraError && (
                <p className="border-t bg-white px-4 py-2 text-xs text-red-500">
                  {cameraError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scan History</CardTitle>
            <CardDescription>Recent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <QrCode className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">No scans yet</p>
                <p className="text-xs text-muted-foreground">
                  Choose an event and session, then scan student QR codes
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
