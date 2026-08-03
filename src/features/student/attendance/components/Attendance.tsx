import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Folder,
  Loader2,
  RefreshCw,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AttendanceMarkStatus,
  type EventAttendanceGroup,
} from '../attendance.type';
import { attendanceService } from '..';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function countByStatus(
  sessions: EventAttendanceGroup['sessions'],
  status: AttendanceMarkStatus,
) {
  return sessions.filter((s) => s.status === status).length;
}

export default function Attendance() {
  const [groups, setGroups] = useState<EventAttendanceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getMyAttendanceHistory();
      setGroups(data);
    } catch {
      setError('Failed to load your attendance history. Please try again.');
      toast.error('Failed to load your attendance history.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (eventId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const totals = useMemo(() => {
    const allSessions = groups.flatMap((g) => g.sessions);
    return {
      present: countByStatus(allSessions, AttendanceMarkStatus.Present),
      absent: countByStatus(allSessions, AttendanceMarkStatus.Absent),
    };
  }, [groups]);

  return (
    <div className="flex-1 min-w-0">
      {/* Header banner */}
      <div className="rounded-xl bg-linear-to-r from-[#2C5530] to-[#1f3f23] px-6 py-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-white/15 flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Attendance</h1>
            <p className="text-sm text-white/70">Events &amp; session marks</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="bg-white hover:bg-white/90 text-gray-900"
          onClick={loadHistory}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={28} className="text-gray-400 animate-spin mb-3" />
          <p className="text-sm text-gray-500">
            Loading your attendance history…
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadHistory}>
            Try again
          </Button>
        </div>
      ) : (
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <CalendarCheck size={14} className="text-[#2C5530]" />
                  My Attendance History
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Expand an event to review every attendance mark recorded for
                  you.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  {totals.present} present
                </Badge>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                  {totals.absent} absent
                </Badge>
              </div>
            </div>

            {groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Folder size={32} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  No attendance records yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => {
                  const isOpen = expanded.has(group.eventId);
                  const present = countByStatus(
                    group.sessions,
                    AttendanceMarkStatus.Present,
                  );
                  const absent = countByStatus(
                    group.sessions,
                    AttendanceMarkStatus.Absent,
                  );

                  return (
                    <Collapsible
                      key={group.eventId}
                      open={isOpen}
                      onOpenChange={() => toggleExpanded(group.eventId)}
                    >
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <Folder
                                size={18}
                                className="text-gray-400 shrink-0"
                              />
                              <div className="text-left min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {group.eventTitle}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Calendar size={12} />
                                  {formatDate(group.date)}
                                  <span className="text-gray-300">|</span>
                                  {group.sessions.length} session
                                  {group.sessions.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                {present} present
                              </Badge>
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                {absent} absent
                              </Badge>
                              {isOpen ? (
                                <ChevronUp
                                  size={16}
                                  className="text-gray-400"
                                />
                              ) : (
                                <ChevronDown
                                  size={16}
                                  className="text-gray-400"
                                />
                              )}
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                                Attendance Sessions
                              </p>
                              {absent > 0 && (
                                <p className="text-xs text-gray-500">
                                  For penalty tracking: {absent} missed
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              {group.sessions.map((session) => {
                                const isPresent =
                                  session.status ===
                                  AttendanceMarkStatus.Present;
                                return (
                                  <div
                                    key={session.recordId}
                                    className="flex items-center justify-between gap-3 bg-white rounded-lg border border-gray-100 px-3 py-2.5"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {isPresent ? (
                                        <CheckCircle2
                                          size={20}
                                          className="text-green-600 shrink-0"
                                        />
                                      ) : (
                                        <XCircle
                                          size={20}
                                          className="text-red-500 shrink-0"
                                        />
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {session.session}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {formatTime(session.startTime)} –{' '}
                                          {formatTime(session.endTime)}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge
                                      className={
                                        isPresent
                                          ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shrink-0'
                                          : 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200 shrink-0'
                                      }
                                    >
                                      {isPresent ? 'Present' : 'Absent'}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
