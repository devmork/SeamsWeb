import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, QrCode, ScanQrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { profileService, type StudentProfile } from '../../profile';

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

export default function MyQR() {
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
      setError('Failed to load your QR code. Please try again.');
      toast.error('Failed to load your QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center py-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
          <ScanQrCode size={14} className="text-[#2C5530]" />
          Attendance Identity
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My QR</h1>
        <p className="text-sm text-gray-500 mb-6">
          Present this code to the attendance officer when checking in.
        </p>

        <Card className="border border-gray-200">
          <CardContent className="flex flex-col items-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center py-16">
                <Loader2
                  size={28}
                  className="text-gray-400 animate-spin mb-3"
                />
                <p className="text-sm text-gray-500">Loading your QR…</p>
              </div>
            ) : error || !profile ? (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="text-sm text-red-500 mb-3">
                  {error ?? 'QR code unavailable.'}
                </p>
                <Button variant="outline" size="sm" onClick={loadProfile}>
                  Try again
                </Button>
              </div>
            ) : (
              <>
                <div className="size-64 rounded-2xl border-2 border-gray-900 flex items-center justify-center p-4 bg-white">
                  {profile.qrCode ? (
                    <img
                      src={`data:image/png;base64,${profile.qrCode}`}
                      alt="My attendance QR code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <QrCode size={64} />
                      <p className="text-xs text-gray-400">
                        No QR code generated yet
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center mt-5">
                  <p className="text-base font-semibold text-gray-900">
                    {getFullName(profile)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile.schoolStudentId}
                  </p>
                </div>

                <Badge className="mt-4 bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Ready for scanning
                </Badge>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
