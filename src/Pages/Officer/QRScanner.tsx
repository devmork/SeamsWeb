//LAST WORKING IMPLEMENTATION (TUE MAR 24 7:39PM)
// import React, { useState } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { Camera, LogOut, QrCode, ChevronDown, CheckCircle2 } from 'lucide-react';

// interface ScanRecord {
//   id: string;
//   studentId: string;
//   timestamp: Date;
// }

// interface EventItem {
//   id: string;
//   name: string;
//   status: 'ongoing' | 'upcoming' | 'ended';
//   time: string;
// }

// // Mock data for our dropdown
// const MOCK_EVENTS: EventItem[] = [
//   { id: '1', name: 'Seminar on AI', status: 'ongoing', time: '8:00 AM - 10:00 AM' },
//   { id: '2', name: 'General Assembly', status: 'upcoming', time: '1:00 PM - 4:00 PM' },
//   { id: '3', name: 'IT Week Opening', status: 'upcoming', time: 'Yesterday' },
// ];

// export default function QRScanner() {
//   const [manualId, setManualId] = useState('');
//   const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
//   const [isScanning, setIsScanning] = useState(false);
  
//   // Dropdown states
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<EventItem>(MOCK_EVENTS[0]);

//   // Handle successful QR Scan
//   const handleScan = (detectedCodes: { rawValue: string }[]) => {
//     if (detectedCodes && detectedCodes.length > 0) {
//       addScanRecord(detectedCodes[0].rawValue);
//     }
//   };

//   // Handle Manual Input Submit
//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (manualId.trim()) {
//       addScanRecord(manualId.trim());
//       setManualId('');
//     }
//   };

//   // Add to history and update state
//   const addScanRecord = (studentId: string) => {
//     setScanHistory(prev => {
//       // Prevent rapid duplicate scans
//       if (prev.length > 0 && prev[0].studentId === studentId) {
//         const timeDiff = new Date().getTime() - prev[0].timestamp.getTime();
//         if (timeDiff < 3000) return prev;
//       }

//       const newRecord: ScanRecord = {
//         id: Math.random().toString(36).substring(2, 9),
//         studentId,
//         timestamp: new Date(),
//       };
//       return [newRecord, ...prev];
//     });
//   };

//   // Helper function to color-code the status pills
//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'ongoing': return 'text-[#14532D] bg-[#DCFCE7]';
//       case 'upcoming': return 'text-blue-800 bg-blue-100';
//       case 'ended': return 'text-slate-600 bg-slate-200';
//       default: return 'text-slate-600 bg-slate-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
//       {/* Top Navigation Bar */}
//       <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#2E6B4A] p-2 rounded-md text-white">
//             <QrCode size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-800 leading-tight">SEAMS - Officer Portal</h1>
//             <p className="text-sm text-slate-500">QR Code Scanner</p>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
//           <LogOut size={16} />
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Left Column (Scanner & Controls) */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Scanner Card */}
//             <div className="bg-white rounded-xl border-2 border-[#2E6B4A] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-2">
//                 <Camera size={20} className="text-[#2E6B4A]" />
//                 <h2 className="text-lg font-bold">QR Code Scanner</h2>
//               </div>
//               <p className="text-sm text-slate-500 mb-6">Scan student QR codes for attendance</p>

//               {/* Functional Event Selector Dropdown */}
//               <div className="mb-6 relative z-30">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Select Event *</label>
                
//                 {/* Selected Value Box */}
//                 <div 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="font-medium">{selectedEvent.name}</span>
//                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(selectedEvent.status)}`}>
//                       {selectedEvent.status}
//                     </span>
//                   </div>
//                   <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                 </div>

//                 {/* Dropdown Menu & Invisible Overlay */}
//                 {isDropdownOpen && (
//                   <>
//                     {/* Invisible overlay to catch clicks outside the dropdown */}
//                     <div 
//                       className="fixed inset-0 z-40" 
//                       onClick={() => setIsDropdownOpen(false)}
//                     />
                    
//                     {/* Actual dropdown menu */}
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
//                       {MOCK_EVENTS.map((event) => (
//                         <div
//                           key={event.id}
//                           onClick={() => {
//                             setSelectedEvent(event);
//                             setIsDropdownOpen(false);
//                           }}
//                           className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-slate-100 transition-colors"
//                         >
//                           <span className="font-medium text-slate-700">{event.name}</span>
//                           <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(event.status)}`}>
//                             {event.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Camera Area */}
//               <div className="relative bg-[#0F172A] rounded-xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden mb-6 z-10">
//                 {!isScanning ? (
//                   <div className="flex flex-col items-center text-slate-400 z-10">
//                     <div className="w-32 h-32 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center mb-4">
//                       <Camera size={48} className="text-slate-500" />
//                     </div>
//                     <p className="font-medium text-slate-300">Camera scanner would appear here</p>
//                     <p className="text-sm mt-1">Click below to activate your device camera</p>
//                     <button 
//                       onClick={() => setIsScanning(true)}
//                       className="mt-4 px-4 py-2 bg-[#2E6B4A] text-white text-sm rounded-lg hover:bg-[#204e35] transition"
//                     >
//                       Start Camera
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="absolute inset-0 w-full h-full">
//                      <Scanner
//                         onScan={handleScan}
//                         components={{ finder: false }}
//                         styles={{ container: { width: '100%', height: '100%' } }}
//                      />
//                      {/* Overlay targeting box */}
//                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//                         <div className="w-48 h-48 border-2 border-[#2E6B4A] rounded-lg"></div>
//                      </div>
//                   </div>
//                 )}
//               </div>

//               {/* Manual Entry */}
//               <div className="z-10 relative">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Or enter manually:</label>
//                 <form onSubmit={handleManualSubmit} className="flex gap-3">
//                   <input
//                     type="text"
//                     value={manualId}
//                     onChange={(e) => setManualId(e.target.value)}
//                     placeholder="Enter Student ID (e.g., 2023-0444)"
//                     className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6B4A] focus:border-transparent"
//                   />
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-[#2E6B4A] text-white font-medium rounded-lg hover:bg-[#204e35] transition-colors"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Bottom Stats Cards
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Scans Today</h3>
//                 <p className="text-3xl font-bold text-slate-800">{scanHistory.length}</p>
//                 <p className="text-sm text-slate-500 mt-1">Total attendance recorded</p>
//               </div>
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Current Event</h3>
//                 <p className="text-lg font-bold text-slate-800 mt-1">{selectedEvent.name}</p>
//                 <p className="text-sm text-slate-500 mt-1">{selectedEvent.time}</p>
//               </div>
//             </div> */}

//           </div>

//          {/* Right Column (Scan History) */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full max-h-[330px] flex flex-col">
//               <h2 className="text-lg font-bold text-slate-800">Scan History</h2>
//               <p className="text-sm text-slate-500 mb-6">Recent attendance records</p>

//               {scanHistory.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                   <QrCode size={48} className="mb-4 opacity-50 text-slate-300" />
//                   <p className="font-medium text-slate-500">No scans yet</p>
//                   <p className="text-sm mt-1 text-center">Select an event and start scanning</p>
//                 </div>
//               ) : (
//                 <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
//                   {scanHistory.map((record) => (
//                     <div key={record.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg animate-in fade-in slide-in-from-top-2">
//                       <CheckCircle2 size={20} className="text-[#2E6B4A] flex-shrink-0" />
//                       <div>
//                         <p className="font-semibold text-slate-800">{record.studentId}</p>
//                         <p className="text-xs text-slate-500">
//                           {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }
//LAST WORKING IMPLEMENTATION (WED MAR 25 8:11AM)
// import React, { useState, useEffect } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { Camera, LogOut, QrCode, ChevronDown, CheckCircle2 } from 'lucide-react';
// import { getEventItems} from '../../service/attendanceService';
// import type {EventItem} from '../../service/attendanceService'

// interface ScanRecord {
//   id: string;
//   studentId: string;
//   timestamp: Date;
// }

// // REMOVED: Mock data
// // const MOCK_EVENTS: EventItem[] = [
// //   { id: '1', name: 'Seminar on AI', status: 'ongoing', time: '8:00 AM - 10:00 AM' },
// //   { id: '2', name: 'General Assembly', status: 'upcoming', time: '1:00 PM - 4:00 PM' },
// //   { id: '3', name: 'IT Week Opening', status: 'upcoming', time: 'Yesterday' },
// // ];

// export default function QRScanner() {
//   const [manualId, setManualId] = useState('');
//   const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
//   const [isScanning, setIsScanning] = useState(false);
  
//   // Dropdown states
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
//   const [events, setEvents] = useState<EventItem[]>([]);

//   // Fetch events from API
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventItems = await getEventItems();
//         setEvents(eventItems);
//         if (eventItems.length > 0) {
//           setSelectedEvent(eventItems[0]);
//         }
//       } catch (error) {
//         console.error('Failed to load events:', error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Handle successful QR Scan
//   const handleScan = (detectedCodes: { rawValue: string }[]) => {
//     if (detectedCodes && detectedCodes.length > 0) {
//       addScanRecord(detectedCodes[0].rawValue);
//     }
//   };

//   // Handle Manual Input Submit
//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (manualId.trim()) {
//       addScanRecord(manualId.trim());
//       setManualId('');
//     }
//   };

//   // Add to history and update state
//   const addScanRecord = (studentId: string) => {
//     setScanHistory(prev => {
//       // Prevent rapid duplicate scans
//       if (prev.length > 0 && prev[0].studentId === studentId) {
//         const timeDiff = new Date().getTime() - prev[0].timestamp.getTime();
//         if (timeDiff < 3000) return prev;
//       }

//       const newRecord: ScanRecord = {
//         id: Math.random().toString(36).substring(2, 9),
//         studentId,
//         timestamp: new Date(),
//       };
//       return [newRecord, ...prev];
//     });
//   };

//   // Helper function to color-code the status pills
//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'ongoing': return 'text-[#14532D] bg-[#DCFCE7]';
//       case 'upcoming': return 'text-blue-800 bg-blue-100';
//       case 'ended': return 'text-slate-600 bg-slate-200';
//       default: return 'text-slate-600 bg-slate-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
//       {/* Top Navigation Bar */}
//       <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#2E6B4A] p-2 rounded-md text-white">
//             <QrCode size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-800 leading-tight">SEAMS - Officer Portal</h1>
//             <p className="text-sm text-slate-500">QR Code Scanner</p>
//           </div>
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
//           <LogOut size={16} />
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Left Column (Scanner & Controls) */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Scanner Card */}
//             <div className="bg-white rounded-xl border-2 border-[#2E6B4A] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-2">
//                 <Camera size={20} className="text-[#2E6B4A]" />
//                 <h2 className="text-lg font-bold">QR Code Scanner</h2>
//               </div>
//               <p className="text-sm text-slate-500 mb-6">Scan student QR codes for attendance</p>

//               {/* Functional Event Selector Dropdown */}
//               <div className="mb-6 relative z-30">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Select Event *</label>
                
//                 {/* Selected Value Box */}
//                 <div 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="font-medium">{selectedEvent ? selectedEvent.name : 'Loading...'}</span>
//                     {selectedEvent && (
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(selectedEvent.status)}`}>
//                         {selectedEvent.status}
//                       </span>
//                     )}
//                   </div>
//                   <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                 </div>

//                 {/* Dropdown Menu & Invisible Overlay */}
//                 {isDropdownOpen && (
//                   <>
//                     {/* Invisible overlay to catch clicks outside the dropdown */}
//                     <div 
//                       className="fixed inset-0 z-40" 
//                       onClick={() => setIsDropdownOpen(false)}
//                     />
                    
//                     {/* Actual dropdown menu */}
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
//                       {events.map((event) => (
//                         <div
//                           key={event.id}
//                           onClick={() => {
//                             setSelectedEvent(event);
//                             setIsDropdownOpen(false);
//                           }}
//                           className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-slate-100 transition-colors"
//                         >
//                           <div className="flex-1">
//                             <span className="font-medium text-slate-700 block">{event.name}</span>
//                             <span className="text-xs text-slate-500 block mt-1">{event.time}</span>
//                           </div>
//                           <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(event.status)}`}>
//                             {event.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Camera Area */}
//               <div className="relative bg-[#0F172A] rounded-xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden mb-6 z-10">
//                 {!isScanning ? (
//                   <div className="flex flex-col items-center text-slate-400 z-10">
//                     <div className="w-32 h-32 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center mb-4">
//                       <Camera size={48} className="text-slate-500" />
//                     </div>
//                     <p className="font-medium text-slate-300">Camera scanner would appear here</p>
//                     <p className="text-sm mt-1">Click below to activate your device camera</p>
//                     <button 
//                       onClick={() => setIsScanning(true)}
//                       className="mt-4 px-4 py-2 bg-[#2E6B4A] text-white text-sm rounded-lg hover:bg-[#204e35] transition"
//                     >
//                       Start Camera
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="absolute inset-0 w-full h-full">
//                      <Scanner
//                         onScan={handleScan}
//                         components={{ finder: false }}
//                         styles={{ container: { width: '100%', height: '100%' } }}
//                      />
//                      {/* Overlay targeting box */}
//                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//                         <div className="w-48 h-48 border-2 border-[#2E6B4A] rounded-lg"></div>
//                      </div>
//                   </div>
//                 )}
//               </div>

//               {/* Manual Entry */}
//               <div className="z-10 relative">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Or enter manually:</label>
//                 <form onSubmit={handleManualSubmit} className="flex gap-3">
//                   <input
//                     type="text"
//                     value={manualId}
//                     onChange={(e) => setManualId(e.target.value)}
//                     placeholder="Enter Student ID (e.g., 2023-0444)"
//                     className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6B4A] focus:border-transparent"
//                   />
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-[#2E6B4A] text-white font-medium rounded-lg hover:bg-[#204e35] transition-colors"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Bottom Stats Cards
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Scans Today</h3>
//                 <p className="text-3xl font-bold text-slate-800">{scanHistory.length}</p>
//                 <p className="text-sm text-slate-500 mt-1">Total attendance recorded</p>
//               </div>
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Current Event</h3>
//                 <p className="text-lg font-bold text-slate-800 mt-1">{selectedEvent.name}</p>
//                 <p className="text-sm text-slate-500 mt-1">{selectedEvent.time}</p>
//               </div>
//             </div> */}

//           </div>

//          {/* Right Column (Scan History) */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full max-h-[330px] flex flex-col">
//               <h2 className="text-lg font-bold text-slate-800">Scan History</h2>
//               <p className="text-sm text-slate-500 mb-6">Recent attendance records</p>

//               {scanHistory.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                   <QrCode size={48} className="mb-4 opacity-50 text-slate-300" />
//                   <p className="font-medium text-slate-500">No scans yet</p>
//                   <p className="text-sm mt-1 text-center">Select an event and start scanning</p>
//                 </div>
//               ) : (
//                 <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
//                   {scanHistory.map((record) => (
//                     <div key={record.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg animate-in fade-in slide-in-from-top-2">
//                       <CheckCircle2 size={20} className="text-[#2E6B4A] flex-shrink-0" />
//                       <div>
//                         <p className="font-semibold text-slate-800">{record.studentId}</p>
//                         <p className="text-xs text-slate-500">
//                           {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

//LAST WORKING IMPLEMENTATION (WED MAR 25 9:09PM)
// import React, { useState, useEffect } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { Camera, LogOut, QrCode, ChevronDown, CheckCircle2 } from 'lucide-react';
// import { getEventItems} from '../../service/attendanceService';
// import type {EventItem} from '../../service/attendanceService'
// import { logOut } from '../../service/authService';
// import { useNavigate } from 'react-router-dom';

// interface ScanRecord {
//   id: string;
//   studentId: string;
//   timestamp: Date;
// }

// // REMOVED: Mock data
// // const MOCK_EVENTS: EventItem[] = [
// //   { id: '1', name: 'Seminar on AI', status: 'ongoing', time: '8:00 AM - 10:00 AM' },
// //   { id: '2', name: 'General Assembly', status: 'upcoming', time: '1:00 PM - 4:00 PM' },
// //   { id: '3', name: 'IT Week Opening', status: 'upcoming', time: 'Yesterday' },
// // ];

// export default function QRScanner() {
//   const [manualId, setManualId] = useState('');
//   const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
//   const [isScanning, setIsScanning] = useState(false);
  
//   // Dropdown states
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
//   const [events, setEvents] = useState<EventItem[]>([]);

//   const navigate = useNavigate();

//   // Fetch events from API
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventItems = await getEventItems();
//         setEvents(eventItems);
//         if (eventItems.length > 0) {
//           setSelectedEvent(eventItems[0]);
//         }
//       } catch (error) {
//         console.error('Failed to load events:', error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     logOut();
//     navigate('/login');
//   };

//   // Handle successful QR Scan
//   const handleScan = (detectedCodes: { rawValue: string }[]) => {
//     if (detectedCodes && detectedCodes.length > 0) {
//       addScanRecord(detectedCodes[0].rawValue);
//     }
//   };

//   // Handle Manual Input Submit
//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (manualId.trim()) {
//       addScanRecord(manualId.trim());
//       setManualId('');
//     }
//   };

//   // Add to history and update state
//   const addScanRecord = (studentId: string) => {
//     setScanHistory(prev => {
//       // Prevent rapid duplicate scans
//       if (prev.length > 0 && prev[0].studentId === studentId) {
//         const timeDiff = new Date().getTime() - prev[0].timestamp.getTime();
//         if (timeDiff < 3000) return prev;
//       }

//       const newRecord: ScanRecord = {
//         id: Math.random().toString(36).substring(2, 9),
//         studentId,
//         timestamp: new Date(),
//       };
//       return [newRecord, ...prev];
//     });
//   };

//   // Helper function to color-code the status pills
//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'ongoing': return 'text-[#14532D] bg-[#DCFCE7]';
//       case 'upcoming': return 'text-blue-800 bg-blue-100';
//       case 'ended': return 'text-slate-600 bg-slate-200';
//       default: return 'text-slate-600 bg-slate-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
//       {/* Top Navigation Bar */}
//       <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#2E6B4A] p-2 rounded-md text-white">
//             <QrCode size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-800 leading-tight">SEAMS - Officer Portal</h1>
//             <p className="text-sm text-slate-500">QR Code Scanner</p>
//           </div>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
//         >
//           <LogOut size={16} />
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Left Column (Scanner & Controls) */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Scanner Card */}
//             <div className="bg-white rounded-xl border-2 border-[#2E6B4A] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-2">
//                 <Camera size={20} className="text-[#2E6B4A]" />
//                 <h2 className="text-lg font-bold">QR Code Scanner</h2>
//               </div>
//               <p className="text-sm text-slate-500 mb-6">Scan student QR codes for attendance</p>

//               {/* Functional Event Selector Dropdown */}
//               <div className="mb-6 relative z-30">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Select Event *</label>
                
//                 {/* Selected Value Box */}
//                 <div 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="font-medium">{selectedEvent ? selectedEvent.name : 'Loading...'}</span>
//                     {selectedEvent && (
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(selectedEvent.status)}`}>
//                         {selectedEvent.status}
//                       </span>
//                     )}
//                   </div>
//                   <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                 </div>

//                 {/* Dropdown Menu & Invisible Overlay */}
//                 {isDropdownOpen && (
//                   <>
//                     {/* Invisible overlay to catch clicks outside the dropdown */}
//                     <div 
//                       className="fixed inset-0 z-40" 
//                       onClick={() => setIsDropdownOpen(false)}
//                     />
                    
//                     {/* Actual dropdown menu */}
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
//                       {events.map((event) => (
//                         <div
//                           key={event.id}
//                           onClick={() => {
//                             setSelectedEvent(event);
//                             setIsDropdownOpen(false);
//                           }}
//                           className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-slate-100 transition-colors"
//                         >
//                           <div className="flex-1">
//                             <span className="font-medium text-slate-700 block">{event.name}</span>
//                             <span className="text-xs text-slate-500 block mt-1">{event.time}</span>
//                           </div>
//                           <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(event.status)}`}>
//                             {event.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Camera Area */}
//               <div className="relative bg-[#0F172A] rounded-xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden mb-6 z-10">
//                 {!isScanning ? (
//                   <div className="flex flex-col items-center text-slate-400 z-10">
//                     <div className="w-32 h-32 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center mb-4">
//                       <Camera size={48} className="text-slate-500" />
//                     </div>
//                     <p className="font-medium text-slate-300">Camera scanner would appear here</p>
//                     <p className="text-sm mt-1">Click below to activate your device camera</p>
//                     <button 
//                       onClick={() => setIsScanning(true)}
//                       className="mt-4 px-4 py-2 bg-[#2E6B4A] text-white text-sm rounded-lg hover:bg-[#204e35] transition"
//                     >
//                       Start Camera
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="absolute inset-0 w-full h-full">
//                      <Scanner
//                         onScan={handleScan}
//                         components={{ finder: false }}
//                         styles={{ container: { width: '100%', height: '100%' } }}
//                      />
//                      {/* Overlay targeting box */}
//                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//                         <div className="w-48 h-48 border-2 border-[#2E6B4A] rounded-lg"></div>
//                      </div>
//                   </div>
//                 )}
//               </div>

//               {/* Manual Entry */}
//               <div className="z-10 relative">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Or enter manually:</label>
//                 <form onSubmit={handleManualSubmit} className="flex gap-3">
//                   <input
//                     type="text"
//                     value={manualId}
//                     onChange={(e) => setManualId(e.target.value)}
//                     placeholder="Enter Student ID (e.g., 2023-0444)"
//                     className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6B4A] focus:border-transparent"
//                   />
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-[#2E6B4A] text-white font-medium rounded-lg hover:bg-[#204e35] transition-colors"
//                   >
//                     Submit
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Bottom Stats Cards
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Scans Today</h3>
//                 <p className="text-3xl font-bold text-slate-800">{scanHistory.length}</p>
//                 <p className="text-sm text-slate-500 mt-1">Total attendance recorded</p>
//               </div>
//               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-medium text-slate-500 mb-1">Current Event</h3>
//                 <p className="text-lg font-bold text-slate-800 mt-1">{selectedEvent.name}</p>
//                 <p className="text-sm text-slate-500 mt-1">{selectedEvent.time}</p>
//               </div>
//             </div> */}

//           </div>

//          {/* Right Column (Scan History) */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full max-h-[330px] flex flex-col">
//               <h2 className="text-lg font-bold text-slate-800">Scan History</h2>
//               <p className="text-sm text-slate-500 mb-6">Recent attendance records</p>

//               {scanHistory.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                   <QrCode size={48} className="mb-4 opacity-50 text-slate-300" />
//                   <p className="font-medium text-slate-500">No scans yet</p>
//                   <p className="text-sm mt-1 text-center">Select an event and start scanning</p>
//                 </div>
//               ) : (
//                 <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
//                   {scanHistory.map((record) => (
//                     <div key={record.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg animate-in fade-in slide-in-from-top-2">
//                       <CheckCircle2 size={20} className="text-[#2E6B4A] flex-shrink-0" />
//                       <div>
//                         <p className="font-semibold text-slate-800">{record.studentId}</p>
//                         <p className="text-xs text-slate-500">
//                           {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }

//LAST WORKING IMPLEMENTATION (MAR 26 10:15AM)
// import React, { useState, useEffect } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { Camera, LogOut, QrCode, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
// import { getEventItems, recordAttendance } from '../../service/attendanceService';
// import type { EventItem } from '../../service/attendanceService';
// import { logOut } from '../../service/authService';
// import { useNavigate } from 'react-router-dom';

// interface ScanRecord {
//   id: string;
//   studentId: string;
//   fullName: string;
//   timestamp: Date;
//   success: boolean;
//   message?: string;
// }

// export default function QRScanner() {
//   const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
//   const [isScanning, setIsScanning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Dropdown states
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
//   const [events, setEvents] = useState<EventItem[]>([]);

//   const navigate = useNavigate();

//   // Fetch events from API
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventItems = await getEventItems();
//         setEvents(eventItems);
//         if (eventItems.length > 0) {
//           setSelectedEvent(eventItems[0]);
//         }
//       } catch (error) {
//         console.error('Failed to load events:', error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     logOut();
//     navigate('/login');
//   };

//   // Parse QR code to extract full name and student ID (format: "Full Name - StudentID")
//   const parseQRContent = (qrContent: string): { fullName: string; studentId: string } => {
//     const parts = qrContent.split(' - ');
//     if (parts.length === 2) {
//       return {
//         fullName: parts[0].trim(),
//         studentId: parts[1].trim()
//       };
//     }
//     // Fallback: if format doesn't match, use the whole string as student ID
//     return {
//       fullName: qrContent,
//       studentId: qrContent
//     };
//   };

//   // Handle successful QR Scan
//   const handleScan = async (detectedCodes: { rawValue: string }[]) => {
//     if (detectedCodes && detectedCodes.length > 0 && !isSubmitting) {
//       const qrContent = detectedCodes[0].rawValue;
      
//       // DEBUG LOGS
//       console.log('📱 QR SCANNED:', qrContent);
//       console.log('📱 Has dash?', qrContent.includes(' - '));
      
//       const { fullName, studentId } = parseQRContent(qrContent);
      
//       console.log('📝 Parsed fullName:', fullName);
//       console.log('📝 Parsed studentId:', studentId);
      
//       await submitAttendance(studentId, fullName);
//     }
//   };

//   // Submit attendance to API
//   const submitAttendance = async (studentId: string, fullName: string) => {
//     if (!selectedEvent) {
//       addToHistory(studentId, fullName, false, 'Please select an event first');
//       return;
//     }

//     if (selectedEvent.status !== 'ongoing') {
//       addToHistory(studentId, fullName, false, `Event is ${selectedEvent.status} - cannot record attendance`);
//       return;
//     }

//     setIsSubmitting(true);
    
//     // Capture frontend timestamp IMMEDIATELY when scan happens
//     const scanTimestamp = new Date();

//     try {
//       const attendanceID = parseInt(selectedEvent.id);
      
//       await recordAttendance(attendanceID, studentId);
//       addToHistory(studentId, fullName, true, 'Attendance recorded successfully', scanTimestamp);
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to record attendance';
//       addToHistory(studentId, fullName, false, errorMessage, scanTimestamp);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Add to history - now accepts optional timestamp parameter
//   const addToHistory = (
//     studentId: string, 
//     fullName: string, 
//     success: boolean, 
//     message: string,
//     scanTime: Date = new Date()  // Default to current time if not provided
//   ) => {
//     setScanHistory(prev => {
//       // Prevent rapid duplicate scans of same student
//       if (prev.length > 0 && prev[0].studentId === studentId) {
//         const timeDiff = new Date().getTime() - prev[0].timestamp.getTime();
//         if (timeDiff < 3000) return prev;
//       }

//       const newRecord: ScanRecord = {
//         id: Math.random().toString(36).substring(2, 9),
//         studentId,
//         fullName,
//         timestamp: scanTime,  // ← Use frontend timestamp
//         success,
//         message
//       };
//       return [newRecord, ...prev];
//     });
//   };

//   // Helper function to color-code the status pills
//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'ongoing': return 'text-[#14532D] bg-[#DCFCE7]';
//       case 'upcoming': return 'text-blue-800 bg-blue-100';
//       case 'ended': return 'text-slate-600 bg-slate-200';
//       default: return 'text-slate-600 bg-slate-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
//       {/* Top Navigation Bar */}
//       <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#2E6B4A] p-2 rounded-md text-white">
//             <QrCode size={24} />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-800 leading-tight">SEAMS - Officer Portal</h1>
//             <p className="text-sm text-slate-500">QR Code Scanner</p>
//           </div>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
//         >
//           <LogOut size={16} />
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Left Column (Scanner & Controls) */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Scanner Card */}
//             <div className="bg-white rounded-xl border-2 border-[#2E6B4A] p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-2">
//                 <Camera size={20} className="text-[#2E6B4A]" />
//                 <h2 className="text-lg font-bold">QR Code Scanner</h2>
//               </div>
//               <p className="text-sm text-slate-500 mb-6">Scan student QR codes for attendance</p>

//               {/* Functional Event Selector Dropdown */}
//               <div className="mb-6 relative z-30">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Select Event *</label>
                
//                 {/* Selected Value Box */}
//                 <div 
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="font-medium">{selectedEvent ? selectedEvent.name : 'Loading...'}</span>
//                     {selectedEvent && (
//                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(selectedEvent.status)}`}>
//                         {selectedEvent.status}
//                       </span>
//                     )}
//                   </div>
//                   <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//                 </div>

//                 {/* Dropdown Menu & Invisible Overlay */}
//                 {isDropdownOpen && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-40" 
//                       onClick={() => setIsDropdownOpen(false)}
//                     />
                    
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
//                       {events.map((event) => (
//                         <div
//                           key={event.id}
//                           onClick={() => {
//                             setSelectedEvent(event);
//                             setIsDropdownOpen(false);
//                           }}
//                           className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-slate-100 transition-colors"
//                         >
//                           <div className="flex-1">
//                             <span className="font-medium text-slate-700 block">{event.name}</span>
//                             <span className="text-xs text-slate-500 block mt-1">{event.time}</span>
//                           </div>
//                           <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyles(event.status)}`}>
//                             {event.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Camera Area */}
//               <div className="relative bg-[#0F172A] rounded-xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden mb-6 z-10">
//                 {!isScanning ? (
//                   <div className="flex flex-col items-center text-slate-400 z-10">
//                     <div className="w-32 h-32 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center mb-4">
//                       <Camera size={48} className="text-slate-500" />
//                     </div>
//                     <p className="font-medium text-slate-300">Camera scanner would appear here</p>
//                     <p className="text-sm mt-1">Click below to activate your device camera</p>
//                     <button 
//                       onClick={() => setIsScanning(true)}
//                       className="mt-4 px-4 py-2 bg-[#2E6B4A] text-white text-sm rounded-lg hover:bg-[#204e35] transition"
//                     >
//                       Start Camera
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="absolute inset-0 w-full h-full">
//                     <Scanner
//                       onScan={handleScan}
//                       components={{ finder: false }}
//                       styles={{ container: { width: '100%', height: '100%' } }}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//                       <div className="w-48 h-48 border-2 border-[#2E6B4A] rounded-lg"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column (Scan History) */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full max-h-[450px] flex flex-col">
//               <h2 className="text-lg font-bold text-slate-800">Scan History</h2>
//               <p className="text-sm text-slate-500 mb-6">Recent attendance records</p>

//               {scanHistory.length === 0 ? (
//                 <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                   <QrCode size={48} className="mb-4 opacity-50 text-slate-300" />
//                   <p className="font-medium text-slate-500">No scans yet</p>
//                   <p className="text-sm mt-1 text-center">Select an event and start scanning</p>
//                 </div>
//               ) : (
//                 <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
//                   {scanHistory.map((record) => (
//                     <div 
//                       key={record.id} 
//                       className={`flex items-start gap-3 p-3 rounded-lg border ${
//                         record.success 
//                           ? 'bg-green-50 border-green-200' 
//                           : 'bg-red-50 border-red-200'
//                       }`}
//                     >
//                       {record.success ? (
//                         <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
//                       ) : (
//                         <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
//                       )}
//                       <div className="flex-1">
//                         <p className="font-semibold text-slate-800">{record.fullName}</p>
//                         <p className="text-xs text-slate-400">ID: {record.studentId}</p>
//                         <p className="text-xs text-slate-500 mt-1">
//                           {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
//                         </p>
//                         {record.message && (
//                           <p className={`text-xs mt-1 ${record.success ? 'text-green-600' : 'text-red-600'}`}>
//                             {record.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, LogOut, QrCode, ChevronDown, CheckCircle2, AlertCircle, Calendar, Clock, BookOpen } from 'lucide-react';
import { getEventItems, recordAttendance } from '../../service/attendanceService';
import type { EventItem } from '../../service/attendanceService';
import { logOut } from '../../service/authService';
import { useNavigate } from 'react-router-dom';

interface ScanRecord {
  id: string;
  studentId: string;
  fullName: string;
  timestamp: Date;
  success: boolean;
  message?: string;
}

export default function QRScanner() {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventItems = await getEventItems();
        setEvents(eventItems);
        if (eventItems.length > 0) {
          setSelectedEvent(eventItems[0]);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleLogout = () => {
    logOut();
    navigate('/login');
  };

  const parseQRContent = (qrContent: string): { fullName: string; studentId: string } => {
    const parts = qrContent.split(' - ');
    if (parts.length === 2) {
      return {
        fullName: parts[0].trim(),
        studentId: parts[1].trim()
      };
    }
    return {
      fullName: qrContent,
      studentId: qrContent
    };
  };

  const handleScan = async (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes && detectedCodes.length > 0 && !isSubmitting) {
      const qrContent = detectedCodes[0].rawValue;
      const { fullName, studentId } = parseQRContent(qrContent);
      await submitAttendance(studentId, fullName);
    }
  };

  const submitAttendance = async (studentId: string, fullName: string) => {
    if (!selectedEvent) {
      addToHistory(studentId, fullName, false, 'Please select an event first');
      return;
    }

    if (selectedEvent.status !== 'ongoing') {
      addToHistory(studentId, fullName, false, `Event is ${selectedEvent.status} - cannot record attendance`);
      return;
    }

    setIsSubmitting(true);
    const scanTimestamp = new Date();

    try {
      const attendanceID = parseInt(selectedEvent.id);
      await recordAttendance(attendanceID, studentId);
      addToHistory(studentId, fullName, true, `${selectedEvent.logType} recorded`, scanTimestamp);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to record attendance';
      addToHistory(studentId, fullName, false, errorMessage, scanTimestamp);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToHistory = (
    studentId: string, 
    fullName: string, 
    success: boolean, 
    message: string,
    scanTime: Date = new Date()
  ) => {
    setScanHistory(prev => {
      if (prev.length > 0 && prev[0].studentId === studentId) {
        const timeDiff = new Date().getTime() - prev[0].timestamp.getTime();
        if (timeDiff < 3000) return prev;
      }
      const newRecord: ScanRecord = {
        id: Math.random().toString(36).substring(2, 9),
        studentId,
        fullName,
        timestamp: scanTime,
        success,
        message
      };
      return [newRecord, ...prev];
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getLogTypeStyles = (logType: string) => {
    switch (logType) {
      case 'Sign In': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Sign Out': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#2E6B4A] to-[#1e4a32] p-2 rounded-xl shadow-sm">
              <QrCode size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SEAMS</h1>
              <p className="text-xs text-slate-500">Officer Portal • QR Scanner</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera size={20} className="text-[#2E6B4A]" />
                  <h2 className="text-lg font-semibold text-slate-800">QR Code Scanner</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">Scan student QR codes to record attendance</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Event Selector Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Attendance Event
                  </label>
                  
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-[#2E6B4A] hover:bg-white transition-all duration-200 group"
                  >
                    {selectedEvent ? (
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 text-left">
                          <p className="font-medium text-slate-800">{selectedEvent.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-lg border ${getStatusStyles(selectedEvent.status)}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {selectedEvent.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-lg border ${getLogTypeStyles(selectedEvent.logType)}`}>
                              {selectedEvent.logType}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <BookOpen size={12} />
                              Sem {selectedEvent.semester}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {selectedEvent.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Loading events...</span>
                    )}
                    <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ml-3 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                        {events.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-all duration-150 ${
                              selectedEvent?.id === event.id ? 'bg-slate-50 border-l-4 border-l-[#2E6B4A]' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-slate-800">{event.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-lg border ${getStatusStyles(event.status)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {event.status}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-lg border ${getLogTypeStyles(event.logType)}`}>
                                    {event.logType}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                    <BookOpen size={12} />
                                    Sem {event.semester}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                                  <Calendar size={12} />
                                  {event.time}
                                </p>
                              </div>
                              {selectedEvent?.id === event.id && (
                                <CheckCircle2 size={18} className="text-[#2E6B4A] ml-3 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                        {events.length === 0 && (
                          <div className="px-4 py-8 text-center">
                            <QrCode size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">No active events available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Area */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl aspect-video w-full flex flex-col items-center justify-center overflow-hidden shadow-inner">
                  {!isScanning ? (
                    <div className="flex flex-col items-center text-slate-400 z-10 p-8">
                      <div className="w-24 h-24 border-2 border-dashed border-slate-500 rounded-2xl flex items-center justify-center mb-4">
                        <Camera size={40} className="text-slate-500" />
                      </div>
                      <p className="font-medium text-slate-300">Camera Inactive</p>
                      <p className="text-sm text-slate-500 mt-1">Click below to enable camera</p>
                      <button 
                        onClick={() => setIsScanning(true)}
                        className="mt-4 px-5 py-2 bg-[#2E6B4A] text-white text-sm font-medium rounded-xl hover:bg-[#204e35] transition-all shadow-sm"
                      >
                        Start Camera
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 w-full h-full">
                        <Scanner
                          onScan={handleScan}
                          components={{ finder: false }}
                          styles={{ container: { width: '100%', height: '100%' } }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-56 h-56 border-2 border-white/40 rounded-2xl shadow-lg"></div>
                      </div>
                      <button 
                        onClick={() => setIsScanning(false)}
                        className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg hover:bg-black/80 transition-all z-20"
                      >
                        Stop Camera
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Scan History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Scan History</h2>
                <p className="text-xs text-slate-500 mt-0.5">Recent attendance records</p>
              </div>

              <div className="p-5 max-h-[500px] overflow-y-auto">
                {scanHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <QrCode size={48} className="mb-3 opacity-50" />
                    <p className="font-medium text-slate-500">No scans yet</p>
                    <p className="text-xs text-center mt-1">Select an event and start scanning</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanHistory.map((record) => (
                      <div 
                        key={record.id} 
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          record.success 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        {record.success ? (
                          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{record.fullName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{record.studentId}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                          {record.message && (
                            <p className={`text-xs mt-1 ${record.success ? 'text-emerald-600' : 'text-red-600'}`}>
                              {record.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}