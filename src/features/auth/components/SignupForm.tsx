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

const STUDENT_ID_PATTERN = /^\d{4}-\d{4}$/;
const DMC_EMAIL_PATTERN = /^[^\s@]+@dmc\.edu\.ph$/i;

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-1 flex w-2/3 gap-1">
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
  const [submitted, setSubmitted] = useState(false);

  const setUpper =
    (field: keyof PersonalInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value.toUpperCase(),
      }));

  const setRaw =
    (field: keyof PersonalInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

  const errors = {
    firstName: !form.firstName.trim() ? 'First name is required.' : '',
    lastName: !form.lastName.trim() ? 'Last name is required.' : '',
    email: !form.email.trim()
      ? 'Email is required.'
      : !DMC_EMAIL_PATTERN.test(form.email.trim())
        ? 'Email must be a valid @dmc.edu.ph address.'
        : '',
  };

  const showError = (field: keyof typeof errors) => submitted && errors[field];

  const handleNext = () => {
    setSubmitted(true);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    onNext(form);
  };

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field data-invalid={showError('firstName') ? true : undefined}>
        <FieldLabel htmlFor="firstName">
          First name{' '}
          {submitted && errors.firstName && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Input
          id="firstName"
          value={form.firstName}
          onChange={setUpper('firstName')}
          placeholder="Maria"
          aria-invalid={showError('firstName') ? true : undefined}
          required
        />
        {showError('firstName') && (
          <FieldDescription className="text-destructive">
            {errors.firstName}
          </FieldDescription>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
          <Input
            id="middleName"
            value={form.middleName}
            onChange={setUpper('middleName')}
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

      <Field data-invalid={showError('lastName') ? true : undefined}>
        <FieldLabel htmlFor="lastName">
          Last Name{' '}
          {submitted && errors.lastName && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Input
          id="lastName"
          value={form.lastName}
          onChange={setUpper('lastName')}
          placeholder="Clara"
          aria-invalid={showError('lastName') ? true : undefined}
          required
        />
        {showError('lastName') && (
          <FieldDescription className="text-destructive">
            {errors.lastName}
          </FieldDescription>
        )}
      </Field>

      <Field data-invalid={showError('email') ? true : undefined}>
        <FieldLabel htmlFor="email">
          Email{' '}
          {submitted && errors.email && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={setRaw('email')}
          placeholder="you@dmc.edu.ph"
          aria-invalid={showError('email') ? true : undefined}
          required
        />
        {showError('email') && (
          <FieldDescription className="text-destructive">
            {errors.email}
          </FieldDescription>
        )}
      </Field>

      <ProgressBar current={0} />

      <Button type="button" className="w-full" onClick={handleNext}>
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
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    studentId: !form.studentId.trim()
      ? 'Student ID is required.'
      : !STUDENT_ID_PATTERN.test(form.studentId.trim())
        ? 'Student ID must follow the format 0000-0000.'
        : '',
    department: !form.department ? 'Course is required.' : '',
    yearLevel: !form.yearLevel ? 'Year level is required.' : '',
  };

  const showError = (field: keyof typeof errors) => submitted && errors[field];

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    const formatted =
      digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
    setForm((p) => ({ ...p, studentId: formatted }));
  };

  const handleNext = () => {
    setSubmitted(true);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    onNext(form);
  };

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field data-invalid={showError('studentId') ? true : undefined}>
        <FieldLabel htmlFor="studentId">
          Student ID{' '}
          {submitted && errors.studentId && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Input
          id="studentId"
          value={form.studentId}
          onChange={handleStudentIdChange}
          placeholder="2023-0444"
          inputMode="numeric"
          maxLength={9}
          aria-invalid={showError('studentId') ? true : undefined}
          required
        />
        {showError('studentId') && (
          <FieldDescription className="text-destructive">
            {errors.studentId}
          </FieldDescription>
        )}
      </Field>

      <Field data-invalid={showError('department') ? true : undefined}>
        <FieldLabel htmlFor="department">
          Course{' '}
          {submitted && errors.department && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Select
          value={form.department}
          onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
        >
          <SelectTrigger
            id="department"
            className="w-full"
            aria-invalid={showError('department') ? true : undefined}
          >
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
        {showError('department') && (
          <FieldDescription className="text-destructive">
            {errors.department}
          </FieldDescription>
        )}
      </Field>

      <Field data-invalid={showError('yearLevel') ? true : undefined}>
        <FieldLabel htmlFor="yearLevel">
          Year level{' '}
          {submitted && errors.yearLevel && (
            <span className="text-destructive">*</span>
          )}
        </FieldLabel>
        <Select
          value={form.yearLevel}
          onValueChange={(v) => setForm((p) => ({ ...p, yearLevel: v }))}
        >
          <SelectTrigger
            id="yearLevel"
            className="w-full"
            aria-invalid={showError('yearLevel') ? true : undefined}
          >
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
        {showError('yearLevel') && (
          <FieldDescription className="text-destructive">
            {errors.yearLevel}
          </FieldDescription>
        )}
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
        <Button type="button" className="flex-1" onClick={handleNext}>
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
  const [submitted, setSubmitted] = useState(false);

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

  const handleConfirm = () => {
    setSubmitted(true);
    if (!certified) {
      toast.error('Please certify your academic records before continuing.');
      return;
    }
    onConfirm();
  };
  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b bg-muted/40 px-5 py-4 text-center">
          <p className="text-sm font-bold uppercase tracking-wide">
            {fullName}
          </p>
          <p className="text-xs text-muted-foreground">{school.studentId}</p>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex items-start gap-3 text-sm">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="break-all">{personal.email}</span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{school.department}</span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <BarChart3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="font-medium uppercase tracking-wide">
              {yearLabel}
            </span>
          </div>
        </div>

        <label
          className={`flex cursor-pointer items-start gap-3 border-t bg-muted/40 px-5 py-4 text-sm ${
            submitted && !certified ? 'text-destructive' : ''
          }`}
        >
          <Checkbox
            checked={certified}
            onCheckedChange={(v) => setCertified(!!v)}
            className="mt-0.5"
          />
          <span
            className={submitted && !certified ? '' : 'text-muted-foreground'}
          >
            I certify that these academic records match my collegiate
            enrollment.{' '}
            {submitted && !certified && (
              <span className="text-destructive">*</span>
            )}
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
          onClick={handleConfirm}
          disabled={isSubmitting}
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
        suffix:
          personal.suffix === 'none' ? undefined : personal.suffix || undefined,
        email: personal.email.toLowerCase(),
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
