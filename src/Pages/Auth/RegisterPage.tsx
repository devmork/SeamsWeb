// import { useState, useRef } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { signUp } from "@/service/authService"; // Adjust the import path as needed
// import type { SignUpData } from "@/types/user.type";

// const STEPS = ["Personal Info", "School Info", "Profile Photo"];

// const SUFFIXES = ["Jr.", "Sr.", "II", "III", "IV", "V"];
// const YEAR_LEVELS = [
//   { value: 1, label: "1st Year" },
//   { value: 2, label: "2nd Year" },
//   { value: 3, label: "3rd Year" },
//   { value: 4, label: "4th Year" },
// ];
// const PROGRAMS = [
//   "BSIT - Bachelor of Science in Information Technology",
//   "BSCS - Bachelor of Science in Computer Science",
//   "BSED - Bachelor of Science in Education",
//   "BSN - Bachelor of Science in Nursing",
//   "BSBA - Bachelor of Science in Business Administration",
// ];

// export default function RegisterPage() {
//   const [step, setStep] = useState(0);
//   const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     // Personal Info
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     suffix: "",
//     email: "",
//     // School Info
//     studentId: "",
//     yearLevel: 1,
//     course: "",
//     // Profile Photo
//     photoUrl: "",
//   });

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (error) setError(null);
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setFileName(file.name);
//     setFormData(prev => ({ ...prev, profilePhoto: file }));
//     const reader = new FileReader();
//     reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
//     reader.readAsDataURL(file);
//     if (error) setError(null);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Prepare data for the API based on your SignUpData type
//       const signUpData: SignUpData = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         middleName: formData.middleName || undefined,
//         suffix: formData.suffix || undefined,
//         email: formData.email,
//         schoolStudentId: formData.studentId,
//         yearLevel: formData.yearLevel,
//         course: formData.course,
//         photoUrl:formData.photoUrl || undefined
//         // If your API expects a profile photo, you might need to handle it separately
//         // since SignUpData might not include a file field
//       };
      
//       // If your API expects FormData for file upload:
//       // const formDataToSend = new FormData();
//       // Object.keys(signUpData).forEach(key => {
//       //   if (signUpData[key as keyof SignUpData]) {
//       //     formDataToSend.append(key, signUpData[key as keyof SignUpData] as string);
//       //   }
//       // });
//       // if (formData.profilePhoto) {
//       //   formDataToSend.append('profilePhoto', formData.profilePhoto);
//       // }
//       // const response = await signUp(formDataToSend);
      
//       // For regular JSON submission:
//       const response = await signUp(signUpData);
      
//       console.log("Registration successful:", response);
      
//       // Handle success - maybe redirect to login or dashboard
//       // window.location.href = "/login";
//       // Or show success message
//       alert("Registration successful! Please log in.");
      
//     } catch (err: any) {
//       console.error("Registration error:", err);
//       // Handle different error scenarios
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         if (err.response.status === 409) {
//           setError("Email or Student ID already exists");
//         } else if (err.response.status === 400) {
//           setError(err.response.data.message || "Invalid form data");
//         } else {
//           setError(err.response.data.message || "Registration failed");
//         }
//       } else if (err.request) {
//         // The request was made but no response was received
//         setError("Network error. Please check your connection.");
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         setError(err.message || "An error occurred during registration");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Step progress bar */}
//           <div className="flex">
//             {STEPS.map((_, i) => (
//               <div
//                 key={i}
//                 className={`h-1 flex-1 transition-colors duration-300 ${i <= step ? "bg-blue-600" : "bg-slate-200"}`}
//               />
//             ))}
//           </div>

//           <div className="p-8">
//             {/* Header */}
//             <div className="text-center mb-6">
//               <h1 className="text-2xl font-bold text-slate-800">
//                 Create Account
//               </h1>
//               <p className="text-sm text-slate-500 mt-1">
//                 Step {step + 1} of {STEPS.length} — {STEPS[step]}
//               </p>
//             </div>

//             {/* Error message */}
//             {error && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                 <p className="text-sm text-red-600">{error}</p>
//               </div>
//             )}

//             {/* Step indicators */}
//             <div className="flex items-center justify-center gap-2 mb-7">
//               {STEPS.map((_label, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                   <div
//                     className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors duration-300
//                     ${i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-500"}`}>
//                     {i < step ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2.5}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                     ) : (
//                       i + 1
//                     )}
//                   </div>
//                   {i < STEPS.length - 1 && (
//                     <div
//                       className={`w-8 h-0.5 ${i < step ? "bg-blue-600" : "bg-slate-200"}`}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* ── Step 1: Personal Info ── */}
//             {step === 0 && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-slate-700">
//                       First Name
//                     </label>
//                     <div className="relative">
//                       <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                       </span>
//                       <Input 
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="First Name" 
//                         className="h-10 pl-9"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-slate-700">
//                       Middle Name{" "}
//                       <span className="text-slate-400 font-normal">
//                         (optional)
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                       </span>
//                       <Input 
//                         name="middleName"
//                         value={formData.middleName}
//                         onChange={handleChange}
//                         placeholder="Middle Name" 
//                         className="h-10 pl-9"
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-slate-700">
//                       Last Name
//                     </label>
//                     <div className="relative">
//                       <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           />
//                         </svg>
//                       </span>
//                       <Input 
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Last Name" 
//                         className="h-10 pl-9"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-slate-700">
//                       Suffix{" "}
//                       <span className="text-slate-400 font-normal">
//                         (optional)
//                       </span>
//                     </label>
//                     <select 
//                       name="suffix"
//                       value={formData.suffix}
//                       onChange={handleChange}
//                       className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
//                       disabled={isLoading}>
//                       <option value="">Select Suffix</option>
//                       {SUFFIXES.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="block text-sm font-medium text-slate-700">
//                     Email
//                   </label>
//                   <div className="relative">
//                     <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </span>
//                     <Input
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="example@dmc.edu.ph"
//                       type="email"
//                       className="h-10 pl-9"
//                       required
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── Step 2: School Info ── */}
//             {step === 1 && (
//               <div className="space-y-4">
//                 <div className="space-y-1.5">
//                   <label className="block text-sm font-medium text-slate-700">
//                     Student ID
//                   </label>
//                   <div className="relative">
//                     <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     </span>
//                     <Input 
//                       name="studentId"
//                       value={formData.studentId}
//                       onChange={handleChange}
//                       placeholder="2023-0446" 
//                       className="h-10 pl-9"
//                       required
//                       disabled={isLoading}
//                     />
//                   </div>
//                   <p className="text-xs text-slate-400 pl-1">
//                     Format: YYYY-NNNN
//                   </p>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="block text-sm font-medium text-slate-700">
//                     Year Level
//                   </label>
//                   <div className="relative">
//                     <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </span>
//                     <select 
//                       name="yearLevel"
//                       value={formData.yearLevel}
//                       onChange={handleChange}
//                       className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
//                       required
//                       disabled={isLoading}>
//                       <option value="">Select Year Level</option>
//                       {YEAR_LEVELS.map((y) => (
//                         <option key={y.value} value={y.value}>
//                           {y.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="block text-sm font-medium text-slate-700">
//                     Program
//                   </label>
//                   <div className="relative">
//                     <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 14l9-5-9-5-9 5 9 5z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 14l6.16-3.422A12.083 12.083 0 0121 17c0 3.314-4.029 6-9 6s-9-2.686-9-6a12.083 12.083 0 012.84-6.422L12 14z"
//                         />
//                       </svg>
//                     </span>
//                     <select 
//                       name="course"
//                       value={formData.course}
//                       onChange={handleChange}
//                       className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
//                       required
//                       disabled={isLoading}>
//                       <option value="">Select Program</option>
//                       {PROGRAMS.map((p) => (
//                         <option key={p} value={p}>
//                           {p}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── Step 3: Profile Photo ── */}
//             {step === 2 && (
//               <div className="flex flex-col items-center gap-4">
//                 {/* Avatar preview */}
//                 <div className="w-32 h-32 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
//                   {avatarSrc ? (
//                     <img
//                       src={avatarSrc}
//                       alt="Profile preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <svg
//                       viewBox="0 0 128 128"
//                       className="w-28 h-28"
//                       xmlns="http://www.w3.org/2000/svg">
//                       <circle cx="64" cy="46" r="24" fill="#b0bec5" />
//                       <ellipse cx="64" cy="100" rx="40" ry="28" fill="#90a4ae" />
//                     </svg>
//                   )}
//                 </div>
//                 <p className="text-sm font-medium text-slate-700">Upload Image</p>
//                 <p className="text-xs text-slate-400 -mt-3">
//                   Profile photo is <span className="font-medium">optional</span>
//                 </p>

//                 {/* File input */}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-white text-sm text-slate-600 hover:bg-slate-50 shadow-xs transition-colors"
//                   disabled={isLoading}>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 text-slate-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                   {fileName ? fileName : "No File Chosen"}
//                 </button>
//               </div>
//             )}

//             {/* Navigation buttons */}
//             <div
//               className={`flex mt-7 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
//               {step > 0 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1 h-10"
//                   onClick={() => setStep((s) => s - 1)}
//                   disabled={isLoading}>
//                   ← Previous
//                 </Button>
//               )}
//               {step < STEPS.length - 1 ? (
//                 <Button
//                   type="button"
//                   className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//                   onClick={() => setStep((s) => s + 1)}
//                   disabled={isLoading}>
//                   Next →
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleSubmit}
//                   className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//                   disabled={isLoading}>
//                   {isLoading ? "Creating Account..." : "Create Account"}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Sign in link */}
//         <p className="absolute bottom-6 text-center text-sm text-black/80">
//           Already have an account?{" "}
//           <a href="/login" className="text-black font-semibold hover:underline">
//             Sign in
//           </a>
//         </p>
//       </div>
//   );
// }
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/service/authService";
import { uploadStudentPhoto, validatePhotoFile } from "@/service/fileUploadService";
import type { SignUpData } from "@/types/user.type";

const STEPS = ["Personal Info", "School Info", "Profile Photo"];

const SUFFIXES = ["Jr.", "Sr.", "II", "III", "IV", "V"];
const YEAR_LEVELS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
];
const PROGRAMS = [
  "BSIT - Bachelor of Science in Information Technology",
  "BSCS - Bachelor of Science in Computer Science",
  "BSED - Bachelor of Science in Education",
  "BSN - Bachelor of Science in Nursing",
  "BSBA - Bachelor of Science in Business Administration",
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    // School Info
    studentId: "",
    yearLevel: 1,
    course: "",
    // Profile Photo
    photoFile: null as File | null,
    photoUrl: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validatePhotoFile(file);
      
      setFileName(file.name);
      setFormData(prev => ({ ...prev, photoFile: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
      
      if (error) setError(null);
    } catch (err: any) {
      setError(err.message);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ✅ FIXED: Returns the photo URL directly
  async function handleUploadPhoto(): Promise<string | null> {
    if (!formData.photoFile) return null;

    setIsUploading(true);
    setError(null);

    try {
      const photoUrl = await uploadStudentPhoto(formData.photoFile);
      setFormData(prev => ({ ...prev, photoUrl }));
      console.log("Photo uploaded successfully:", photoUrl);
      return photoUrl; // ✅ Return the URL directly
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload photo");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  // ✅ FIXED: Uses the returned URL directly
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      let uploadedPhotoUrl = "";
      
      // Step 1: Upload photo if one is selected
      if (formData.photoFile) {
        const photoUrl = await handleUploadPhoto(); // ✅ Gets URL directly
        if (!photoUrl) {
          setIsLoading(false);
          return;
        }
        uploadedPhotoUrl = photoUrl; // ✅ Use the returned URL
      }
      
      // Step 2: Prepare data for API
      const signUpData: SignUpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        suffix: formData.suffix || undefined,
        email: formData.email,
        schoolStudentId: formData.studentId,
        yearLevel: formData.yearLevel,
        course: formData.course,
        photoUrl: uploadedPhotoUrl || undefined
      };
      
      console.log("📤 Sending to API:", signUpData);
      
      // Step 3: Create student account
      const response = await signUp(signUpData);
      
      console.log("Registration successful:", response);
      alert("Registration successful! Please log in.");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.response) {
        if (err.response.status === 409) {
          setError("Email or Student ID already exists");
        } else if (err.response.status === 400) {
          setError(err.response.data.message || "Invalid form data");
        } else {
          setError(err.response.data.message || "Registration failed");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function canProceedToNextStep() {
    if (step === 0) {
      return formData.firstName && formData.lastName && formData.email;
    }
    if (step === 1) {
      return formData.studentId && formData.course;
    }
    return true;
  }

  function handleNextStep() {
    if (!canProceedToNextStep()) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setStep(s => s + 1);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Step progress bar */}
        <div className="flex">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors duration-300 ${i <= step ? "bg-blue-600" : "bg-slate-200"}`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-7">
            {STEPS.map((_label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors duration-300
                  ${i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-500"}`}>
                  {i < step ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${i < step ? "bg-blue-600" : "bg-slate-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Step 1: Personal Info ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    First Name *
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <Input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name" 
                      className="h-10 pl-9"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Middle Name{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <Input 
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Middle Name" 
                      className="h-10 pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Last Name *
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <Input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name" 
                      className="h-10 pl-9"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Suffix{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <select 
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
                    disabled={isLoading}>
                    <option value="">Select Suffix</option>
                    {SUFFIXES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Email *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@dmc.edu.ph"
                    type="email"
                    className="h-10 pl-9"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: School Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Student ID *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <Input 
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="2023-0446" 
                    className="h-10 pl-9"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-slate-400 pl-1">
                  Format: YYYY-NNNN
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Year Level *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <select 
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
                    required
                    disabled={isLoading}>
                    <option value="">Select Year Level</option>
                    {YEAR_LEVELS.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Program *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l6.16-3.422A12.083 12.083 0 0121 17c0 3.314-4.029 6-9 6s-9-2.686-9-6a12.083 12.083 0 012.84-6.422L12 14z"
                      />
                    </svg>
                  </span>
                  <select 
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm text-slate-700 shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] transition-[color,box-shadow]"
                    required
                    disabled={isLoading}>
                    <option value="">Select Program</option>
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Profile Photo ── */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-4">
              {/* Avatar preview */}
              <div className="w-32 h-32 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 128 128"
                    className="w-28 h-28"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="64" cy="46" r="24" fill="#b0bec5" />
                    <ellipse cx="64" cy="100" rx="40" ry="28" fill="#90a4ae" />
                  </svg>
                )}
              </div>
              
              {/* Show upload status */}
              {isUploading && (
                <p className="text-sm text-blue-600">Uploading photo...</p>
              )}
              
              {formData.photoUrl && !isUploading && (
                <p className="text-sm text-green-600">✓ Photo uploaded successfully</p>
              )}
              
              <p className="text-sm font-medium text-slate-700">Upload Image</p>
              <p className="text-xs text-slate-400 -mt-3">
                Profile photo is <span className="font-medium">optional</span>
              </p>

              {/* File input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading || isUploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-white text-sm text-slate-600 hover:bg-slate-50 shadow-xs transition-colors"
                disabled={isLoading || isUploading}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {fileName ? fileName : "Choose File"}
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          <div
            className={`flex mt-7 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10"
                onClick={() => setStep((s) => s - 1)}
                disabled={isLoading || isUploading}>
                ← Previous
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={handleNextStep}
                disabled={isLoading || isUploading}>
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading || isUploading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Sign in link */}
      <p className="absolute bottom-6 text-center text-sm text-black/80">
        Already have an account?{" "}
        <a href="/login" className="text-black font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}