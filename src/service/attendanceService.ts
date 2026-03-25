// // services/attendance.service.ts
// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://localhost:7122/api";

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Types
// export interface AttendanceEvent {
//   name: string;
//   note: string | null;
//   date: string;
//   logType: string;
//   semester: number;
//   startTime: string;
//   endTime: string;
//   status: number;
// }

// export interface EventItem {
//   id: string;
//   name: string;
//   status: 'ongoing' | 'upcoming' | 'ended';
//   time: string;
// }

// // Helper functions
// const determineEventStatus = (event: AttendanceEvent): 'ongoing' | 'upcoming' | 'ended' => {
//   const now = new Date();
//   const eventDate = new Date(event.date);
//   const [startHour, startMinute] = event.startTime.split('T')[1].split(':');
//   const eventStartTime = new Date(eventDate);
//   eventStartTime.setHours(parseInt(startHour), parseInt(startMinute));
  
//   const [endHour, endMinute] = event.endTime.split('T')[1].split(':');
//   const eventEndTime = new Date(eventDate);
//   eventEndTime.setHours(parseInt(endHour), parseInt(endMinute));

//   if (now < eventStartTime) {
//     return 'upcoming';
//   } else if (now >= eventStartTime && now <= eventEndTime) {
//     return 'ongoing';
//   } else {
//     return 'ended';
//   }
// };

// const formatEventTime = (event: AttendanceEvent): string => {
//   const startTime = event.startTime.split('T')[1].substring(0, 5);
//   const endTime = event.endTime.split('T')[1].substring(0, 5);
//   const eventDate = new Date(event.date);
  
//   const today = new Date();
//   const isToday = eventDate.toDateString() === today.toDateString();
  
//   if (isToday) {
//     return `${startTime} - ${endTime}`;
//   } else {
//     const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     return `${formattedDate} • ${startTime} - ${endTime}`;
//   }
// };

// // Attendance Service functions
// export const getAttendanceEvents = async (): Promise<AttendanceEvent[]> => {
//   const response = await api.get<AttendanceEvent[]>("/Attendance");
//   return response.data;
// };

// export const getEventItems = async (): Promise<EventItem[]> => {
//   const events = await getAttendanceEvents();
//   return events.map((event, index) => ({
//     id: index.toString(),
//     name: event.name,
//     status: determineEventStatus(event),
//     time: formatEventTime(event)
//   }));
// };
// services/attendance.service.ts

//LAST WORKING IMPLEMENTATION (WED MAR 25 9:07PM)
// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://localhost:7122/api";

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export interface AttendanceEvent {
//   name: string;
//   note: string | null;
//   date: string;
//   logType: string;
//   semester: number;
//   startTime: string;
//   endTime: string;
//   status: number;
// }

// export interface EventItem {
//   id: string;
//   name: string;
//   status: 'ongoing' | 'upcoming' | 'ended';
//   time: string;
// }

// const formatToAMPM = (timeStr: string): string => {
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   const period = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours % 12 || 12;
//   return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
// };

// const determineEventStatus = (event: AttendanceEvent): 'ongoing' | 'upcoming' | 'ended' => {
//   const now = new Date();
//   const eventDate = new Date(event.date);
  
//   const startTimeStr = event.startTime.split('T')[1].substring(0, 5);
//   const [startHour, startMinute] = startTimeStr.split(':').map(Number);
//   const eventStartTime = new Date(eventDate);
//   eventStartTime.setHours(startHour, startMinute, 0);
  
//   const endTimeStr = event.endTime.split('T')[1].substring(0, 5);
//   const [endHour, endMinute] = endTimeStr.split(':').map(Number);
//   const eventEndTime = new Date(eventDate);
//   eventEndTime.setHours(endHour, endMinute, 0);

//   if (now < eventStartTime) {
//     return 'upcoming';
//   } else if (now >= eventStartTime && now <= eventEndTime) {
//     return 'ongoing';
//   } else {
//     return 'ended';
//   }
// };

// const formatEventTime = (event: AttendanceEvent): string => {
//   const startTimeStr = event.startTime.split('T')[1].substring(0, 5);
//   const endTimeStr = event.endTime.split('T')[1].substring(0, 5);
  
//   const startTimeAMPM = formatToAMPM(startTimeStr);
//   const endTimeAMPM = formatToAMPM(endTimeStr);
  
//   const eventDate = new Date(event.date);
//   const today = new Date();
//   const isToday = eventDate.toDateString() === today.toDateString();
  
//   if (isToday) {
//     return `${startTimeAMPM} - ${endTimeAMPM}`;
//   } else {
//     const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     return `${formattedDate} • ${startTimeAMPM} - ${endTimeAMPM}`;
//   }
// };

// export const getAttendanceEvents = async (): Promise<AttendanceEvent[]> => {
//   const response = await api.get<AttendanceEvent[]>("/Attendance");
//   return response.data;
// };

// export const getEventItems = async (): Promise<EventItem[]> => {
//   const events = await getAttendanceEvents();
//   return events.map((event, index) => ({
//     id: index.toString(),
//     name: event.name,
//     status: determineEventStatus(event),
//     time: formatEventTime(event)
//   }));
// };
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7122/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AttendanceEvent {
  attendanceId: number;
  name: string;
  note: string | null;
  date: string;
  logType: string;
  semester: number;
  startTime: string;
  endTime: string;
  status: number;
}

export interface EventItem {
  id: string;
  name: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  time: string;
}

// DTO for recording attendance
export interface CreateAttendanceRecordDTO {
  attendanceID: number;
  schoolStudentID: string;
}

// DTO for attendance record list response
export interface AttendanceRecordDTO {
  fullName: string;
  schoolStudentId: string;
}

const formatToAMPM = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const determineEventStatus = (event: AttendanceEvent): 'ongoing' | 'upcoming' | 'ended' => {
  const now = new Date();
  const eventDate = new Date(event.date);
  
  // Parse start time
  const startTimeStr = event.startTime.split('T')[1].substring(0, 5);
  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  const eventStartTime = new Date(eventDate);
  eventStartTime.setHours(startHour, startMinute, 0);
  
  // Parse end time
  const endTimeStr = event.endTime.split('T')[1].substring(0, 5);
  const [endHour, endMinute] = endTimeStr.split(':').map(Number);
  
  // Create end date - if end time is earlier than start time, add a day (crosses midnight)
  let eventEndTime = new Date(eventDate);
  eventEndTime.setHours(endHour, endMinute, 0);
  
  // Check if event crosses midnight (end time is earlier than start time)
  if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
    eventEndTime = new Date(eventEndTime.getTime() + 24 * 60 * 60 * 1000);
  }

  if (now < eventStartTime) {
    return 'upcoming';
  } else if (now >= eventStartTime && now <= eventEndTime) {
    return 'ongoing';
  } else {
    return 'ended';
  }
};

const formatEventTime = (event: AttendanceEvent): string => {
  const startTimeStr = event.startTime.split('T')[1].substring(0, 5);
  const endTimeStr = event.endTime.split('T')[1].substring(0, 5);
  
  const startTimeAMPM = formatToAMPM(startTimeStr);
  const endTimeAMPM = formatToAMPM(endTimeStr);
  
  const eventDate = new Date(event.date);
  const today = new Date();
  const isToday = eventDate.toDateString() === today.toDateString();
  
  if (isToday) {
    return `${startTimeAMPM} - ${endTimeAMPM}`;
  } else {
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formattedDate} • ${startTimeAMPM} - ${endTimeAMPM}`;
  }
};

export const getAttendanceEvents = async (): Promise<AttendanceEvent[]> => {
  const response = await api.get<AttendanceEvent[]>("/Attendance");
  return response.data;
};

export const getEventItems = async (): Promise<EventItem[]> => {
  const events = await getAttendanceEvents();
  return events.map((event) => ({
    id: event.attendanceId.toString(),  // ← USE REAL AttendanceId
    name: event.name,
    status: determineEventStatus(event),
    time: formatEventTime(event)
  }));
};

// Record attendance for a student
export const recordAttendance = async (attendanceID: number, schoolStudentID: string): Promise<void> => {
  const payload: CreateAttendanceRecordDTO = {
    attendanceID: attendanceID,
    schoolStudentID: schoolStudentID
  };
  await api.post("/AttendanceRecord/record-attendance", payload);
};

// Get list of scanned students for an event
export const getScannedStudentsList = async (
  attendanceEventName: string,
  logType: string,
  semester: number,
  year: number
): Promise<AttendanceRecordDTO[]> => {
  const response = await api.get<AttendanceRecordDTO[]>(
    "/AttendanceRecord/attendance-record-list",
    {
      params: {
        attendanceEventName,
        logType,
        semester,
        year
      }
    }
  );
  return response.data;
};