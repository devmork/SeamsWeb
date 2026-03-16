import { useState } from "react";
import { QrCode, Calendar, LogOut, Menu, X, LayoutDashboard, FileText, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";


interface StudentDashboardProps {
  onLogout: () => void;
  isApproved: boolean;
}

export function StudentDashboard({ onLogout, isApproved }: StudentDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Mock student data
  const studentInfo = {
    name: "Juan Santos Dela Cruz",
    studentId: "2021-1234",
    program: "BS Computer Science",
    yearLevel: "3rd Year",
    email: "student@school.edu",
  };

  const stats = {
    totalEvents: 24,
    attendedEvents: 18,
    missedEvents: 6,
    upcomingEvents: 5,
  };

  const upcomingEvents = [
    { id: 1, name: "Seminar on AI", date: "Feb 21, 2026", time: "8:00 AM", location: "Auditorium", registered: true },
    { id: 2, name: "Workshop: Web Dev", date: "Feb 21, 2026", time: "1:00 PM", location: "Computer Lab 1", registered: true },
    { id: 3, name: "Career Fair 2026", date: "Feb 22, 2026", time: "9:00 AM", location: "Gymnasium", registered: false },
    { id: 4, name: "Coding Competition", date: "Feb 25, 2026", time: "10:00 AM", location: "Computer Lab 2", registered: true },
  ];

  const attendanceHistory = [
    { id: 1, event: "Tech Talk: Python", date: "Feb 18, 2026", status: "attended", time: "8:15 AM" },
    { id: 2, event: "Leadership Summit", date: "Feb 15, 2026", status: "attended", time: "1:05 PM" },
    { id: 3, event: "Sports Fest Opening", date: "Feb 12, 2026", status: "missed", time: "-" },
    { id: 4, event: "Orientation Day", date: "Feb 10, 2026", status: "attended", time: "9:00 AM" },
    { id: 5, event: "Club Fair", date: "Feb 8, 2026", status: "attended", time: "2:30 PM" },
  ];

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: QrCode, label: "My QR Code", active: false },
    { icon: Calendar, label: "Events", active: false },
    { icon: FileText, label: "Attendance History", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#2C5530] to-[#3d7042] bg-clip-text text-transparent">
          SEAMS
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 z-40
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-6 border-b border-gray-200 hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2C5530] to-[#3d7042] bg-clip-text text-transparent">
              SEAMS
            </h1>
            <p className="text-sm text-gray-600">Student Portal</p>
          </div>

          <nav className="p-4 space-y-2 mt-4 lg:mt-0">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${item.active
                    ? "bg-gradient-to-r from-[#2C5530] to-[#3d7042] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {studentInfo.name.split(' ')[0]}!</h2>
            <p className="text-gray-600 mt-1">{studentInfo.studentId} • {studentInfo.program}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-t-4 border-t-[#2C5530]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.attendedEvents}</div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Missed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.missedEvents}</div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Card */}
          <Card className="mb-8 border-2 border-[#2C5530]">
            <CardContent className="p-6">
              {isApproved ? (
                <>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Your QR Code</h3>
                      <p className="text-gray-600 mb-1">Show this to officers for attendance verification</p>
                      <p className="text-sm text-gray-500">Student ID: {studentInfo.studentId}</p>
                    </div>
                    <Button 
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="bg-gradient-to-r from-[#2C5530] to-[#3d7042] hover:opacity-90"
                    >
                      <QrCode size={20} className="mr-2" />
                      {showQRCode ? "Hide QR Code" : "Show QR Code"}
                    </Button>
                  </div>

                  {showQRCode && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                          {/* Placeholder for QR code - in real app, would generate actual QR */}
                          <div className="text-center">
                            <QrCode size={200} className="text-[#2C5530] mx-auto mb-2" />
                            <p className="text-sm text-gray-600">{studentInfo.studentId}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Scan this code at event check-in points
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                    <AlertCircle className="text-yellow-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">QR Code Not Available</h3>
                  <p className="text-gray-600 text-center max-w-md mb-4">
                    Your registration is currently pending approval by an administrator. 
                    Your QR code will be generated once your account is approved.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You will receive an email notification once your account has been approved. 
                      After approval, you'll be able to access your QR code for event attendance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you can attend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                        {event.registered ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Registered
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Not Registered
                          </Badge>
                        )}
                      </div>
                      {!event.registered && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full mt-3 border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530] hover:text-white"
                        >
                          Register for Event
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your recent event attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceHistory.map((record) => (
                    <div key={record.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${record.status === "attended" ? "bg-green-100" : "bg-red-100"}
                      `}>
                        {record.status === "attended" ? (
                          <CheckCircle size={20} className="text-green-700" />
                        ) : (
                          <XCircle size={20} className="text-red-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{record.event}</p>
                        <p className="text-xs text-gray-600">{record.date}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {record.status === "attended" 
                            ? `Checked in at ${record.time}` 
                            : "No attendance recorded"
                          }
                        </p>
                      </div>
                      <Badge 
                        variant={record.status === "attended" ? "default" : "destructive"}
                        className={record.status === "attended" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100" 
                          : ""}
                      >
                        {record.status === "attended" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}