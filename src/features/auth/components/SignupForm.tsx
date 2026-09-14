import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthLayout from '@/shared/layouts/AuthLayout';
import type {
  PersonalInfoData,
  SchoolInfoData,
  SignupData,
} from '@/features/auth/types';
import { signUp } from '@/features/auth/services/AuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  GraduationCap,
  BarChart3,
} from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const STEP_LABELS = ['Personal', 'School', 'Review'];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-1 flex gap-1 w-2/3">
      {STEP_LABELS.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < current
              ? 'bg-teal-400'
              : i === current
                ? 'bg-foreground'
                : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}

// PERSONAL INFO STEP

function PersonalInfoStep({
  data,
  onNext,
}: {
  data: PersonalInfoData;
  onNext: (data: PersonalInfoData) => void;
}) {
  const [form, setForm] = useState<PersonalInfoData>(data);
  const [touched, setTouched] = useState(false);

  const set =
    (field: keyof PersonalInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canProceed = form.firstName && form.lastName && form.email;
  const emailInvalid = touched && !form.email;

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="firstName">First name</FieldLabel>
        <Input
          id="firstName"
          value={form.firstName}
          onChange={set('firstName')}
          placeholder="MARIA"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
          <Input
            id="middleName"
            value={form.middleName}
            onChange={set('middleName')}
            placeholder="M"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="suffix">Suffix(optional)</FieldLabel>
          <Select
            value={form.suffix}
            onValueChange={(v) => setForm((p) => ({ ...p, suffix: v }))}
          >
            <SelectTrigger id="suffix" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="Jr.">Jr.</SelectItem>
              <SelectItem value="Sr.">Sr.</SelectItem>
              <SelectItem value="II">II</SelectItem>
              <SelectItem value="III">III</SelectItem>
              <SelectItem value="IV">IV</SelectItem>
              <SelectItem value="V">V</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
        <Input
          id="lastName"
          value={form.lastName}
          onChange={set('lastName')}
          placeholder="CLARA"
          required
        />
      </Field>

      <Field data-invalid={emailInvalid || undefined}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          onBlur={() => setTouched(true)}
          placeholder="you@dmc.edu.ph"
          aria-invalid={emailInvalid || undefined}
          required
        />
        {emailInvalid && (
          <FieldDescription>Email is required.</FieldDescription>
        )}
      </Field>

      <ProgressBar current={0} />

      <Button
        type="button"
        className="w-full"
        disabled={!canProceed}
        onClick={() => onNext(form)}
      >
        NEXT <ArrowRight className="ml-1 size-4" />
      </Button>
    </FieldGroup>
  );
}

// SCHOOL INFO STEP

function SchoolInfoStep({
  data,
  onNext,
  onBack,
}: {
  data: SchoolInfoData;
  onNext: (data: SchoolInfoData) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<SchoolInfoData>(data);
  const canProceed = form.studentId && form.yearLevel && form.department;

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
        <Input
          id="studentId"
          value={form.studentId}
          onChange={(e) =>
            setForm((p) => ({ ...p, studentId: e.target.value }))
          }
          placeholder="2023-0444"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="department">Course</FieldLabel>
        <Select
          value={form.department}
          onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
        >
          <SelectTrigger id="department" className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BSIT">
              Bachelor of Science in Information Technology
            </SelectItem>
            <SelectItem value="BSN">Bachelor of Science in Nursing</SelectItem>
            <SelectItem value="BSMT">
              Bachelor of Science in Medical Technology
            </SelectItem>
            <SelectItem value="BSHM">
              Bachelor of Science in Hospitality Management
            </SelectItem>
            <SelectItem value="BSP">Bachelor of Science in Pharmacy</SelectItem>
            <SelectItem value="BSES">
              Bachelor of Science in Education
            </SelectItem>
            <SelectItem value="BSBA">
              Bachelor of Science in Business Accountancy
            </SelectItem>
            <SelectItem value="BSRT">
              Bachelor of Science in Radiologic Technology
            </SelectItem>
            <SelectItem value="BSPT">
              Bachelor of Science in Physical Therapy
            </SelectItem>
            <SelectItem value="BSM">
              Bachelor of Science in Midwifery
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="yearLevel">Year level</FieldLabel>
        <Select
          value={form.yearLevel}
          onValueChange={(v) => setForm((p) => ({ ...p, yearLevel: v }))}
        >
          <SelectTrigger id="yearLevel" className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {[
              { label: '1st Year', value: '1' },
              { label: '2nd Year', value: '2' },
              { label: '3rd Year', value: '3' },
              { label: '4th Year', value: '4' },
            ].map((y) => (
              <SelectItem key={y.value} value={y.value}>
                {y.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <ProgressBar current={1} />

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 size-4" /> BACK
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!canProceed}
          onClick={() => onNext(form)}
        >
          NEXT <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </FieldGroup>
  );
}

// REVIEW STEP

function ReviewStep({
  personal,
  school,
  onBack,
  onConfirm,
  isSubmitting,
}: {
  personal: PersonalInfoData;
  school: SchoolInfoData;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}) {
  const [certified, setCertified] = useState(false);
  const fullName = [
    personal.firstName,
    personal.middleName,
    personal.lastName,
    personal.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const yearLabel = school.yearLevel
    ? `${school.yearLevel}${
        school.yearLevel === '1'
          ? 'st'
          : school.yearLevel === '2'
            ? 'nd'
            : school.yearLevel === '3'
              ? 'rd'
              : 'th'
      } Year`
    : '';

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {/* Header */}
        <div className="border-b bg-muted/40 px-5 py-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wide">
            {fullName}
          </p>
          <p className="text-xs text-muted-foreground">{school.studentId}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 px-5 py-4">
          <div className="flex items-start gap-3 text-sm">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="break-all">{personal.email}</span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="font-medium">{school.department}</span>{' '}
              <span className="text-muted-foreground">
                (Bachelor of Science in Information Technology)
              </span>
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <BarChart3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium uppercase tracking-wide">
              {yearLabel}
            </span>
          </div>
        </div>

        {/* Certification */}
        <label className="flex cursor-pointer items-start gap-3 border-t bg-muted/40 px-5 py-4 text-sm">
          <Checkbox
            checked={certified}
            onCheckedChange={(v) => setCertified(!!v)}
            className="mt-0.5"
          />
          <span className="text-muted-foreground">
            I certify that these academic records match my collegiate
            enrollment.
          </span>
        </label>
      </div>

      <ProgressBar current={2} />

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-1 size-4" /> BACK
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!certified || isSubmitting}
          onClick={onConfirm}
        >
          {isSubmitting ? 'Submitting...' : 'NEXT'}{' '}
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </FieldGroup>
  );
}
// SIGN UP FORM

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const payload: SignupData = {
        firstName: personal.firstName,
        middleName: personal.middleName || undefined,
        lastName: personal.lastName,
        suffix: personal.suffix || undefined,
        email: personal.email,
        schoolStudentId: school.studentId,
        yearLevel: school.yearLevel,
        course: school.department,
      };
      await signUp(payload);
      navigate({ to: '/verify', search: { email: personal.email } });
    } catch (error) {
      toast.error('Registration error!', { position: 'top-center' });
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
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
        <ReviewStep
          personal={personal}
          school={school}
          onBack={() => setStep(1)}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      )}
    </AuthLayout>
  );
}
