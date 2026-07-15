import axios from 'axios';
import type { Applicant } from '@/types/applicant.type';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7122/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all student applications that are still awaiting review.
 */
export const getPendingApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/StudentApplication/pending-applications',
  );
  return response.data;
};

/**
 * Fetch all approved student applications.
 */
export const getApprovedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/StudentApplication/approved-applications',
  );
  return response.data;
};

/**
 * Fetch all rejected student applications.
 */
export const getRejectedApplications = async (): Promise<Applicant[]> => {
  const response = await api.get<Applicant[]>(
    '/StudentApplication/rejected-applications',
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
  await api.patch(`/StudentApplication/approve-application/${applicationId}`);
};

/**
 * Reject a pending application.
 */
export const rejectApplication = async (
  applicationId: number,
): Promise<void> => {
  await api.patch(`/StudentApplication/reject-application/${applicationId}`);
};
