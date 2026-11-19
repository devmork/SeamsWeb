import { useEffect, useState, type ReactNode } from 'react';
import { Loader2, Search, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserRole } from '@/features/auth/types';
import { getCurrentUser } from '@/features/auth/services/AuthService';
import { userService } from '../services/userService';
import {
  ASSIGNABLE_ROLES,
  NO_ROLE,
  displayName,
  initialsOf,
  type ManagedUser,
} from '../types';

function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data;
    if (data && typeof data === 'object' && 'Error' in data) {
      const message = (data as { Error?: unknown }).Error;
      if (typeof message === 'string' && message) return message;
    }
  }
  return fallback;
}

function StateCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-canvas-soft text-ink-muted">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-ink">{title}</p>
          <p className="text-sm text-ink-muted">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-hairline px-6 py-4 last:border-0"
          >
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  // Role changes are a superadmin-only operation on the backend.
  const canManageRoles = getCurrentUser()?.role === 'superadmin';

  const loadUsers = async () => {
    setIsReloading(true);
    setError(null);
    try {
      setUsers(await userService.getUsers());
    } catch (err) {
      setError(
        errorMessage(err, 'Failed to load users. Please try again.'),
      );
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filtered = users.filter((user) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      displayName(user).toLowerCase().includes(q) ||
      (user.email?.toLowerCase().includes(q) ?? false)
    );
  });

  const handleRoleChange = async (user: ManagedUser, next: string) => {
    const current = user.role ?? NO_ROLE;
    if (next === current) return;

    setPendingUserId(user.id);
    try {
      const updated =
        next === NO_ROLE
          ? // The account has no role yet — removing one is a no-op.
            current === NO_ROLE
            ? user
            : await userService.removeRole(user.id, user.role as UserRole)
          : await userService.assignRole(user.id, next as UserRole);

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: updated.role } : u)),
      );
      toast.success(
        next === NO_ROLE
          ? `Role removed from ${displayName(user)}.`
          : `${displayName(user)} is now ${next}.`,
      );
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update the role.'));
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="type-heading-2 text-ink">Users</h1>
            <p className="text-sm text-ink-muted">
              {canManageRoles
                ? 'Browse accounts and change the single role assigned to each one.'
                : 'Browse accounts and their assigned role. Only a superadmin can change roles.'}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              aria-label="Search users"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <StateCard
          icon={<UserCog className="size-5" />}
          title="Couldn't load users"
          description={error}
        />
      ) : filtered.length === 0 ? (
        <StateCard
          icon={<UserCog className="size-5" />}
          title={query ? 'No users found' : 'No users yet'}
          description={
            query
              ? 'Try a different name or email.'
              : 'Accounts appear here once they register and sign in.'
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            {isReloading && (
              <div className="flex items-center gap-2 border-b border-hairline px-6 py-2 text-xs text-ink-muted">
                <Loader2 className="size-3 animate-spin" /> Refreshing…
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="bg-canvas-soft hover:bg-canvas-soft">
                  <TableHead className="pl-6 w-12">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right pr-6">Change role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user, index) => {
                  const value = user.role ?? NO_ROLE;
                  const isPending = pendingUserId === user.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="pl-6 text-ink-faint text-xs">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-canvas-soft text-ink-muted">
                              {initialsOf(user)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-ink whitespace-nowrap">
                            {displayName(user)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-ink-secondary">
                        {user.email ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive === 1 ? 'success' : 'secondary'}
                        >
                          {user.isActive === 1 ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        ) : (
                          <span className="text-ink-faint text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end">
                          <Select
                            value={value}
                            disabled={!canManageRoles || isPending}
                            onValueChange={(next) =>
                              void handleRoleChange(user, next)
                            }
                          >
                            <SelectTrigger
                              className="w-36"
                              aria-label={`Change role for ${displayName(user)}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NO_ROLE}>No role</SelectItem>
                              {ASSIGNABLE_ROLES.map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="capitalize"
                                >
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="px-2 py-3 text-xs text-ink-faint text-right">
          Showing {filtered.length} of {users.length} user
          {users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
