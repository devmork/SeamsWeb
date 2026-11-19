import { useEffect, useState } from 'react';
import {
  Plus,
  Shield,
  Search,
  Trash2,
  Loader2,
  Mail,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Officer } from '@/features/admin/officers/officer.type';
import { officerService } from '@/features/admin/officers/services/OfficerService';
import OfficerSheet from './OfficerSheet';
import RemoveOfficerDialog from './RemoveOfficerDialog';

function getFullName(officer: Officer) {
  return [
    officer.firstName,
    officer.middleName,
    officer.lastName,
    officer.suffix,
  ]
    .filter(Boolean)
    .join(' ');
}

function getInitials(officer: Officer) {
  return [officer.firstName?.[0], officer.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

export default function OfficerList() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean;
    officer: Officer | null;
  }>({ open: false, officer: null });
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await officerService.getAllOfficers();
      setOfficers(data);
    } catch {
      setError('Failed to load officers. Please try again.');
      toast.error('Failed to load officers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
  };

  const handleOfficerAssigned = () => {
    loadOfficers();
  };

  const handleRemoveClick = (officer: Officer) => {
    setRemoveDialog({ open: true, officer });
  };

  const handleRemoveConfirm = () => {
    loadOfficers();
    setRemoveDialog({ open: false, officer: null });
  };

  const filtered = officers.filter((o) => {
    const q = search.toLowerCase();
    return (
      getFullName(o).toLowerCase().includes(q) ||
      o.schoolStudentId?.toLowerCase().includes(q) ||
      o.course?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <Input
              placeholder="Search by name, ID, program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Assign Button */}
          <Button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
          >
            <Plus size={18} />
            Assign Officer
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={28} className="text-ink-faint animate-spin mb-3" />
          <p className="text-sm text-ink-muted">Loading officers…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadOfficers}>
            Try again
          </Button>
        </div>
      ) : officers.length === 0 ? (
        // Empty State
        <Card className="border border-hairline">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
              <Shield size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-1">
              No Officers Assigned Yet
            </h3>
            <p className="text-sm text-ink-muted max-w-sm mb-6">
              Click Assign Officer to promote an approved student to officer
              status.
            </p>
            <Button
              onClick={() => setSheetOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5"
            >
              <Plus size={16} />
              Assign First Officer
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        // No Results
        <Card className="border border-hairline">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={36} className="text-ink-faint mb-3" />
            <p className="text-ink-muted">No officers match your search.</p>
          </CardContent>
        </Card>
      ) : (
        // Officers Table
        <Card className="border border-hairline">
          <CardHeader className="pb-0">
            <div className="text-sm font-medium text-ink-secondary">
              {filtered.length} Officer{filtered.length !== 1 ? 's' : ''}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-canvas-soft hover:bg-canvas-soft">
                    <TableHead className="pl-6 w-12">#</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Year Level</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((officer, index) => (
                    <TableRow key={officer.userId} className="group">
                      {/* Row # */}
                      <TableCell className="pl-6 text-ink-faint text-xs">
                        {index + 1}
                      </TableCell>

                      {/* Officer Name + Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-canvas-soft text-ink-muted">
                              {getInitials(officer)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-ink whitespace-nowrap">
                            {getFullName(officer)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Student ID */}
                      <TableCell>
                        <span className="font-mono text-sm text-ink-secondary bg-canvas-soft px-2 py-0.5 rounded">
                          {officer.schoolStudentId}
                        </span>
                      </TableCell>

                      {/* Program */}
                      <TableCell className="text-ink-secondary max-w-45">
                        <span className="truncate block items-center gap-1">
                          <BookOpen
                            size={14}
                            className="text-ink-faint shrink-0"
                          />
                          {officer.course}
                        </span>
                      </TableCell>

                      {/* Year Level */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {officer.yearLevel}
                        </Badge>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-ink-muted text-xs max-w-45">
                        <span className="truncate flex items-center gap-1">
                          <Mail size={14} className="text-ink-faint shrink-0" />
                          {officer.email}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className="bg-sticker-green-tint text-sticker-green-ink hover:bg-sticker-green-tint border-sticker-green/30 flex w-fit items-center gap-1">
                          <span className="w-2 h-2 bg-sticker-green rounded-full"></span>
                          Active
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                          onClick={() => handleRemoveClick(officer)}
                        >
                          <Trash2 size={14} />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer count */}
            <div className="px-6 py-3 border-t border-hairline text-xs text-ink-faint text-right">
              Showing {filtered.length} of {officers.length} officer
              {officers.length !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Officer Sheet */}
      <OfficerSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        onOfficerAssigned={handleOfficerAssigned}
      />

      {/* Remove Officer Dialog */}
      <RemoveOfficerDialog
        open={removeDialog.open}
        officer={removeDialog.officer}
        onClose={() => setRemoveDialog({ open: false, officer: null })}
        onRemove={handleRemoveConfirm}
        isRemoving={isRemoving}
        setIsRemoving={setIsRemoving}
      />
    </div>
  );
}
