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

export const yearLevelOptions = ['1', '2', '3', '4'] as const;

export const statusOptions = [
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Approved' },
  { value: '3', label: 'Rejected' },
] as const;

export type ProgramOption = (typeof programOptions)[number];
export type YearLevelOption = (typeof yearLevelOptions)[number];
