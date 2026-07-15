// src/services/fileUploadService.ts
import axios from "axios"; // ✅ Import axios directly, not from authService

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7122/api";

// ✅ Create a separate axios instance for file uploads
const fileApi = axios.create({
  baseURL: API_BASE_URL,
  // No default Content-Type header - let it be set automatically
});

// ✅ Add auth interceptor to this instance
fileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - let axios handle it
  return config;
});

export interface FileUploadResponse {
  photoUrl: string;
  message: string;
}

/**
 * Upload a student photo
 * @param file - The image file to upload
 * @returns Promise with the photo URL
 */
export const uploadStudentPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("photo", file);

  // Use the fileApi instance instead of the auth api
  const response = await fileApi.post<FileUploadResponse>(
    "/FileUpload/StudentPhoto",
    formData
  );

  return response.data.photoUrl;
};

/**
 * Delete a student photo
 * @param photoUrl - The URL of the photo to delete
 */
export const deleteStudentPhoto = async (photoUrl: string): Promise<void> => {
  await fileApi.delete(`/FileUpload/StudentPhoto`, {
    params: { photoUrl },
  });
};

/**
 * Validate file before upload
 * @param file - The file to validate
 * @throws Error if validation fails
 */
export const validatePhotoFile = (file: File): void => {
  if (!file) {
    throw new Error("No file selected");
  }

  // Check file size (max 5MB)
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size cannot exceed ${maxSizeMB}MB`);
  }

  // Check file type by MIME type
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, GIF, WEBP");
  }

  // Check file extension
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Invalid file extension. Allowed: .jpg, .jpeg, .png, .gif, .webp");
  }
};

/**
 * Get full image URL
 * @param photoUrl - The relative photo URL from API
 * @returns Full URL to access the image
 */
export const getImageUrl = (photoUrl: string | null | undefined): string | null => {
  if (!photoUrl) return null;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7122";
  const baseUrl = API_BASE_URL.replace(/\/api$/, "");
  return `${baseUrl}${photoUrl}`;
};