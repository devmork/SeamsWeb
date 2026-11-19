import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { DEPARTMENT_STATUS } from '@/features/departments';
import type {
  Department,
  DepartmentRequest,
} from '@/features/departments';
import { departmentService } from '@/features/departments';
import DepartmentDeleteDialog from './DepartmentDeleteDialog';
import DepartmentDialog from './DepartmentDialog';
import DepartmentMembers from './DepartmentMembers';
import MembershipRequests from './MembershipRequests';

type DialogState = {
  open: boolean;
  mode: 'create' | 'edit';
  department: Department | null;
};

const CLOSED_DIALOG: DialogState = {
  open: false,
  mode: 'create',
  department: null,
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [dialog, setDialog] = useState<DialogState>(CLOSED_DIALOG);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setDepartments(await departmentService.getDepartments());
    } catch {
      setLoadError('Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return departments;
    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(query) ||
        (department.description ?? '').toLowerCase().includes(query),
    );
  }, [departments, search]);

  const handleSubmit = async (data: DepartmentRequest) => {
    if (dialog.mode === 'create') {
      await departmentService.createDepartment(data);
      toast.success('Department Created', {
        description: `"${data.name}" has been added.`,
      });
    } else if (dialog.department) {
      await departmentService.updateDepartment(dialog.department.departmentId, data);
      toast.success('Department Updated', {
        description: `"${data.name}" has been saved.`,
      });
    }
    setDialog(CLOSED_DIALOG);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await departmentService.deleteDepartment(deleteTarget.departmentId);
      toast.success('Department Deleted', {
        description: `${deleteTarget.name} has been deleted or deactivated.`,
      });
      setDeleteTarget(null);
      if (expandedId === deleteTarget.departmentId) setExpandedId(null);
      await load();
    } catch {
      toast.error('Failed to delete the department.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpanded = (departmentId: number) => {
    setExpandedId((current) => (current === departmentId ? null : departmentId));
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <Building2 size={14} className="text-primary" />
            Administration
          </p>
          <h1 className="type-heading-2 text-ink">Departments</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Create departments, assign members and review join requests.
          </p>
        </div>
        <Button
          onClick={() => setDialog({ open: true, mode: 'create', department: null })}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Department
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search departments…"
          className="pl-8"
        />
      </div>

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <p className="text-sm text-ink-muted">Loading departments…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline py-12 text-center">
          <Building2 className="h-8 w-8 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No departments found</p>
          <p className="text-xs text-ink-muted">
            {search ? 'Try a different search.' : 'Create your first department.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
          <Table>
            <TableHeader>
              <TableRow className="bg-canvas-soft/60">
                <TableHead className="w-8" />
                <TableHead>NAME</TableHead>
                <TableHead className="hidden md:table-cell">DESCRIPTION</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">MEMBERS</TableHead>
                <TableHead className="hidden lg:table-cell">UPDATED</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((department) => {
                const isOpen = expandedId === department.departmentId;
                return (
                  <Fragment key={department.departmentId}>
                    <TableRow
                      className="group cursor-pointer"
                      onClick={() => toggleExpanded(department.departmentId)}
                    >
                      <TableCell>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-ink-muted" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-ink-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-ink">
                        {department.name}
                      </TableCell>
                      <TableCell className="hidden max-w-72 md:table-cell">
                        <span className="block truncate text-ink-muted">
                          {department.description || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {department.status === DEPARTMENT_STATUS.Active
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {department.userCount}
                      </TableCell>
                      <TableCell className="hidden text-ink-muted lg:table-cell">
                        {formatDate(department.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className="flex justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDialog({
                                open: true,
                                mode: 'edit',
                                department,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setDeleteTarget(department)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isOpen && (
                      <TableRow key={`${department.departmentId}-detail`}>
                        <TableCell colSpan={7} className="bg-canvas-soft/40 p-4">
                          <div className="grid gap-6 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <h3 className="text-sm font-semibold text-ink">
                                Members
                              </h3>
                              <DepartmentMembers
                                departmentId={department.departmentId}
                                refreshKey={refreshKey}
                                onChanged={() => {
                                  setRefreshKey((key) => key + 1);
                                  void load();
                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <h3 className="text-sm font-semibold text-ink">
                                Pending Join Requests
                              </h3>
                              <MembershipRequests
                                departmentId={department.departmentId}
                                refreshKey={refreshKey}
                                onChanged={() => {
                                  setRefreshKey((key) => key + 1);
                                  void load();
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-ink-muted">
        Showing {filtered.length} of {departments.length} departments.
      </p>

      <DepartmentDialog
        open={dialog.open}
        mode={dialog.mode}
        department={dialog.department}
        onClose={() => setDialog(CLOSED_DIALOG)}
        onSubmit={handleSubmit}
      />

      <DepartmentDeleteDialog
        open={deleteTarget !== null}
        department={deleteTarget}
        isProcessing={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
