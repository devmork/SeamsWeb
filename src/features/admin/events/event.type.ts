export interface Event {
  eventId: number;
  title: string;
  eventName: string;
  startDate: string;
  endDate: string;
  targetYearLevels: string[];
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  targetYearLevels: string[];
}
