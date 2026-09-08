import { useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthLayout from '@/shared/layouts/AuthLayout';
import { StepIndicator } from '@/components/ui/step-indicator';
import type { SignupData } from '@/types/user.type';
import { signUp } from '@/features/auth/services/AuthService';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import type {
  PersonalInfoData,
  PhotoData,
  SchoolInfoData,
} from '@/types/signup.type';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STEPS = ['Personal', 'School', 'Photo', 'Review'];

type PersonalInfoProps = {
  data: PersonalInfoData;
  onNext: (data: PersonalInfoData) => void;
};

type SchoolInfoProps = {
  data: SchoolInfoData;
  onNext: (data: SchoolInfoData) => void;
  onBack: () => void;
};

type PhotoUploadProps = {
  data: PhotoData;
  onNext: (data: PhotoData) => void;
  onBack: () => void;
};

type ReviewStepProps = {
  personal: PersonalInfoData;
  school: SchoolInfoData;
  photo: PhotoData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

// PERSONAL INFO STEP

export function PersonalInfoStep({ data, onNext }: PersonalInfoProps) {
  const [form, setForm] = useState<PersonalInfoData>(data);

  const set =
    (field: keyof PersonalInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1 text-center mb-4">
        <h1 className="text-2xl font-bold">Personal information</h1>
        <p className="text-sm text-muted-foreground">
          Enter your legal name as it appears on your school records.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_1fr_80px] gap-3">
        <Field>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={set('firstName')}
            placeholder="Juan"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={set('lastName')}
            placeholder="Cruz"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
          <Select
            value={form.suffix}
            onValueChange={(v) => setForm((p) => ({ ...p, suffix: v }))}
          >
            <SelectTrigger id="suffix">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              <SelectItem value="Jr.">Jr.</SelectItem>
              <SelectItem value="Sr.">Sr.</SelectItem>
              <SelectItem value="II">II</SelectItem>
              <SelectItem value="III">III</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="middleName">
          Middle name{' '}
          <span className="text-muted-foreground text-xs font-normal">
            (optional)
          </span>
        </FieldLabel>
        <Input
          id="middleName"
          value={form.middleName}
          onChange={set('middleName')}
          placeholder="Santos"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="juan@dmc.edu.ph"
          required
        />
      </Field>

      <Button type="button" className="w-full" onClick={() => onNext(form)}>
        NEXT <ArrowRight className="size-4 ml-1" />
      </Button>
      <Field>
        <FieldDescription className="px-6 text-center">
          Already have an account? <Link to="/login">Sign in</Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}

// SCHOOL INFO STEP

export function SchoolInfoStep({ data, onNext, onBack }: SchoolInfoProps) {
  const [form, setForm] = useState<SchoolInfoData>(data);

  const set =
    (field: keyof SchoolInfoData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1 text-center mb-4">
        <h1 className="text-2xl font-bold">School information</h1>
        <p className="text-sm text-muted-foreground">
          Used to verify your enrollment status.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
        <Input
          id="studentId"
          value={form.studentId}
          onChange={set('studentId')}
          placeholder="2023-0444"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="yearLevel">Year level</FieldLabel>
          <Select
            value={form.yearLevel}
            onValueChange={(v) => setForm((p) => ({ ...p, yearLevel: v }))}
          >
            <SelectTrigger id="yearLevel">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: '1st Year', value: '1' },
                { label: '2nd Year', value: '2' },
                { label: '3rd Year', value: '3' },
                { label: '4th Year', value: '4' },
              ].map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Select
            value={form.department}
            onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {['BSIT', 'BSCS', 'BSIS', 'BSED'].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft className="size-4 ml-1" />
          Back
        </Button>
        <Button type="button" className="flex-1" onClick={() => onNext(form)}>
          NEXT <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </FieldGroup>
  );
}

// PHOTO UPLOAD STEP

export function PhotoUploadStep({ data, onNext, onBack }: PhotoUploadProps) {
  const [photo, setPhoto] = useState<PhotoData>(data);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto({
        file,
        previewUrl,
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <FieldGroup>
      <div className="flex flex-col gap-1 text-center mb-4">
        <h1 className="text-2xl font-bold">Profile photo</h1>
        <p className="text-sm text-muted-foreground">
          Upload a clear photo of your face. Helps admin verify your identity.
        </p>
      </div>

      <Field>
        <FieldLabel>Photo</FieldLabel>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          {photo.previewUrl ? (
            <img
              src={photo.previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <>
              <div className="text-4xl text-muted-foreground">📷</div>
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
            </>
          )}
          <FieldDescription>
            JPG or PNG · Max 5 MB · Square crop recommended
          </FieldDescription>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </Field>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft className="size-4 ml-1" />
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!photo.file}
          onClick={() => onNext(photo)}
        >
          NEXT
          <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </FieldGroup>
  );
}

// REVIEW STEP

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 text-sm border-b last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value || '—'}</span>
  </div>
);

export function ReviewStep({
  personal,
  school,
  photo,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  const fullName = [
    personal.firstName,
    personal.middleName,
    personal.lastName,
    personal.suffix,
  ]
    .filter(Boolean)
    .join(' ');
  const initials = [personal.firstName[0], personal.lastName[0]]
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Review your details</h1>
        <p className="text-sm text-muted-foreground">
          Check everything before submitting. Your application will be reviewed
          by the admin.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {photo.previewUrl ? (
          <img
            src={photo.previewUrl}
            className="w-12 h-12 rounded-full object-cover border"
            alt="Profile"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {initials}
          </div>
        )}
        <div>
          <p className="font-medium">{fullName}</p>
          <p className="text-sm text-muted-foreground">{personal.email}</p>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Personal
        </p>
        <Row label="First name" value={personal.firstName} />
        <Row label="Middle name" value={personal.middleName} />
        <Row label="Last name" value={personal.lastName} />
        <Row label="Suffix" value={personal.suffix} />
        <Row label="Email" value={personal.email} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          School
        </p>
        <Row label="Student ID" value={school.studentId} />
        <Row label="Year level" value={school.yearLevel} />
        <Row label="Department" value={school.department} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="size-4 ml-1" />
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'CONFIRM'}
        </Button>
      </div>
    </div>
  );
}

// SIGN UP FORM

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfoData>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
  });
  const [school, setSchool] = useState<SchoolInfoData>({
    studentId: '',
    yearLevel: '',
    department: '',
  });
  const [photo, setPhoto] = useState<PhotoData>({
    file: null,
    previewUrl: '',
    base64: '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: SignupData = {
        firstName: personal.firstName,
        middleName: personal.middleName || undefined,
        lastName: personal.lastName,
        suffix:
          personal.suffix === 'none' ? undefined : personal.suffix || undefined,
        email: personal.email,
        schoolStudentId: school.studentId,
        yearLevel: school.yearLevel,
        course: school.department,
        photoUrl: photo.base64 || undefined,
      };

      await signUp(payload);
      setShowSuccessDialog(true);
      toast.success('Registration submitted successfully!!', {
        position: 'top-center',
        description: 'Your application is now pending admin approval.',
      });
    } catch (error) {
      toast.error('Registration error!', { position: 'top-center' });
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <StepIndicator steps={STEPS} current={step} />
      {step === 0 && (
        <PersonalInfoStep
          data={personal}
          onNext={(d) => {
            setPersonal(d);
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <SchoolInfoStep
          data={school}
          onNext={(d) => {
            setSchool(d);
            setStep(2);
          }}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <PhotoUploadStep
          data={photo}
          onNext={(d) => {
            setPhoto(d);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ReviewStep
          personal={personal}
          school={school}
          photo={photo}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          isSubmitting={isSubmitting}
        />
      )}
      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open);
          if (!open) navigate({ to: '/login' });
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-7 text-green-600" />
            </div>
            <DialogTitle className="text-center">
              Registration Submitted
            </DialogTitle>
            <DialogDescription className="text-center">
              Your account has been created, but its not active yet. Please wait
              for admin approval — the admin needs to verify your school status
              first before you can log in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate({ to: '/login' });
              }}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}
