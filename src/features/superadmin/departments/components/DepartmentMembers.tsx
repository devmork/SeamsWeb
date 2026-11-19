import { useEffect, useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departmentService, type DepartmentMember } from '@/features/departments';
import { userService, type ManagedUser } from '@/features/superadmin/users';

interface DepartmentMembersProps {
  departmentId: number;
  /** Bump to reload after a change. */
  refreshKey: number;
  onChanged: () => void;
}

function initialsOf(member: DepartmentMember): string {
  const name = member.userName?.trim() || member.email || `User ${member.id}`;
  return name.slice(0, 2).toUpperCase();
}

export default function DepartmentMembers({
  departmentId,
  refreshKey,
  onChanged,
}: DepartmentMembersProps) {
  const [members, setMembers] = useState<DepartmentMember[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [memberRows, allUsers] = await Promise.all([
          departmentService.getDepartmentMembers(departmentId),
          userService.getUsers(),
        ]);
        if (!active) return;
        setMembers(memberRows);
        setUsers(allUsers);
      } catch {
        if (active) toast.error('Unable to load department members.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [departmentId, refreshKey]);

  const assignable = users.filter(
    (user) => !members.some((member) => member.id === user.id),
  );

  const handleAssign = async () => {
    const userId = Number(selectedUserId);
    if (!userId) {
      toast.error('Pick a user to assign.');
      return;
    }
    setBusy(true);
    try {
      await departmentService.assignUser(departmentId, userId);
      setSelectedUserId('');
      toast.success('User assigned to department.');
      onChanged();
    } catch {
      toast.error('Failed to assign the user.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (userId: number) => {
    setBusy(true);
    try {
      await departmentService.removeUser(departmentId, userId);
      toast.success('User removed from department.');
      onChanged();
    } catch {
      toast.error('Failed to remove the user.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assign a user…" />
          </SelectTrigger>
          <SelectContent>
            {assignable.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.email ?? `User ${user.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAssign}
          disabled={busy || !selectedUserId}
        >
          <UserPlus className="mr-1.5 h-4 w-4" />
          Assign
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading members…</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-ink-muted">No members yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-2.5 rounded-lg border border-hairline px-3 py-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-canvas-soft text-ink-muted text-xs">
                  {initialsOf(member)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {member.userName?.trim() || member.email}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  {member.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(member.id)}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Remove'
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
