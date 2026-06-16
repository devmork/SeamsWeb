import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import QRScanner from "./pages/Officer/QRScanner";
import { StudentDashboard } from "./pages/StudentDashboard";
import { LoginForm } from "./pages/Auth/LoginForm";
import { SignupForm } from "./pages/Auth/SignupForm";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/officer" element={<QRScanner />} />
          <Route element={<AuthenticatedLayout role="student" />}>
            <Route
              path="/student/dashboard"
              element={<div>Student Dashboard</div>}
            />
            <Route
              path="/admin/dashboard"
              element={<div>Admin Dashboard</div>}
            />
            <Route path="/officer" element={<QRScanner />} />
            <Route
              path="/student"
              element={
                <StudentDashboard
                  onLogout={() => console.log("Logout clicked")}
                  isApproved={false}
                />
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
