import { useEffect, useState } from 'react';
import { Check, X, ClockAlert, Search, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Applicant } from '@/features/admin/applicants/applicant.type';
import {
  approveApplication,
  rejectApplication,
  getAllApplications,
} from '@/features/admin/applicants/services/ApplicantService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  programOptions,
  statusOptions,
  yearLevelOptions,
} from '@/config/filter';

function getFullName(s: Applicant) {
  return [s.firstName, s.middleName, s.lastName, s.suffix]
    .filter(Boolean)
    .join(' ');
}

function getInitials(s: Applicant) {
  return [s.firstName?.[0], s.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

export default function ApplicantList() {
  const [students, setStudents] = useState<Applicant[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReceived, setTotalReceived] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllApplications();
      setStudents(data);
      setTotalReceived(data.length);
      setResolvedCount(0);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      getFullName(s).toLowerCase().includes(q) ||
      s.schoolStudentId.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);

    const matchesProgram =
      filterProgram === 'all' || s.course === filterProgram;
    const matchesYear = filterYear === 'all' || s.yearLevel === filterYear;
    const matchesStatus =
      filterStatus === 'all' || s.status.toString() === filterStatus;

    return matchesSearch && matchesProgram && matchesYear && matchesStatus;
  });

  const handleApprove = async (applicant: Applicant) => {
    setActioningId(applicant.applicationId);
    try {
      await approveApplication(applicant.applicationId);
      toast.success('Student Approved', {
        description: `${getFullName(applicant)} can now log in to the system.`,
      });
      setStudents((prev) =>
        prev.filter((x) => x.applicationId !== applicant.applicationId),
      );
      setResolvedCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', {
        description: `Could not approve ${getFullName(applicant)}. Please try again.`,
      });
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (applicant: Applicant) => {
    setActioningId(applicant.applicationId);
    try {
      await rejectApplication(applicant.applicationId);
      toast.error('Registration Rejected', {
        description: `${getFullName(applicant)}'s application has been rejected.`,
      });
      setStudents((prev) =>
        prev.filter((x) => x.applicationId !== applicant.applicationId),
      );
      setResolvedCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', {
        description: `Could not reject ${getFullName(applicant)}. Please try again.`,
      });
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-t-4 border-t-orange-500">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <ClockAlert size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.length}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-green-500">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {resolvedCount}
              </p>
              <p className="text-xs text-gray-500">Resolved Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-[#2C5530]">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2C5530]/10 flex items-center justify-center shrink-0">
              <UserCheck size={20} className="text-[#2C5530]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalReceived}
              </p>
              <p className="text-xs text-gray-500">Total Received</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search by name, ID, program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* All Programs Filter */}
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-full sm:w-42.5">
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programOptions.map((prog) => (
                    <SelectItem key={prog} value={prog}>
                      {prog}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* All Year Levels Filter */}
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Year Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Year Levels</SelectItem>
                  {yearLevelOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}st Year
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* All Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Loader2 size={28} className="text-gray-400 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Loading applications…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={loadApplications}>
                Try again
              </Button>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check size={30} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                There are no pending student applications to review at this
                time.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Search size={36} className="text-gray-300 mb-3" />
              <p className="text-gray-500">No students match your search.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="pl-6 w-12">#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year Level</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student, index) => {
                  const isActioning = actioningId === student.applicationId;
                  return (
                    <TableRow key={student.applicationId} className="group">
                      {/* Row # */}
                      <TableCell className="pl-6 text-gray-400 text-xs">
                        {index + 1}
                      </TableCell>

                      {/* Student Name + Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(student)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {getFullName(student)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Student ID */}
                      <TableCell>
                        <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {student.schoolStudentId}
                        </span>
                      </TableCell>

                      {/* Program */}
                      <TableCell className="text-gray-600 max-w-45">
                        <span className="truncate block">{student.course}</span>
                      </TableCell>

                      {/* Year Level */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap"
                        >
                          {student.yearLevel}
                        </Badge>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-gray-500 text-xs max-w-45">
                        <span className="truncate block">{student.email}</span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            student.status === 1
                              ? 'default' // Pending - Orange
                              : student.status === 2
                                ? 'secondary' // Approved - Green
                                : 'destructive' // Rejected - Red
                          }
                          className={
                            student.status === 1
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200'
                              : student.status === 2
                                ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'
                          }
                        >
                          {student.status === 1 && 'Pending'}
                          {student.status === 2 && 'Approved'}
                          {student.status === 3 && 'Rejected'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-center">
                        {student.status === 1 ? (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActioning}
                              onClick={() => handleReject(student)}
                              className="h-8 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 flex items-center gap-1.5"
                            >
                              <X size={13} />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              disabled={isActioning}
                              onClick={() => handleApprove(student)}
                              className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5"
                            >
                              {isActioning ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={13} />
                              )}
                              Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Footer count */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 text-right">
              Showing {filtered.length} of {students.length} pending application
              {students.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
