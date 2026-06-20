// import { Input } from "@/components/ui/input";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState } from "react";
// import { ArrowRight } from "lucide-react";

// // export type PersonalInfoData = {
// //   firstName: string;
// //   middleName: string;
// //   lastName: string;
// //   suffix: string;
// //   email: string;
// // };

// type Props = {
//   data: PersonalInfoData;
//   onNext: (data: PersonalInfoData) => void;
// };

// export function PersonalInfoStep({ data, onNext }: Props) {
//   const [form, setForm] = useState<PersonalInfoData>(data);

//   const set =
//     (field: keyof PersonalInfoData) =>
//     (e: React.ChangeEvent<HTMLInputElement>) =>
//       setForm((prev) => ({ ...prev, [field]: e.target.value }));

//   return (
//     <FieldGroup>
//       <div className="flex flex-col gap-1 text-center mb-4">
//         <h1 className="text-2xl font-bold">Personal information</h1>
//         <p className="text-sm text-muted-foreground">
//           Enter your legal name as it appears on your school records.
//         </p>
//       </div>

//       <div className="grid grid-cols-[1fr_1fr_80px] gap-3">
//         <Field>
//           <FieldLabel htmlFor="firstName">First name</FieldLabel>
//           <Input
//             id="firstName"
//             value={form.firstName}
//             onChange={set("firstName")}
//             placeholder="Juan"
//             required
//           />
//         </Field>
//         <Field>
//           <FieldLabel htmlFor="lastName">Last name</FieldLabel>
//           <Input
//             id="lastName"
//             value={form.lastName}
//             onChange={set("lastName")}
//             placeholder="Cruz"
//             required
//           />
//         </Field>
//         <Field>
//           <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
//           <Select
//             value={form.suffix}
//             onValueChange={(v) => setForm((p) => ({ ...p, suffix: v }))}>
//             <SelectTrigger id="suffix">
//               <SelectValue placeholder="—" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">—</SelectItem>
//               <SelectItem value="Jr.">Jr.</SelectItem>
//               <SelectItem value="Sr.">Sr.</SelectItem>
//               <SelectItem value="II">II</SelectItem>
//               <SelectItem value="III">III</SelectItem>
//             </SelectContent>
//           </Select>
//         </Field>
//       </div>

//       <Field>
//         <FieldLabel htmlFor="middleName">
//           Middle name{" "}
//           <span className="text-muted-foreground text-xs font-normal">
//             (optional)
//           </span>
//         </FieldLabel>
//         <Input
//           id="middleName"
//           value={form.middleName}
//           onChange={set("middleName")}
//           placeholder="Santos"
//         />
//       </Field>

//       <Field>
//         <FieldLabel htmlFor="email">Email</FieldLabel>
//         <Input
//           id="email"
//           type="email"
//           value={form.email}
//           onChange={set("email")}
//           placeholder="juan@dmc.edu.ph"
//           required
//         />
//       </Field>

//       <Button type="button" className="w-full" onClick={() => onNext(form)}>
//         NEXT <ArrowRight className="size-4 ml-1" />
//       </Button>
//       <Field>
//         <FieldDescription className="px-6 text-center">
//           Already have an account? <a href="/login">Sign in</a>
//         </FieldDescription>
//       </Field>
//     </FieldGroup>
//   );
// }
