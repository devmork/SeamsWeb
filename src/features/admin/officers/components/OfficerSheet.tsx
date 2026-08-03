import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { officerService } from '../services/OfficerService';
import type { Student } from '@/features/admin/students/student.type'; // Reuse Student type for candidates
import { studentService } from '@/features/admin/students';

interface OfficerSheetProps {
  open: boolean;
  onClose: () => void;
  onOfficerAssigned: () => void;
}

export default function OfficerSheet({
  open,
  onClose,
  onOfficerAssigned,
}: OfficerSheetProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      loadOfficerCandidates();
    }
  }, [open]);

  const loadOfficerCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getAllActiveStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load officer candidates');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCandidates = students.filter((student) =>
    [
      student.firstName,
      student.lastName,
      student.schoolStudentId,
      student.email,
    ].some((field) => field?.toLowerCase().includes(search.toLowerCase())),
  );

  const handleAssign = async (candidate: Student) => {
    try {
      await officerService.assignOfficer(candidate.userId);

      toast.success('Officer Assigned Successfully', {
        description: `${candidate.firstName} ${candidate.lastName} is now an Officer.`,
      });
      onOfficerAssigned();
      onClose();
    } catch (error) {
      console.error('Failed to assign officer:', error);
      toast.error('Failed to assign officer');
    } finally {
      setAssigningUserId(null);
    }
  };

  const getInitials = (candidate: Student) => {
    return `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-155 flex flex-col">
        <SheetHeader>
          <SheetTitle>Assign New Officer</SheetTitle>
          <SheetDescription>
            Select an approved student to promote as an Officer
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Candidates List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" size={28} />
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-gray-500">No matching candidates found</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.userId}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(candidate)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono">
                        {candidate.schoolStudentId}
                      </span>
                      <span>•</span>
                      <span>{candidate.course}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {candidate.email}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleAssign(candidate)}
                  disabled={assigningUserId === candidate.userId}
                  size="sm"
                  className="bg-[#2C5530] hover:bg-[#234726] text-white"
                >
                  {assigningUserId === candidate.userId ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Assign Officer'
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
