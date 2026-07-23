import api from '@/service/api';
import type { Student, StudentRequest } from '../student.type';

export const studentService = {
  getAllActiveStudents: async (): Promise<Student[]> => {
    const response = await api.get<Student[]>('/student');
    return response.data;
  },

  getStudentById: async (studentId: number): Promise<Student | null> => {
    const response = await api.get<Student>(`/student/${studentId}`);
    return response.data;
  },

  getStudentQRCodeInfo: async (
    schoolStudentId: string,
  ): Promise<Student | null> => {
    const response = await api.get<Student>(`/student/qr/${schoolStudentId}`);
    return response.data;
  },

  deleteStudent: async (studentId: number): Promise<void> => {
    await api.patch(`/student/${studentId}`);
  },

  updateStudent: async (
    studentId: number,
    data: StudentRequest,
  ): Promise<void> => {
    await api.put(`/student/${studentId}`, data);
  },

  deactivateStudent: async (studentId: number): Promise<void> => {
    await api.patch(`/student/${studentId}/deactivate`);
  },
};

export default studentService;
