import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Copy,
  GraduationCap,
  KeyRound,
  Loader2,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { StudentProfile } from '../profile.type';
import profileService from '../services/ProfileService';

function getFullName(profile: StudentProfile) {
  return [
    profile.firstName,
    profile.middleName,
    profile.lastName,
    profile.suffix,
  ]
    .filter(Boolean)
    .join(' ');
}

function getInitials(profile: StudentProfile) {
  return [profile.firstName?.[0], profile.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-canvas-soft border border-hairline px-4 py-3">
      <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-ink">{value ?? 'N/A'}</p>
    </div>
  );
}

export default function MyProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
    } catch {
      setError('Failed to load your profile. Please try again.');
      toast.error('Failed to load your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyStudentId = () => {
    if (!profile?.schoolStudentId) return;
    navigator.clipboard.writeText(profile.schoolStudentId);
    toast.success('Student ID copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={28} className="text-ink-faint animate-spin mb-3" />
        <p className="text-sm text-ink-muted">Loading your profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-destructive mb-3">
          {error ?? 'Profile unavailable.'}
        </p>
        <Button variant="outline" size="sm" onClick={loadProfile}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 max-w-4xl">
      <div className="rounded-xl border border-hairline bg-surface overflow-hidden">
        {/* Cover band */}
        <div className="h-24 bg-linear-to-r from-primary-soft to-sticker-sky-tint" />

        {/* Identity row */}
        <div className="px-6">
          <div className="flex items-start justify-between -mt-10">
            <div className="flex items-end gap-4">
              <div className="size-20 rounded-2xl bg-primary border-4 border-surface shadow-soft flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {getInitials(profile)}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-ink">
                  {getFullName(profile)}
                </h1>
                <p className="text-sm text-ink-muted">
                  ID: {profile.schoolStudentId}
                </p>
              </div>
            </div>
            <Badge variant="success" className="mt-12 flex items-center gap-1">
              <BadgeCheck size={12} />
              Verified student
            </Badge>
          </div>

          <p className="text-sm text-ink-muted mt-4">
            Account information is read-only. Contact your administrator if any
            detail needs correction.
          </p>
        </div>

        <div className="px-6 pb-6 pt-5 space-y-6">
          {/* Personal Information */}
          <section>
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-ink-faint rounded-full" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoField label="First Name" value={profile.firstName} />
              <InfoField
                label="Middle Name"
                value={profile.middleName || 'N/A'}
              />
              <InfoField label="Last Name" value={profile.lastName} />
              <InfoField label="Suffix" value={profile.suffix || 'N/A'} />
            </div>
          </section>

          <Separator />

          {/* Contact & Identification */}
          <section>
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-ink-faint rounded-full" />
              Contact &amp; Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-canvas-soft border border-hairline px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase mb-1">
                  Email Address
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink flex items-center gap-1.5 truncate">
                    <Mail size={14} className="text-ink-faint shrink-0" />
                    {profile.email}
                  </span>
                  {profile.emailVerified !== false && (
                    <Badge className="bg-sticker-green-tint text-sticker-green-ink hover:bg-sticker-green-tint border-sticker-green/30 shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-canvas-soft border border-hairline px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-ink-faint uppercase mb-1">
                  Student ID
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink">
                    {profile.schoolStudentId}
                  </span>
                  <button
                    onClick={copyStudentId}
                    className="text-ink-faint hover:text-ink-secondary transition-colors"
                    aria-label="Copy student ID"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Academic Information */}
          <section>
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-ink-faint rounded-full" />
              Academic Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoField
                label="Program"
                value={
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-ink-faint" />
                    {profile.course}
                  </span>
                }
              />
              <InfoField
                label="Year Level"
                value={
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-ink-faint" />
                    {profile.yearLevel}
                  </span>
                }
              />
              <InfoField
                label="Semester"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-ink-faint" />
                    {profile.semester || 'N/A'}
                  </span>
                }
              />
              <InfoField
                label="School Year"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-ink-faint" />
                    {profile.schoolYear || 'N/A'}
                  </span>
                }
              />
            </div>
          </section>

          <Separator />

          {/* Account Security */}
          <section>
            <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-ink-faint rounded-full" />
              Account Security
            </h4>
            <div className="flex items-center justify-between rounded-lg border border-hairline px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-canvas-soft flex items-center justify-center">
                  <KeyRound size={16} className="text-ink-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Password</p>
                  <p className="text-xs text-ink-muted">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
