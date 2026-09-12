import api from '@/service/api';

export interface FileUploadResponse {
  photoUrl: string;
  message: string;
}

export const uploadStudentPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post<FileUploadResponse>(
    '/FileUpload/StudentPhoto',
    formData,
  );
  return response.data.photoUrl;
};

export const deleteStudentPhoto = async (photoUrl: string): Promise<void> => {
  await api.delete('/FileUpload/StudentPhoto', { params: { photoUrl } });
};

export const validatePhotoFile = (file: File): void => {
  if (!file) throw new Error('No file selected');
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size cannot exceed ${maxSizeMB}MB`);
  }
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPG, PNG, GIF, WEBP');
  }
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(
      'Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif, .webp',
    );
  }
};

export const getImageUrl = (
  photoUrl: string | null | undefined,
): string | null => {
  if (!photoUrl) return null;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://localhost:7122';
  const baseUrl = API_BASE_URL.replace(/\/api$/, '');
  return `${baseUrl}${photoUrl}`;
};
