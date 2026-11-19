import { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Loader2,
  ScanQrCode,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Scanner,
  type IDetectedBarcode,
  type IScannerError,
} from '@yudiel/react-qr-scanner';
import { attendanceRecordService } from '@/features/officer/scan/services/AttendanceRecordService';
import type { AttendanceRecordResponse } from '@/features/officer/scan/attendance-record.types';

export default function MyQR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastRecord, setLastRecord] = useState<AttendanceRecordResponse | null>(
    null,
  );

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (isProcessing) return;
    const rawValue = detectedCodes[0]?.rawValue?.trim();
    if (!rawValue) return;

    setIsProcessing(true);
    try {
      const record = await attendanceRecordService.scan(rawValue);
      setLastRecord(record);
      toast.success(
        `${record.fullName} — attendance recorded successfully.`,
      );
    } catch (error) {
      const message =
        (error as { response?: { data?: { Error?: string } } })?.response?.data
          ?.Error ??
        (error as { response?: { data?: string } })?.response?.data ??
        'Unable to record attendance. Try scanning again.';
      toast.error(message as string);
    } finally {
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  const handleCameraError = (error: IScannerError) => {
    setCameraError(
      error.kind === 'permission-denied'
        ? 'Camera access was unavailable. Check your browser permission and try again.'
        : error.message || 'Unable to start the camera scanner.',
    );
  };

  return (
    <div className="flex items-start justify-center py-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide flex items-center gap-1.5 mb-1">
          <ScanQrCode size={14} className="text-primary" />
          Attendance Scanner
        </p>
        <h1 className="type-heading-2 text-ink mb-1">Scan QR</h1>
        <p className="text-sm text-ink-muted mb-6">
          Scan the officer&apos;s session QR code to record your attendance.
        </p>

        <Card className="border border-hairline">
          <CardContent className="flex flex-col items-center py-6">
            {cameraError ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-hairline">
                  <Camera className="h-8 w-8 text-ink-faint" />
                </div>
                <p className="text-sm font-semibold text-ink">
                  Camera unavailable
                </p>
                <p className="text-xs text-ink-muted max-w-xs">{cameraError}</p>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg border">
                <div className="relative flex min-h-70 items-center justify-center bg-well">
                  <Scanner
                    onScan={handleScan}
                    onError={handleCameraError}
                    paused={isProcessing}
                    formats={['qr_code']}
                    constraints={{ facingMode: 'environment' }}
                    components={{ finder: true }}
                    styles={{ container: { width: '100%', height: '100%' } }}
                  />
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recording attendance…
              </div>
            )}

            {lastRecord && (
              <div className="mt-5 w-full rounded-lg border bg-sticker-green-tint p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-sticker-green-ink" />
                <p className="text-base font-semibold text-ink">
                  {lastRecord.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lastRecord.schoolStudentID}
                </p>
                <Badge className="mt-3 bg-sticker-green-tint text-sticker-green-ink hover:bg-sticker-green-tint border-sticker-green/30">
                  {lastRecord.status === 1 ? 'Present' : 'Recorded'}
                </Badge>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {new Date(lastRecord.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
