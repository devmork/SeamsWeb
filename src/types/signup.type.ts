export type PersonalInfoData = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
};

export type SchoolInfoData = {
  studentId: string;
  yearLevel: string;
  department: string;
};

export type PhotoData = {
  file: File | null;
  previewUrl: string;
  base64: string;
};
