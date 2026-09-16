import api from '@/service/api';
import type {
  Applicant,
  CheckApplicationAvailabilityResponse,
} from '@/features/admin/applicants';

export const getAllApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/all-applications',
  );
  return response.data;
};

export const getPendingApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/pending-applications',
  );
  return response.data;
};

export const getApprovedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/approved-applications',
  );
  return response.data;
};

export const getRejectedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/rejected-applications',
  );
  return response.data;
};

export const approveApplication = async (
  applicationId: number,
): Promise<void> => {
  await api.patch(`/student-application/approve-application/${applicationId}`);
};

export const rejectApplication = async (
  applicationId: number,
): Promise<void> => {
  await api.patch(`/student-application/reject-application/${applicationId}`);
};

export const checkApplicationAvailability = async (
  email: string,
  schoolStudentId: string,
): Promise<CheckApplicationAvailabilityResponse> => {
  const response = await api.get<CheckApplicationAvailabilityResponse>(
    '/student-application/check-availability',
    { params: { email, schoolStudentId } },
  );
  return response.data;
};
