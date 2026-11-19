import { useCallback, useEffect, useState } from 'react';
import { Building2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MEMBERSHIP_STATUS,
  departmentService,
  membershipStatusLabel,
} from '@/features/departments';
import type {
  Department,
  MembershipRequest,
} from '@/features/departments';

const STATUS_VARIANT: Record<number, 'warning' | 'success' | 'danger'> = {
  [MEMBERSHIP_STATUS.Pending]: 'warning',
  [MEMBERSHIP_STATUS.Approved]: 'success',
  [MEMBERSHIP_STATUS.Rejected]: 'danger',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [departmentId, setDepartmentId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [myDepartments, myRequests] = await Promise.all([
        departmentService.getMyDepartments(),
        departmentService.getMyMembershipRequests(),
      ]);
      setDepartments(myDepartments);
      setRequests(myRequests);
    } catch {
      setError('Failed to load your departments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleJoin = async () => {
    const id = Number(departmentId);
    if (!id) {
      toast.error('Enter a department ID.');
      return;
    }
    setIsSubmitting(true);
    try {
      await departmentService.joinDepartment(id, {
        reason: reason.trim() || undefined,
      });
      toast.success('Join request submitted.', {
        description: 'An administrator will review it.',
      });
      setDepartmentId('');
      setReason('');
      await load();
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { Error?: string } } })?.response?.data
          ?.Error ?? 'Unable to submit the join request.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <Building2 size={14} className="text-primary" />
          Departments
        </p>
        <h1 className="type-heading-2 text-ink">My Departments</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Departments you belong to and the status of your join requests.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Memberships</h2>
            {departments.length === 0 ? (
              <p className="text-sm text-ink-muted">
                You are not a member of any department yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {departments.map((department) => (
                  <Card key={department.departmentId}>
                    <CardContent className="flex flex-col gap-1 p-4">
                      <p className="font-medium text-ink">{department.name}</p>
                      {department.description && (
                        <p className="text-sm text-ink-muted">
                          {department.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-ink-faint">
                        {department.userCount} member
                        {department.userCount !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Request to Join</h2>
            <Card>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="join-department-id">Department ID</Label>
                  <Input
                    id="join-department-id"
                    inputMode="numeric"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    placeholder="Ask an administrator for the ID"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="join-reason">Reason (optional)</Label>
                  <Textarea
                    id="join-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <Button
                  onClick={() => void handleJoin()}
                  disabled={isSubmitting}
                  className="self-start"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">My Requests</h2>
            {requests.length === 0 ? (
              <p className="text-sm text-ink-muted">No join requests yet.</p>
            ) : (
              <Card>
                <CardContent className="flex flex-col divide-y divide-hairline p-0">
                  {requests.map((request) => (
                    <div
                      key={request.requestId}
                      className="flex flex-wrap items-center justify-between gap-2 p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-ink">
                          {request.departmentName ?? `Department ${request.departmentId}`}
                        </p>
                        <p className="text-xs text-ink-muted">
                          Requested {formatDate(request.requestedAt)}
                          {request.reviewedAt
                            ? ` · Reviewed ${formatDate(request.reviewedAt)}`
                            : ''}
                        </p>
                        {request.reason && (
                          <p className="mt-1 text-xs text-ink-muted italic">
                            “{request.reason}”
                          </p>
                        )}
                      </div>
                      <Badge variant={STATUS_VARIANT[request.status] ?? 'secondary'}>
                        {membershipStatusLabel(request.status)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}
