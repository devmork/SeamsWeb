import api from '@/service/api';
import type { Applicant } from '@/features/applicants/applicant.type';

/**
 * Fetch all approved student applications.
 */
export const getAllApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/all-applications',
  );
  return response.data;
};

/**
 * Fetch all student applications that are still awaiting review.
 */
export const getPendingApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/pending-applications',
  );
  return response.data;
};

/**
 * Fetch all approved student applications.
 */
export const getApprovedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/approved-applications',
  );
  return response.data;
};

/**
 * Fetch all rejected student applications.
 */
export const getRejectedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/student-application/rejected-applications',
  );
  return response.data;
};

/**
 * Approve a pending application. On success, the backend creates the
 * corresponding user + student record.
 */
export const approveApplication = async (
  applicationId: number,
): Promise<void> => {
  await api.patch(`/student-application/approve-application/${applicationId}`);
};

/**
 * Reject a pending application.
 */
export const rejectApplication = async (
  applicationId: number,
): Promise<void> => {
  await api.patch(`/student-application/reject-application/${applicationId}`);
};
