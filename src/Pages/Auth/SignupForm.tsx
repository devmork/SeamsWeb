import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import { StepIndicator } from "@/components/ui/step-indicator";
import {
  PersonalInfoStep,
  type PersonalInfoData,
} from "./signup-steps/PersonalInfoStep";
import {
  SchoolInfoStep,
  type SchoolInfoData,
} from "./signup-steps/SchoolInfoStep";
import {
  PhotoUploadStep,
  type PhotoData,
} from "./signup-steps/PhotoUploadStep";
import { ReviewStep } from "./signup-steps/ReviewStep";
import type { SignupData } from "@/types/user.type";
import { signUp } from "@/service/authService";

const STEPS = ["Personal", "School", "Photo", "Review"];

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfoData>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
  });
  const [school, setSchool] = useState<SchoolInfoData>({
    studentId: "",
    yearLevel: "",
    department: "",
  });
  const [photo, setPhoto] = useState<PhotoData>({
    file: null,
    previewUrl: "",
    base64: "",
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: SignupData = {
        firstName: personal.firstName,
        middleName: personal.middleName || undefined,
        lastName: personal.lastName,
        suffix:
          personal.suffix === "none" ? undefined : personal.suffix || undefined,
        email: personal.email,
        schoolStudentId: school.studentId,
        yearLevel: parseInt(school.yearLevel),
        course: school.department,
        photoUrl: photo.base64 || undefined,
      };

      await signUp(payload);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // TODO: show error toast/message to user
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
    </AuthLayout>
  );
}
