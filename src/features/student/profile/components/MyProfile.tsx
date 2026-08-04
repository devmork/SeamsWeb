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
    <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
      <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value ?? 'N/A'}</p>
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
        <Loader2 size={28} className="text-gray-400 animate-spin mb-3" />
        <p className="text-sm text-gray-500">Loading your profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-red-500 mb-3">
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
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-linear-to-r from-[#2C5530] to-[#1f3f23]" />

        {/* Identity row */}
        <div className="px-6">
          <div className="flex items-start justify-between -mt-10">
            <div className="flex items-end gap-4">
              <div className="size-20 rounded-2xl bg-[#2C5530] border-4 border-white shadow-sm flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(profile)}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {getFullName(profile)}
                </h1>
                <p className="text-sm text-gray-500">
                  ID: {profile.schoolStudentId}
                </p>
              </div>
            </div>
            <Badge className="mt-12 bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1">
              <BadgeCheck size={12} />
              Verified student
            </Badge>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Account information is read-only. Contact your administrator if any
            detail needs correction.
          </p>
        </div>

        <div className="px-6 pb-6 pt-5 space-y-6">
          {/* Personal Information */}
          <section>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#2C5530] rounded-full" />
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
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#2C5530] rounded-full" />
              Contact &amp; Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase mb-1">
                  Email Address
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5 truncate">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    {profile.email}
                  </span>
                  {profile.emailVerified !== false && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3">
                <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase mb-1">
                  Student ID
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {profile.schoolStudentId}
                  </span>
                  <button
                    onClick={copyStudentId}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#2C5530] rounded-full" />
              Academic Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoField
                label="Program"
                value={
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-gray-400" />
                    {profile.course}
                  </span>
                }
              />
              <InfoField
                label="Year Level"
                value={
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-gray-400" />
                    {profile.yearLevel}
                  </span>
                }
              />
              <InfoField
                label="Semester"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {profile.semester || 'N/A'}
                  </span>
                }
              />
              <InfoField
                label="School Year"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {profile.schoolYear || 'N/A'}
                  </span>
                }
              />
            </div>
          </section>

          <Separator />

          {/* Account Security */}
          <section>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#2C5530] rounded-full" />
              Account Security
            </h4>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <KeyRound size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-xs text-gray-500">
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
