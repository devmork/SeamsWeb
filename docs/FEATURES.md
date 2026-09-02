# 4. Features

This is a guided tour of every feature module, plus the exact pattern to copy when you build a new one.

## 4.1 The service-layer pattern

Every feature's `services/*.ts` file wraps a slice of the backend API using the shared `api` Axios instance (`@/service/api` — see [03-authentication.md](./03-authentication.md#33-token-usage--axios-interceptors)). Two equally valid export styles show up in the codebase — know both, since you'll read both:

**Object-of-methods style** (e.g. `StudentService.ts`, `attendanceRecordService`):

```ts
import api from '@/service/api';
import type { Student, StudentRequest } from '../student.type';

export const studentService = {
  getAllActiveStudents: async (): Promise<Student[]> => {
    const response = await api.get<Student[]>('/student');
    return response.data;
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
```

**Named-function style** (e.g. `EventService.ts`):

```ts
export const getAllEvents = async (): Promise<Event[]> => {
  /* ... */
};
export const createEvent = async (data: EventFormData): Promise<Event> => {
  /* ... */
};
export const updateEvent = async (
  eventId: number,
  data: EventFormData,
): Promise<void> => {
  /* ... */
};
export const deleteEvent = async (eventId: number): Promise<void> => {
  /* ... */
};
```

Either is fine for a new feature — **prefer whichever style the sibling feature you're closest to already uses**, for consistency within that corner of the app. Both patterns share the same rules:

- Always type the response generic (`api.get<Student[]>(...)`) so the return type is inferred, not `any`.
- Return `response.data`, not the whole Axios response.
- Never attach the auth header manually — the shared instance already does it.
- Components call these functions inside `useEffect`/event handlers and manage their own `loading`/`error` state (there is no global data-fetching library like React Query in this repo — see 4.6).

## 4.2 Auth (`features/auth/`)

Covered in depth in [03-authentication.md](./03-authentication.md). Contains `LoginForm`, `SignupForm`, and `AuthService.ts` (login/signup/logout/current-user/token helpers). Note `signUp()` hits `/student-application/signup` — it's an _application_ for a new student to join, reviewed by an admin (see Applicants below), not instant self-registration.

## 4.3 Admin (`features/admin/`)

The admin role manages the org's core data. Five sub-features, each following the same shape (`*.type.ts`, `index.ts`, `components/`, `services/`):

| Sub-feature     | Purpose                                                                                                                          | Key components                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **students**    | Roster of active/enrolled students; view detail, edit, deactivate                                                                | `StudentList`, `StudentDetailDialog`, `StudentDeactivateDialog` |
| **officers**    | Manage officer accounts (the users who scan QR codes at events)                                                                  | `OfficerList`, `OfficerSheet` (add/edit), `RemoveOfficerDialog` |
| **events**      | Create/edit/delete events that attendance sessions belong to                                                                     | `EventList`, `EventDialog`                                      |
| **applicants**  | Review pending student sign-up applications (approve → becomes a student)                                                        | `ApplicantList`                                                 |
| **attendances** | Attendance _sessions_ tied to an event (e.g. "Morning Session — Day 1"), used by the Officer scanner to pick what to log against | `AttendanceList`, `AttendanceDialog`                            |

Routes: `/admin/students`, `/admin/officers`, `/admin/events`, `/admin/applicants` (see `src/routes/modules/admin.routes.tsx`). Note `attendances` has no direct route of its own — it's consumed by the Officer scan feature (see 4.4) and likely nested inside Events in the UI.

## 4.4 Officer (`features/officer/scan/`)

The officer role has one job: scan student QR codes to record attendance at a live event. `ScanQR.tsx` is the most involved component in the app — worth reading end-to-end as a model for how a "real" feature page is built. Its flow:

1. **Pick an event** — loads all events via `getAllEvents()` (from the Admin `events` feature — features _do_ import from each other's public `index.ts`/service when it makes sense, e.g. Officer reads Admin's event/attendance services rather than duplicating them).
2. **Pick a session** — once an event is chosen, loads that event's attendance sessions via `attendanceService.getAttendanceByEventId(...)` (from Admin's `attendances` feature).
3. **Scan** — uses `@yudiel/react-qr-scanner`'s `<Scanner>` component. Each student's QR encodes `"{FullName} - {schoolStudentId}"`; the handler parses out the ID after the last `" - "`.
4. **Record** — calls `attendanceRecordService.create({ attendanceID, schoolStudentID, status: ATTENDANCE_STATUS.Present })`, appends the result to a live "Scan History" list, and shows a `sonner` toast. A short `setTimeout` cooldown (1.5s) after each scan prevents immediately re-scanning the same code.

This is a good template to copy for any new "pick context → do the real-time thing → show a running result list" screen.

## 4.5 Student (`features/student/`)

The student role is read-mostly / self-service:

| Sub-feature    | Purpose                                                                                 | Key components |
| -------------- | --------------------------------------------------------------------------------------- | -------------- |
| **profile**    | View your own profile info                                                              | `MyProfile`    |
| **attendance** | View your own attendance history                                                        | `Attendance`   |
| **qr**         | View your personal QR code (base64 PNG returned by the backend) to present at scan time | `MyQR`         |

`MyQR.tsx` is a good minimal-feature reference: it loads one thing (`profileService.getMyProfile()`), and cleanly handles the three states every data-fetching component in this app should handle — **loading** (spinner), **error** (message + retry button), and **success** (render data). Copy this loading/error/success shape for new read-only pages.

## 4.6 Shared front-end conventions across all features

- **No global state/data-fetching library.** No Redux, Zustand, or React Query here (even though the developer's other projects sometimes use Zustand — this one doesn't). Each component owns its `useState`/`useEffect` data fetching locally. Keep this consistent unless the team deliberately decides to introduce one.
- **Toasts via `sonner`** (`import { toast } from 'sonner'`) for success/error feedback — the `<Toaster />` is mounted once in `AuthenticatedLayout` (see [02-architecture.md](./02-architecture.md#26-layouts)), so any page can just call `toast.success(...)` / `toast.error(...)`.
- **Feature-to-feature imports go through the public `index.ts`** where possible (e.g. `import { attendanceService } from '@/features/admin/attendances'`), keeping each feature's internal file layout free to change without breaking consumers.

## 4.7 Adding a new feature — checklist

1. Create `src/features/<role>/<name>/` with `*.type.ts`, `index.ts`, `components/`, `services/`.
2. Write the service functions against `api` (see 4.1).
3. Build the component(s); use existing `components/ui/*` primitives (see [05-ui-and-styling.md](./05-ui-and-styling.md)) rather than hand-rolling new ones.
4. Export the public component(s)/service from `index.ts`.
5. Add the route to the right file in `src/routes/modules/` (see [02-architecture.md](./02-architecture.md#25-routing)).
6. Add a nav entry in `src/config/navigation.ts` if it should appear in the sidebar.

## 4.8 Recent feature additions

The following feature modules have been added since the last documentation update:

- **admin** – handles applicant management, attendance tracking, event scheduling, and officer oversight.
- **attendance** – records and reports student attendance; includes service-layer API wrappers.
- **events** – manages event creation, publishing, and participant registration.
- **officer/scan** – implements QR‑code scanning for officer check‑ins; uses `MyQR.tsx` as a minimal example.
- **student** – provides profile management, QR-based check‑in, and attendance history.

Each of these follows the standard feature layout (`*.type.ts`, `index.ts`, `components/`, `services/`) and integrates with routing via `src/routes/modules/`.
