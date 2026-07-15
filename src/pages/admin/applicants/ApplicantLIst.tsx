import { useEffect, useState } from 'react';
import { Check, X, ClockAlert, Search, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Applicant } from '@/types/applicant.type';
import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
} from '@/service/applicants';

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

// function formatDate(value: string) {
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return value;
//   return date.toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
// }

const AVATAR_COLORS = [
  'bg-[#2C5530]',
  'bg-blue-600',
  'bg-purple-600',
  'bg-orange-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-indigo-600',
  'bg-amber-600',
];

export default function ApplicantList() {
  const [students, setStudents] = useState<Applicant[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalReceived, setTotalReceived] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [actioningId, setActioningId] = useState<number | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPendingApplications();
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
    return (
      getFullName(s).toLowerCase().includes(q) ||
      s.schoolStudentId.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
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
            <CardTitle className="flex items-center gap-2">
              Applications
              {students.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                  {students.length} pending
                </Badge>
              )}
            </CardTitle>
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
          </div>
        </CardHeader>

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
                There are no pending student registrations to review at this
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
                  {/* <TableHead>Submitted</TableHead> */}
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

                      {/* Student name + avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                              AVATAR_COLORS[
                                student.applicationId % AVATAR_COLORS.length
                              ]
                            }`}
                          >
                            {getInitials(student)}
                          </div>
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
                      <TableCell className="text-gray-600 max-w-[180px]">
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
                      <TableCell className="text-gray-500 text-xs max-w-[180px]">
                        <span className="truncate block">{student.email}</span>
                      </TableCell>

                      {/* Submitted */}
                      {/* <TableCell className="text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(student.submittedAt)}
                      </TableCell> */}

                      {/* Actions */}
                      <TableCell className="pr-6">
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
