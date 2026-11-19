import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  MEMBERSHIP_STATUS,
  departmentService,
  type MembershipRequest,
} from '@/features/departments';

interface MembershipRequestsProps {
  departmentId: number;
  /** Bump to reload after a change. */
  refreshKey: number;
  onChanged: () => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function RequestRow({
  request,
  busy,
  onReview,
}: {
  request: MembershipRequest;
  busy: boolean;
  onReview: (status: number, reason?: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-hairline p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">
            {request.userEmail ?? `User ${request.userId}`}
          </p>
          <p className="text-xs text-ink-muted">
            Requested {formatDate(request.requestedAt)}
          </p>
        </div>
        <span className="text-xs text-ink-muted">#{request.requestId}</span>
      </div>

      {request.reason && (
        <p className="text-xs text-ink-muted italic">
          “{request.reason}”
        </p>
      )}

      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Review note (optional)"
        rows={2}
        maxLength={500}
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={busy}
          onClick={() => onReview(MEMBERSHIP_STATUS.Approved, reason || undefined)}
        >
          <Check className="mr-1.5 h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-destructive"
          disabled={busy}
          onClick={() => onReview(MEMBERSHIP_STATUS.Rejected, reason || undefined)}
        >
          <X className="mr-1.5 h-4 w-4" />
          Reject
        </Button>
      </div>
    </li>
  );
}

export default function MembershipRequests({
  departmentId,
  refreshKey,
  onChanged,
}: MembershipRequestsProps) {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await departmentService.getPendingRequests(departmentId);
        if (active) setRequests(rows);
      } catch {
        if (active) toast.error('Unable to load membership requests.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [departmentId, refreshKey]);

  const handleReview = async (requestId: number, status: number, reason?: string) => {
    setBusy(true);
    try {
      await departmentService.reviewRequest(requestId, { status, reason });
      toast.success(status === MEMBERSHIP_STATUS.Approved ? 'Request approved.' : 'Request rejected.');
      onChanged();
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { Error?: string } } })?.response?.data
          ?.Error ?? 'Unable to review the request.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Loading requests…</p>;
  if (requests.length === 0) {
    return <p className="text-sm text-ink-muted">No pending requests.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {requests.map((request) => (
        <RequestRow
          key={request.requestId}
          request={request}
          busy={busy}
          onReview={(status, reason) =>
            handleReview(request.requestId, status, reason)
          }
        />
      ))}
    </ul>
  );
}
