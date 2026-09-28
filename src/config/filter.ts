export interface ApplicantFilters {
  program: string;
  yearLevel: string;
  status: string;
}

export const programOptions = [
  'BSN',
  'BSMT',
  'BSPT',
  'BSRT',
  'BSPH',
  'BSIT',
  'BSED',
  'BSBA',
  'BSHM',
] as const;

export const yearLevelOptions = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
] as const;

export const statusOptions = [
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Approved' },
  { value: '3', label: 'Rejected' },
] as const;

export type ProgramOption = (typeof programOptions)[number];
export type YearLevelOption = (typeof yearLevelOptions)[number]['value'];
