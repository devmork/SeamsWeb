// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import type { PersonalInfoData } from "./PersonalInfoStep";
// import type { SchoolInfoData } from "./SchoolInfoStep";
// import type { PhotoData } from "./PhotoUploadStep";
// import { ArrowLeft } from "lucide-react";

// type Props = {
//   personal: PersonalInfoData;
//   school: SchoolInfoData;
//   photo: PhotoData;
//   onSubmit: () => void;
//   onBack: () => void;
//   isSubmitting: boolean;
// };

// const Row = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex justify-between py-2 text-sm border-b last:border-0">
//     <span className="text-muted-foreground">{label}</span>
//     <span className="font-medium">{value || "—"}</span>
//   </div>
// );

// export function ReviewStep({
//   personal,
//   school,
//   photo,
//   onSubmit,
//   onBack,
//   isSubmitting,
// }: Props) {
//   const fullName = [
//     personal.firstName,
//     personal.middleName,
//     personal.lastName,
//     personal.suffix,
//   ]
//     .filter(Boolean)
//     .join(" ");
//   const initials = [personal.firstName[0], personal.lastName[0]]
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex flex-col gap-1 text-center">
//         <h1 className="text-2xl font-bold">Review your details</h1>
//         <p className="text-sm text-muted-foreground">
//           Check everything before submitting. Your application will be reviewed
//           by the admin.
//         </p>
//       </div>

//       <div className="flex items-center gap-3">
//         {photo.previewUrl ? (
//           <img
//             src={photo.previewUrl}
//             className="w-12 h-12 rounded-full object-cover border"
//             alt="Profile"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
//             {initials}
//           </div>
//         )}
//         <div>
//           <p className="font-medium">{fullName}</p>
//           <p className="text-sm text-muted-foreground">{personal.email}</p>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//           Personal
//         </p>
//         <Row label="First name" value={personal.firstName} />
//         <Row label="Middle name" value={personal.middleName} />
//         <Row label="Last name" value={personal.lastName} />
//         <Row label="Suffix" value={personal.suffix} />
//         <Row label="Email" value={personal.email} />
//       </div>

//       <div>
//         <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//           School
//         </p>
//         <Row label="Student ID" value={school.studentId} />
//         <Row label="Year level" value={school.yearLevel} />
//         <Row label="Department" value={school.department} />
//       </div>

//       <div className="flex gap-2 pt-2">
//         <Button
//           type="button"
//           variant="outline"
//           className="flex-1"
//           onClick={onBack}
//           disabled={isSubmitting}>
//           <ArrowLeft className="size-4 ml-1" />
//           Back
//         </Button>
//         <Button
//           type="button"
//           className="flex-1"
//           onClick={onSubmit}
//           disabled={isSubmitting}>
//           {isSubmitting ? "Submitting..." : "CONFIRM"}
//         </Button>
//       </div>
//     </div>
//   );
// }
