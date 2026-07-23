import { useEffect, useState } from 'react';
import { Search, Users, Eye, Ban, Loader2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Student } from '@/features/students';
import { programOptions, yearLevelOptions } from '@/config/filter';
import {
  StudentDeactivateDialog,
  StudentDetailDialog,
  studentService,
} from '@/features/students';

function getFullName(student: Student) {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
    student.suffix,
  ]
    .filter(Boolean)
    .join(' ');
}

function getInitials(student: Student) {
  return [student.firstName?.[0], student.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Detail dialog state
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  // Deactivate dialog state
  const [deactivateDialog, setDeactivateDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllActiveStudents();
      setStudents(data);
    } catch {
      setError('Failed to load students. Please try again.');
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
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === '1' && s.status === 1) ||
      (filterStatus === '0' && s.status === 0);

    return matchesSearch && matchesProgram && matchesStatus;
  });

  return (
    <div className="flex-1 min-w-0">
      {/* Table Card */}
      <Card className="border border-gray-200">
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
              {/* Program Filter */}
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

              {/* Year Level Filter */}
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

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
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
              <p className="text-sm text-gray-500">Loading students…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={loadStudents}>
                Try again
              </Button>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users size={30} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No Students Found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                There are no approved students in the system yet. Students will
                appear here once they complete registration.
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
                {filtered.map((student, index) => (
                  <TableRow key={student.studentId} className="group">
                    {/* Row # */}
                    <TableCell className="pl-6 text-gray-400 text-xs">
                      {index + 1}
                    </TableCell>

                    {/* Student Name + Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
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

                    <TableCell className="text-gray-600 max-w-45">
                      <span className="truncate block">{student.email}</span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={
                          student.status === 1
                            ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'
                        }
                      >
                        {student.status === 1 ? '● Active' : '● Inactive'}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={false}
                          onClick={() =>
                            setDetailDialog({ open: true, student })
                          }
                          className="h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          View
                        </Button>
                        {student.status === 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDeactivateDialog({ open: true, student })
                            }
                            className="h-8 px-3 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700 flex items-center gap-1.5"
                          >
                            <Ban size={13} />
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Footer count */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 text-right">
              Showing {filtered.length} of {students.length} student
              {students.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <StudentDetailDialog
        open={detailDialog.open}
        student={detailDialog.student}
        onClose={() => setDetailDialog({ open: false, student: null })}
        onUpdated={loadStudents}
      />

      {/* Deactivate Dialog */}
      <StudentDeactivateDialog
        open={deactivateDialog.open}
        student={deactivateDialog.student}
        onClose={() => setDeactivateDialog({ open: false, student: null })}
        onDeactivate={loadStudents}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}
