import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FolderOpen,
  Layers,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

function sessionVisual(status: AttendanceMarkStatus) {
  switch (status) {
    case AttendanceMarkStatus.Present:
      return {
        icon: CheckCircle2,
        iconWrap: 'bg-green-100',
        iconColor: 'text-green-600',
        badge:
          'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
        label: 'Present',
      };
    case AttendanceMarkStatus.Upcoming:
      return {
        icon: Clock,
        iconWrap: 'bg-amber-100',
        iconColor: 'text-amber-600',
        badge:
          'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200',
        label: 'Upcoming',
      };
    default:
      return {
        icon: XCircle,
        iconWrap: 'bg-red-100',
        iconColor: 'text-red-500',
        badge: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200',
        label: 'Absent',
      };
  }
}

export default function Attendance() {
  const [groups, setGroups] = useState<EventAttendanceGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

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

  const toggleExpand = (eventId: number) => {
    setExpandedIds((prev) => {
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
            <CalendarDays size={20} className="text-white" />
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
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <CalendarCheck size={14} className="text-[#2C5530]" />
                My Events &amp; Attendance
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Expand an event to view every session and your mark.
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
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[#2C5530]/10 flex items-center justify-center mb-4">
                <FolderOpen size={28} className="text-[#2C5530]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No events yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Once an event with an attendance session is created, it will
                show up here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group) => {
                const isExpanded = expandedIds.has(group.eventId);
                const present = countByStatus(
                  group.sessions,
                  AttendanceMarkStatus.Present,
                );
                const absent = countByStatus(
                  group.sessions,
                  AttendanceMarkStatus.Absent,
                );
                const upcoming = countByStatus(
                  group.sessions,
                  AttendanceMarkStatus.Upcoming,
                );

                return (
                  <Card
                    key={group.eventId}
                    className="overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-0">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                        onClick={() => toggleExpand(group.eventId)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#2C5530]/10 flex items-center justify-center shrink-0">
                          <FolderOpen size={18} className="text-[#2C5530]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {group.eventTitle}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={11} />
                              {formatDate(group.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers size={11} />
                              {group.sessions.length} session
                              {group.sessions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {present > 0 && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              {present} present
                            </Badge>
                          )}
                          {absent > 0 && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                              {absent} absent
                            </Badge>
                          )}
                          {upcoming > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
                              {upcoming} upcoming
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 flex flex-col gap-2">
                          {group.sessions.length === 0 ? (
                            <div className="text-center py-4 text-sm text-gray-400">
                              No attendance sessions scheduled yet.
                            </div>
                          ) : (
                            group.sessions.map((session) => {
                              const visual = sessionVisual(session.status);
                              const Icon = visual.icon;
                              return (
                                <div
                                  key={session.recordId}
                                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${visual.iconWrap}`}
                                  >
                                    <Icon
                                      size={15}
                                      className={visual.iconColor}
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">
                                      {session.session}
                                    </p>
                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                      <Clock size={11} />
                                      {formatTime(session.startTime)} –{' '}
                                      {formatTime(session.endTime)}
                                    </span>
                                  </div>

                                  <Badge className={`${visual.badge} shrink-0`}>
                                    {visual.label}
                                  </Badge>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
