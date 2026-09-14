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
  User,
  Tag,
  Mail,
  IdCard,
  GraduationCap,
  BarChart3,
} from 'lucide-react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { toast } from 'sonner';

const STEP_LABELS = ['Personal', 'School', 'Review'];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
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

function IconInput({
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & { icon: React.ElementType }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="rounded-full pl-9" {...props} />
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

  const set =
    (field: keyof PersonalInfoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canProceed = form.firstName && form.lastName && form.email;

  return (
    <FieldGroup>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="firstName" className="sr-only">
          First name
        </FieldLabel>
        <IconInput
          icon={User}
          id="firstName"
          value={form.firstName}
          onChange={set('firstName')}
          placeholder="First name"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="middleName" className="sr-only">
            Middle name
          </FieldLabel>
          <IconInput
            icon={User}
            id="middleName"
            value={form.middleName}
            onChange={set('middleName')}
            placeholder="Middle name (optional)"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="suffix" className="sr-only">
            Suffix
          </FieldLabel>
          <IconInput
            icon={Tag}
            id="suffix"
            value={form.suffix}
            onChange={set('suffix')}
            placeholder="Suffix (optional)"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="lastName" className="sr-only">
          Last name
        </FieldLabel>
        <IconInput
          icon={User}
          id="lastName"
          value={form.lastName}
          onChange={set('lastName')}
          placeholder="Last name"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email" className="sr-only">
          Email
        </FieldLabel>
        <IconInput
          icon={Mail}
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="Email"
        />
      </Field>
      <ProgressBar current={0} />

      <Button
        type="button"
        className="w-full rounded-full"
        disabled={!canProceed}
        onClick={() => onNext(form)}
      >
        NEXT <ArrowRight className="size-4 ml-1" />
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
      <ProgressBar current={1} />
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="studentId" className="sr-only">
          Student ID
        </FieldLabel>
        <IconInput
          icon={IdCard}
          id="studentId"
          value={form.studentId}
          onChange={(e) =>
            setForm((p) => ({ ...p, studentId: e.target.value }))
          }
          placeholder="Student ID"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="department" className="sr-only">
          Course
        </FieldLabel>
        <Select
          value={form.department}
          onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}
        >
          <SelectTrigger id="department" className="rounded-full">
            <GraduationCap className="size-4 text-muted-foreground mr-1" />
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BSIT">
              Bachelor of Science in Information Technology
            </SelectItem>
            <SelectItem value="BSCS">
              Bachelor of Science in Computer Science
            </SelectItem>
            <SelectItem value="BSCpE">
              Bachelor of Science in Computer Engineering
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="yearLevel" className="sr-only">
          Year level
        </FieldLabel>
        <Select
          value={form.yearLevel}
          onValueChange={(v) => setForm((p) => ({ ...p, yearLevel: v }))}
        >
          <SelectTrigger id="yearLevel" className="rounded-full">
            <BarChart3 className="size-4 text-muted-foreground mr-1" />
            <SelectValue placeholder="Year level" />
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

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="size-4 mr-1" /> BACK
        </Button>
        <Button
          type="button"
          className="flex-1 rounded-full"
          disabled={!canProceed}
          onClick={() => onNext(form)}
        >
          NEXT <ArrowRight className="size-4 ml-1" />
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

  return (
    <FieldGroup>
      <ProgressBar current={2} />
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Fill out the fields to get started.
        </p>
      </div>

      <div className="rounded-2xl border p-4">
        <p className="font-semibold">{fullName}</p>
        <p className="text-sm text-muted-foreground mb-3">{school.studentId}</p>

        <div className="flex items-center gap-2 text-sm mb-1">
          <Mail className="size-4 text-muted-foreground" /> {personal.email}
        </div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <GraduationCap className="size-4 text-muted-foreground" />{' '}
          {school.department}
        </div>
        <div className="flex items-center gap-2 text-sm mb-3">
          <BarChart3 className="size-4 text-muted-foreground" />{' '}
          {school.yearLevel}
          {school.yearLevel === '1'
            ? 'st'
            : school.yearLevel === '2'
              ? 'nd'
              : school.yearLevel === '3'
                ? 'rd'
                : 'th'}{' '}
          Year
        </div>

        <label className="flex items-start gap-2 text-sm">
          <Checkbox
            checked={certified}
            onCheckedChange={(v) => setCertified(!!v)}
          />
          I certify that these academic records match my collegiate credentials.
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="size-4 mr-1" /> BACK
        </Button>
        <Button
          type="button"
          className="flex-1 rounded-full"
          disabled={!certified || isSubmitting}
          onClick={onConfirm}
        >
          {isSubmitting ? 'Submitting...' : 'NEXT'}{' '}
          <ArrowRight className="size-4 ml-1" />
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
