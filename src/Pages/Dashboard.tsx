import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, Clock, Plus, QrCode } from "lucide-react";

const statCards = [
  {
    title: "Total Students",
    value: "1248",
    description: "Registered in system",
    icon: Users,
    borderColor: "border-t-green-700",
    iconColor: "text-green-700",
  },
  {
    title: "Active Events",
    value: "5",
    description: "Currently ongoing",
    icon: CalendarDays,
    borderColor: "border-t-green-700",
    iconColor: "text-green-700",
  },
  {
    title: "Pending Approvals",
    value: "12",
    description: "Awaiting review",
    icon: Clock,
    borderColor: "border-t-orange-500",
    iconColor: "text-orange-500",
  },
];

const recentActivity = [
  {
    id: 1,
    message: "Maria Santos scanned QR for Seminar on AI",
    time: "2 minutes ago",
    type: "qr",
  },
  {
    id: 2,
    message: "John Reyes registration approved",
    time: "15 minutes ago",
    type: "approval",
  },
  {
    id: 3,
    message: "New event 'Leadership Summit' created",
    time: "1 hour ago",
    type: "event",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin</h1>
        <p className="text-gray-500 mt-1">Here's what's happening today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${card.borderColor} p-5`}>
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                {card.value}
              </p>
              <p className="text-sm text-gray-400 mt-1">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-400 mb-4">
          Manage events and student registrations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/attendance/create")}
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-4 rounded-lg transition">
            <Plus className="w-4 h-4" />
            Create New Attendance Event
          </button>
          <button
            onClick={() => navigate("/approvals")}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-4 rounded-lg transition row-span-2">
            <Users className="w-4 h-4" />
            Review Pending Registrations
          </button>
          <button
            onClick={() => navigate("/students")}
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-4 rounded-lg transition">
            <Users className="w-4 h-4" />
            View Students
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-400 mb-4">Latest scans and approvals</p>
        <ul className="space-y-4">
          {recentActivity.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                {item.type === "qr" ? (
                  <QrCode className="w-4 h-4 text-green-700" />
                ) : (
                  <Users className="w-4 h-4 text-green-700" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.message}
                </p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
